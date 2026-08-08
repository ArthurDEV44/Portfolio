/**
 * Stripe WebGL Gradient Animation
 * Adapted from https://gist.github.com/jordienr/64bcf75f8b08641f205bd6a1a0d4ce1d
 * All Credits to Stripe.com
 */

// Converting colors to proper format
function normalizeColor(hexCode: number): [number, number, number] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

type UniformType = "float" | "int" | "vec2" | "vec3" | "vec4" | "mat4";

interface UniformConfig {
  type?: UniformType | "struct" | "array";
  value?: unknown;
  excludeFrom?: string;
  transpose?: boolean;
}

class Uniform {
  type: string;
  value: unknown;
  typeFn: string;
  excludeFrom?: string;
  transpose?: boolean;

  constructor(config: UniformConfig) {
    this.type = config.type || "float";
    this.value = config.value;
    this.excludeFrom = config.excludeFrom;
    this.transpose = config.transpose;

    const typeFnMap: Record<string, string> = {
      float: "1f",
      int: "1i",
      vec2: "2fv",
      vec3: "3fv",
      vec4: "4fv",
      mat4: "Matrix4fv",
    };
    this.typeFn = typeFnMap[this.type] || "1f";
  }

  update(_location: WebGLUniformLocation | null): void {
    // Implementation handled by MiniGl
  }

  getDeclaration(name: string, type: string, length?: number): string {
    if (this.excludeFrom === type) {
      return "";
    }

    if (this.type === "array" && Array.isArray(this.value)) {
      const firstItem = this.value[0] as Uniform;
      return (
        firstItem.getDeclaration(name, type, this.value.length) +
        `\nconst int ${name}_length = ${this.value.length};`
      );
    }

    if (this.type === "struct" && typeof this.value === "object") {
      let nameNoPrefix = name.replace("u_", "");
      nameNoPrefix =
        nameNoPrefix.charAt(0).toUpperCase() + nameNoPrefix.slice(1);
      const structFields = Object.entries(this.value as Record<string, Uniform>)
        .map(([fieldName, uniform]) =>
          uniform.getDeclaration(fieldName, type).replace(/^uniform/, ""),
        )
        .join("");
      return `uniform struct ${nameNoPrefix} {\n${structFields}\n} ${name}${length && length > 0 ? `[${length}]` : ""};`;
    }

    return `uniform ${this.type} ${name}${length && length > 0 ? `[${length}]` : ""};`;
  }
}

class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: Mesh[] = [];
  commonUniforms: Record<string, Uniform>;
  width = 0;
  height = 0;

  constructor(
    canvas: HTMLCanvasElement,
    width?: number | null,
    height?: number | null,
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("webgl", { antialias: true });
    if (!context) {
      throw new Error("WebGL not supported");
    }
    this.gl = context;

    if (width && height) {
      this.setSize(width, height);
    }

    const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new Uniform({ type: "mat4", value: identityMatrix }),
      modelViewMatrix: new Uniform({ type: "mat4", value: identityMatrix }),
      resolution: new Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new Uniform({ type: "float", value: 1 }),
    };
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.commonUniforms.resolution.value = [width, height];
    this.commonUniforms.aspectRatio.value = width / height;
  }

  setOrthographicCamera(
    left = 0,
    right = 0,
    top = 0,
    near = -2000,
    far = 2000,
  ): void {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      2 / (near - far),
      0,
      left,
      right,
      top,
      1,
    ];
  }

  render(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    for (const mesh of this.meshes) {
      mesh.draw();
    }
  }
}

class Material {
  gl: WebGLRenderingContext;
  minigl: MiniGl;
  uniforms: Record<string, Uniform>;
  uniformInstances: Array<{
    uniform: Uniform;
    location: WebGLUniformLocation | null;
  }> = [];
  program: WebGLProgram;

