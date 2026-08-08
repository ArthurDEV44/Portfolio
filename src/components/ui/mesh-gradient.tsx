"use client";

import { useEffect, useRef, useState } from "react";

import { Gradient } from "@/lib/gradient";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#f1ebe8", // Porcelain canvas
  "#ebe3e7", // Porcelain elevated
  "#ded4e2", // Porcelain panel
  "#334499", // Porcelain indigo
];

interface MeshGradientProps {
  colors?: string[];
  density?: [number, number];
  amplitude?: number;
  speed?: number;
  seed?: number;
  darkenTop?: boolean;
  className?: string;
}

const isWebGLSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
};

export function MeshGradient({
  colors = DEFAULT_COLORS,
  density = [0.04, 0.12],
  amplitude = 400,
  seed = 42,
  darkenTop = false,
  className,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<Gradient | null>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !webGLSupported) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const gradient = new Gradient({
      colors,
      density,
      amplitude,
      seed,
      darkenTop,
    });

    gradientRef.current = gradient;
    gradient.initGradient(canvasRef.current);

    // Pause animation if user prefers reduced motion
    if (prefersReducedMotion) {
      gradient.pause();
    }

    return () => {
      gradient.disconnect();
    };
  }, [colors, density, amplitude, seed, darkenTop, webGLSupported]);

  // Pause when out of viewport for performance
  useEffect(() => {
    if (!canvasRef.current || !gradientRef.current || !webGLSupported) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const gradient = gradientRef.current;
        if (!gradient) return;

        if (entry.isIntersecting) {
          gradient.play();
        } else {
          gradient.pause();
        }
      },
      { threshold: 0 },
    );

    observer.observe(canvasRef.current);

    return () => {
      observer.disconnect();
    };
  }, [webGLSupported]);

  // Static fallback when WebGL is not supported
  if (!webGLSupported) {
    return (
      <div
        className={cn("absolute inset-0", className)}
        style={{
          background: `linear-gradient(135deg, ${colors.join(", ")})`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ isolation: "isolate" }}
    />
  );
}
