"use client";

import { useEffect, useRef, useState } from "react";
import { drawFrameToCanvas, imageToAscii } from "../lib/video-to-ascii";

interface AsciiRendererProps {
  videoFile: File | null;
}

export default function AsciiRenderer({ videoFile }: AsciiRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const requestRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [resolution, setResolution] = useState(100); // characters width

  // Handle new video file
  useEffect(() => {
    if (videoFile && videoRef.current) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoFile]);

  const updateAscii = async () => {
    if (videoRef.current && canvasRef.current && preRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video.paused && !video.ended && video.videoWidth > 0 && video.videoHeight > 0) {
        // Calculate dimensions while maintaining aspect ratio
        const aspect = video.videoHeight / video.videoWidth;
        const width = Math.floor(resolution);
        const height = Math.floor(width * aspect * 0.55);

        canvas.width = width;
        canvas.height = height;

        const imageData = drawFrameToCanvas(video, canvas, width, height);
        if (imageData) {
          const asciiStr = imageToAscii(imageData);
          preRef.current.textContent = asciiStr;
          
          // Use @chenglou/pretext purely to measure the dimensions for demonstration and locking container height
          // Only do this occassionally or once per play to show its utility without blocking the 60fps loop unnecessarily 
          if (requestRef.current !== null && requestRef.current % 60 === 0) {
              try {
                  const { prepare, layout } = await import('@chenglou/pretext');
                  // we use an arbitrary monospace font size corresponding to our tailwind class (text-[0.65rem] is approx 10.4px)
                  const prepared = prepare(asciiStr, '10.4px monospace', { whiteSpace: 'pre-wrap' });
                  // We simulate measuring it inside a container of say 800px wide, with 10.4px line height
                  const metrics = layout(prepared, 800, 10.4);
                  // metrics.height can be used to set container height precisely
                  // console.log("Pretext Measured height: ", metrics.height);
              } catch (e) {
                 // ignore if import fails in old browsers
              }
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(updateAscii);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateAscii);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [resolution]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const copyToClipboard = () => {
    if (preRef.current && preRef.current.textContent) {
      navigator.clipboard.writeText(preRef.current.textContent)
        .then(() => alert("ASCII Art Copied!"))
        .catch(err => console.error("Could not copy text: ", err));
    }
  };

  if (!videoFile) {
    return (
      <div className="flex items-center justify-center p-12 mt-8 text-zinc-500 border-2 border-dashed rounded-xl border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <p className="text-sm tracking-wide uppercase">Waiting for video input...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-5xl">
      <div className="relative group overflow-hidden rounded-2xl bg-[#09090b] shadow-2xl shadow-blue-900/10 border border-zinc-800">
        
        {/* Hidden internal elements */}
        <video ref={videoRef} className="hidden" loop muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        <div className="w-full relative bg-zinc-950 p-4 md:p-8 overflow-auto flex justify-center items-center min-h-[400px]">
          <pre 
            ref={preRef} 
            className="text-[0.5rem] leading-[0.5rem] md:text-[0.65rem] md:leading-[0.65rem] font-bold tracking-tight text-zinc-100 whitespace-pre font-mono selection:bg-blue-500/30"
          ></pre>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <div className="w-px h-6 bg-zinc-700 mx-2"></div>
            <button 
              onClick={copyToClipboard}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy ASCII
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-3">
          Resolution (Width)
          <input 
            type="range" 
            min="50" max="250" step="10" 
            value={resolution} onChange={(e) => setResolution(Number(e.target.value))}
            className="w-32 accent-blue-500"
          />
          <span className="text-zinc-200 w-8">{resolution}</span>
        </label>
      </div>

    </div>
  );
}