  constructor(
    minigl: MiniGl,
    vertexShaders: string,
    fragments: string,
    uniforms: Record<string, Uniform> = {},
  ) {
    this.minigl = minigl;
    this.gl = minigl.gl;
    this.uniforms = uniforms;

    const getUniformDeclarations = (
      uniformsObj: Record<string, Uniform>,
      type: string,
    ): string => {
      return Object.entries(uniformsObj)
        .map(([name, uniform]) => uniform.getDeclaration(name, type))
        .join("\n");
    };

    const prefix = "\n precision highp float;\n ";

    const vertexSource = `
      ${prefix}
      attribute vec4 position;
      attribute vec2 uv;
      attribute vec2 uvNorm;
      ${getUniformDeclarations(minigl.commonUniforms, "vertex")}
      ${getUniformDeclarations(uniforms, "vertex")}
      ${vertexShaders}
    `;

    const fragmentSource = `
      ${prefix}
      ${getUniformDeclarations(minigl.commonUniforms, "fragment")}
      ${getUniformDeclarations(uniforms, "fragment")}
      ${fragments}
    `;

    const vertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      vertexSource,
    );
    const fragmentShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      fragmentSource,
    );

    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create WebGL program");
    }
    this.program = program;
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
    }

    // useProgram is a WebGL method, not a React hook
    this.gl.useProgram(this.program);
    this.attachUniforms(undefined, minigl.commonUniforms);
    this.attachUniforms(undefined, uniforms);
  }

  compileShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create WebGL shader");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  attachUniforms(
    name: string | undefined,
    uniforms: Record<string, Uniform> | Uniform,
  ): void {
    if (name === undefined) {
      for (const [uniformName, uniform] of Object.entries(
        uniforms as Record<string, Uniform>,
      )) {
        this.attachUniforms(uniformName, uniform);
      }
    } else if ((uniforms as Uniform).type === "array") {
      const arrayUniform = uniforms as Uniform;
      const values = arrayUniform.value as Uniform[];
      for (let i = 0; i < values.length; i++) {
        this.attachUniforms(`${name}[${i}]`, values[i]);
      }
    } else if ((uniforms as Uniform).type === "struct") {
      const structUniform = uniforms as Uniform;
      const values = structUniform.value as Record<string, Uniform>;
      for (const [fieldName, fieldUniform] of Object.entries(values)) {
        this.attachUniforms(`${name}.${fieldName}`, fieldUniform);
      }
    } else {
      this.uniformInstances.push({
        uniform: uniforms as Uniform,
        location: this.gl.getUniformLocation(this.program, name),
      });
    }
  }
}

class Attribute {
  gl: WebGLRenderingContext;
  type: number;
  normalized: boolean;
  buffer: WebGLBuffer;
  size: number;
  target: number;
  values?: Float32Array | Uint16Array;

  constructor(gl: WebGLRenderingContext, config: Partial<Attribute>) {
    this.gl = gl;
    this.type = config.type || gl.FLOAT;
    this.normalized = config.normalized || false;
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create WebGL buffer");
    }
    this.buffer = buffer;
    this.size = config.size || 3;
    this.target = config.target || gl.ARRAY_BUFFER;
    this.values = config.values;
    this.update();
  }

  update(): void {
    if (this.values) {
      this.gl.bindBuffer(this.target, this.buffer);
      this.gl.bufferData(this.target, this.values, this.gl.STATIC_DRAW);
    }
  }

  attach(name: string, program: WebGLProgram): number {
    const location = this.gl.getAttribLocation(program, name);
    if (this.target === this.gl.ARRAY_BUFFER) {
      this.gl.enableVertexAttribArray(location);
      this.gl.vertexAttribPointer(
        location,
        this.size,
        this.type,
        this.normalized,
        0,
        0,
      );
    }
    return location;
  }

  use(location: number): void {
    this.gl.bindBuffer(this.target, this.buffer);
    if (this.target === this.gl.ARRAY_BUFFER) {
      this.gl.enableVertexAttribArray(location);
      this.gl.vertexAttribPointer(
        location,
        this.size,
        this.type,
        this.normalized,
        0,
        0,
      );
    }
  }
}

class PlaneGeometry {
  gl: WebGLRenderingContext;
  attributes: {
    position: Attribute;
    uv: Attribute;
    uvNorm: Attribute;
    index: Attribute;
  };
  xSegCount = 1;
  ySegCount = 1;
  vertexCount = 0;
  quadCount = 0;
  width = 1;
  height = 1;
  orientation = "xz";

