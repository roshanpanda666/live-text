"use client";

import { useState, useRef } from "react";
import AsciiRenderer from "../components/AsciiRenderer";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden font-sans pb-24">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-[120px] opacity-20 bg-gradient-to-b from-blue-600 to-purple-600 w-[600px] h-[400px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center pt-24 px-6 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex-wrap gap-1">
            <span>Powered by @chenglou/pretext</span>
            <span className="text-blue-500/50 hidden sm:inline">|</span>
            
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-white to-zinc-400 drop-shadow-sm">
            Live Text
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Transform any video into real-time, dynamic ASCII art. 
            Upload an MP4 and watch the pixels convert into text instantly.
          </p>
        </div>

        {/* Upload Button */}
        <div className="relative group w-full max-w-md mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
          <button 
            onClick={triggerUpload}
            className="relative w-full flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <span className="text-zinc-200 font-medium text-lg">Select a Video File</span>
            <span className="text-zinc-500 text-sm mt-2">MP4, WebM formats supported</span>
          </button>
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>

        {/* Video to ASCII Renderer Component */}
        <AsciiRenderer videoFile={file} />

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-zinc-500 text-sm w-full mt-auto">
        <p>
          Made with love by Roshan -{" "}
          <a
            href="https://github.com/roshanpanda666"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline underline-offset-4"
          >
            https://github.com/roshanpanda666
          </a>
        </p>
      </footer>
    </div>
  );
}
