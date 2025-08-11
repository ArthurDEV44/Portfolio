import { personalInfo } from '@/data/portfolio';
import Image from 'next/image';

export default function TarifsFooterSection() {
  const techStack = [
    { name: "Next.js", textColor: "text-blue-300", borderColor: "border-blue-500/30" },
    { name: "React.js", textColor: "text-cyan-300", borderColor: "border-cyan-500/30" },
    { name: "Vercel", textColor: "text-white", borderColor: "border-white/30" }
  ];

  return (
    <footer className="bg-gradient-to-tl from-sky-950/50 to-black py-8 sm:py-10 lg:py-12 mt-12 sm:mt-16 lg:mt-20 relative">      
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center">
              <Image src="/icon-192x192.png" alt="Strive X" width={32} height={32} className="sm:w-10 sm:h-10 mr-2 sm:mr-3" />
              <span className="text-xl sm:text-2xl font-bold text-white">
                Strive X
              </span>
            </div>
          </div>
          
          {/* Tech stack badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-0">
            {techStack.map((tech, index) => (
              <span 
                key={index}
                className={`px-2 sm:px-3 py-1 bg-zinc-800/60 ${tech.textColor} rounded-full text-xs sm:text-sm font-mono border ${tech.borderColor}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
          
          {/* Contact info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4Z"/>
              </svg>
              <span className="font-mono break-all">{personalInfo.email}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
              </svg>
              <span className="font-mono">{personalInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