  constructor(
    gl: WebGLRenderingContext,
    width?: number,
    height?: number,
    xSegments?: number,
    ySegments?: number,
    orientation?: string,
  ) {
    this.gl = gl;
    this.attributes = {
      position: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 3 }),
      uv: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 2 }),
      uvNorm: new Attribute(gl, { target: gl.ARRAY_BUFFER, size: 2 }),
      index: new Attribute(gl, {
        target: gl.ELEMENT_ARRAY_BUFFER,
        size: 3,
        type: gl.UNSIGNED_SHORT,
      }),
    };
    this.setTopology(xSegments, ySegments);
    this.setSize(width, height, orientation);
  }

  setTopology(xSegments = 1, ySegments = 1): void {
    this.xSegCount = xSegments;
    this.ySegCount = ySegments;
    this.vertexCount = (this.xSegCount + 1) * (this.ySegCount + 1);
    this.quadCount = this.xSegCount * this.ySegCount * 2;
    this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
    this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
    this.attributes.index.values = new Uint16Array(3 * this.quadCount);

    for (let y = 0; y <= this.ySegCount; y++) {
      for (let x = 0; x <= this.xSegCount; x++) {
        const i = y * (this.xSegCount + 1) + x;
        this.attributes.uv.values[2 * i] = x / this.xSegCount;
        this.attributes.uv.values[2 * i + 1] = 1 - y / this.ySegCount;
        this.attributes.uvNorm.values[2 * i] = (x / this.xSegCount) * 2 - 1;
        this.attributes.uvNorm.values[2 * i + 1] = 1 - (y / this.ySegCount) * 2;

        if (x < this.xSegCount && y < this.ySegCount) {
          const s = y * this.xSegCount + x;
          this.attributes.index.values[6 * s] = i;
          this.attributes.index.values[6 * s + 1] = i + 1 + this.xSegCount;
          this.attributes.index.values[6 * s + 2] = i + 1;
          this.attributes.index.values[6 * s + 3] = i + 1;
          this.attributes.index.values[6 * s + 4] = i + 1 + this.xSegCount;
          this.attributes.index.values[6 * s + 5] = i + 2 + this.xSegCount;
        }
      }
    }

    this.attributes.uv.update();
    this.attributes.uvNorm.update();
    this.attributes.index.update();
  }

  setSize(width = 1, height = 1, orientation = "xz"): void {
    this.width = width;
    this.height = height;
    this.orientation = orientation;

    if (
      !this.attributes.position.values ||
      this.attributes.position.values.length !== 3 * this.vertexCount
    ) {
      this.attributes.position.values = new Float32Array(3 * this.vertexCount);
    }

    const halfWidth = width / -2;
    const halfHeight = height / -2;
    const segmentWidth = width / this.xSegCount;
    const segmentHeight = height / this.ySegCount;

    for (let yIndex = 0; yIndex <= this.ySegCount; yIndex++) {
      const yPos = halfHeight + yIndex * segmentHeight;
      for (let xIndex = 0; xIndex <= this.xSegCount; xIndex++) {
        const xPos = halfWidth + xIndex * segmentWidth;
        const vertexIndex = yIndex * (this.xSegCount + 1) + xIndex;
        (this.attributes.position.values as Float32Array)[
          3 * vertexIndex + "xyz".indexOf(orientation[0])
        ] = xPos;
        (this.attributes.position.values as Float32Array)[
          3 * vertexIndex + "xyz".indexOf(orientation[1])
        ] = -yPos;
      }
    }

    this.attributes.position.update();
  }
}

class Mesh {
  minigl: MiniGl;
  geometry: PlaneGeometry;
  material: Material;
  wireframe = false;
  attributeInstances: Array<{ attribute: Attribute; location: number }> = [];

  constructor(minigl: MiniGl, geometry: PlaneGeometry, material: Material) {
    this.minigl = minigl;
    this.geometry = geometry;
    this.material = material;

    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      this.attributeInstances.push({
        attribute,
        location: attribute.attach(name, material.program),
      });
    }

    minigl.meshes.push(this);
  }

  draw(): void {
    const gl = this.minigl.gl;
    // WebGL API call, not a React hook
    gl.useProgram(this.material.program);

    for (const { uniform, location } of this.material.uniformInstances) {
      if (location === null) continue;

      const value = uniform.value;
      const typeFn = uniform.typeFn;

      if (typeFn === "1f") {
        gl.uniform1f(location, value as number);
      } else if (typeFn === "1i") {
        gl.uniform1i(location, value as number);
      } else if (typeFn === "2fv") {
        gl.uniform2fv(location, value as Float32List);
      } else if (typeFn === "3fv") {
        gl.uniform3fv(location, value as Float32List);
      } else if (typeFn === "4fv") {
        gl.uniform4fv(location, value as Float32List);
      } else if (typeFn === "Matrix4fv") {
        gl.uniformMatrix4fv(location, false, value as Float32List);
      }
    }

    for (const { attribute, location } of this.attributeInstances) {
      attribute.use(location);
    }

    gl.drawElements(
      this.wireframe ? gl.LINES : gl.TRIANGLES,
      this.geometry.attributes.index.values?.length ?? 0,
      gl.UNSIGNED_SHORT,
      0,
    );
  }

  remove(): void {
    this.minigl.meshes = this.minigl.meshes.filter((m) => m !== this);
  }
}

// Shader sources
const shaderFiles = {
  vertex: `varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;

  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  vec2 st = 1. - uvNorm.xy;

  // Tilting the plane
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  // Vertex noise
  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  // Fade noise to zero at edges
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

  // Clamp to 0
  noise = max(0.0, noise);

  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  // Vertex color
  if (u_active_colors[0] == 1.) {
    v_color = u_baseColor;
  }

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];

      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );

      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,

  noise: `// Simplex noise - https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`,

  blend: `// Blend modes - https://github.com/jamieowen/glsl-blend
vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}`,

  fragment: `varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`,
};

export interface GradientConfig {
  colors: string[];
  density?: [number, number];
  angle?: number;
  amplitude?: number;
  seed?: number;
  wireframe?: boolean;
  darkenTop?: boolean;
}

export class Gradient {
  private el: HTMLCanvasElement | null = null;
  private minigl: MiniGl | null = null;
  private mesh: Mesh | null = null;
  private material: Material | null = null;
  private geometry: PlaneGeometry | null = null;
  private uniforms: Record<string, Uniform> | null = null;

  private conf = {
    density: [0.06, 0.16] as [number, number],
    playing: true,
  };

  private t = 1253106;
  private last = 0;
  private width = 0;
  private height = 600;
  private xSegCount = 0;
  private ySegCount = 0;
  private amp = 320;
  private seed = 5;
  private freqX = 14e-5;
  private freqY = 29e-5;
  private activeColors = [1, 1, 1, 1];
  private angle = 0;
  private sectionColors: [number, number, number][] = [];
  private animationFrameId: number | null = null;
  private darkenTop = false;

  constructor(config: GradientConfig) {
    if (config.density) {
      this.conf.density = config.density;
    }
    if (config.angle !== undefined) {
      this.angle = config.angle;
    }
    if (config.amplitude !== undefined) {
      this.amp = config.amplitude;
    }
    if (config.seed !== undefined) {
      this.seed = config.seed;
    }
    if (config.darkenTop !== undefined) {
      this.darkenTop = config.darkenTop;
    }

    // Parse colors
    this.sectionColors = config.colors.map((hex) => {
      const cleanHex = hex.replace("#", "");
      return normalizeColor(Number.parseInt(cleanHex, 16));
    });
  }

  initGradient(canvas: HTMLCanvasElement): this {
    this.el = canvas;
    this.connect();
    return this;
  }

  private connect(): void {
    if (!this.el) return;

    this.minigl = new MiniGl(this.el, null, null);
    this.initMesh();
    this.resize();
    requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
  }

  private initMaterial(): Material {
    if (!this.minigl) throw new Error("MiniGl not initialized");

    this.uniforms = {
      u_time: new Uniform({ value: 0 }),
      u_shadow_power: new Uniform({ value: this.width < 600 ? 5 : 6 }),
      u_darken_top: new Uniform({ value: this.darkenTop ? 1 : 0 }),
      u_active_colors: new Uniform({
        value: this.activeColors,
        type: "vec4",
      }),
      u_global: new Uniform({
        value: {
          noiseFreq: new Uniform({
            value: [this.freqX, this.freqY],
            type: "vec2",
          }),
          noiseSpeed: new Uniform({ value: 5e-6 }),
        },
        type: "struct",
      }),
      u_vertDeform: new Uniform({
        value: {
          incline: new Uniform({
            value: Math.sin(this.angle) / Math.cos(this.angle),
          }),
          offsetTop: new Uniform({ value: -0.5 }),
          offsetBottom: new Uniform({ value: -0.5 }),
          noiseFreq: new Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp: new Uniform({ value: this.amp }),
          noiseSpeed: new Uniform({ value: 10 }),
          noiseFlow: new Uniform({ value: 3 }),
          noiseSeed: new Uniform({ value: this.seed }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new Uniform({
        value: this.sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new Uniform({
        value: [] as Uniform[],
        excludeFrom: "fragment",
        type: "array",
      }),
    };

    // Add wave layers for additional colors
    for (let i = 1; i < this.sectionColors.length; i++) {
      (this.uniforms.u_waveLayers.value as Uniform[]).push(
        new Uniform({
          value: {
            color: new Uniform({
              value: this.sectionColors[i],
              type: "vec3",
            }),
            noiseFreq: new Uniform({
              value: [
                2 + i / this.sectionColors.length,
                3 + i / this.sectionColors.length,
              ],
              type: "vec2",
            }),
            noiseSpeed: new Uniform({ value: 11 + 0.3 * i }),
            noiseFlow: new Uniform({ value: 6.5 + 0.3 * i }),
            noiseSeed: new Uniform({ value: this.seed + 10 * i }),
            noiseFloor: new Uniform({ value: 0.1 }),
            noiseCeil: new Uniform({ value: 0.63 + 0.07 * i }),
          },
          type: "struct",
        }),
      );
    }

    const vertexShader = [
      shaderFiles.noise,
      shaderFiles.blend,
      shaderFiles.vertex,
    ].join("\n\n");

    return new Material(
      this.minigl,
      vertexShader,
      shaderFiles.fragment,
      this.uniforms,
    );
  }

  private initMesh(): void {
    if (!this.minigl) return;
    this.material = this.initMaterial();
    this.geometry = new PlaneGeometry(this.minigl.gl);
    this.mesh = new Mesh(this.minigl, this.geometry, this.material);
  }

  private resize = (): void => {
    if (!this.el || !this.minigl || !this.mesh || !this.uniforms) return;

    const rect = this.el.parentElement?.getBoundingClientRect();
    this.width = rect?.width || window.innerWidth;
    this.height = rect?.height || 600;

    this.minigl.setSize(this.width, this.height);
    this.minigl.setOrthographicCamera();

    this.xSegCount = Math.ceil(this.width * this.conf.density[0]);
    this.ySegCount = Math.ceil(this.height * this.conf.density[1]);

    this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount);
    this.mesh.geometry.setSize(this.width, this.height);
    this.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6;
  };

  private shouldSkipFrame(timestamp: number): boolean {
    return (
      !this.conf.playing || Number.parseInt(String(timestamp), 10) % 2 === 0
    );
  }

  private animate = (timestamp: number): void => {
    if (!this.shouldSkipFrame(timestamp)) {
      this.t += Math.min(timestamp - this.last, 1000 / 15);
      this.last = timestamp;

      if (this.uniforms) {
        this.uniforms.u_time.value = this.t;
      }
      this.minigl?.render();
    }

    if (this.conf.playing) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  play(): void {
    if (!this.conf.playing) {
      this.conf.playing = true;
      requestAnimationFrame(this.animate);
    }
  }

  pause(): void {
    this.conf.playing = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  disconnect(): void {
    this.pause();
    window.removeEventListener("resize", this.resize);
    if (this.mesh) {
      this.mesh.remove();
    }
    this.el = null;
    this.minigl = null;
    this.mesh = null;
    this.material = null;
    this.geometry = null;
    this.uniforms = null;
  }
}
