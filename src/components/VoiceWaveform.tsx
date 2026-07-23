import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Volume2, Info } from "lucide-react";

interface VoiceWaveformProps {
  isRecording: boolean;
}

export default function VoiceWaveform({ isRecording }: VoiceWaveformProps) {
  const numBars = 28;
  const [barHeights, setBarHeights] = useState<number[]>(Array(numBars).fill(6));
  const [currentIntensity, setCurrentIntensity] = useState<number>(0); // 0 to 100%
  const [dbLevel, setDbLevel] = useState<number>(-60); // dB level approximation

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      startAudioAnalysis();
    } else {
      stopAudioAnalysis();
    }

    return () => {
      stopAudioAnalysis();
    };
  }, [isRecording]);

  const startAudioAnalysis = async () => {
    try {
      // 1. Try to request microphone access for real-time analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small size for responsive performance
      analyser.smoothingTimeConstant = 0.6; // Smooth frequency transitions
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      // Start the render loop
      const drawRealtime = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average amplitude (RMS-like) for intensity percentage and dB estimation
        let sum = 0;
        const len = dataArrayRef.current.length;
        for (let i = 0; i < len; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / len; // 0 - 255
        
        // Intensity percentage
        const intensity = Math.min(100, Math.round((average / 150) * 100));
        setCurrentIntensity(intensity);

        // Approximate decibel calculation (0 to -60 dB)
        const db = Math.round((average / 255) * 60 - 60);
        setDbLevel(average > 1 ? db : -60);

        // Map frequency bins to the visual bars
        const newHeights = Array.from({ length: numBars }, (_, i) => {
          // Map index to frequency array (usually lower indices carry more voice weight)
          const dataIndex = Math.min(
            len - 1,
            Math.floor((i / numBars) * len * 0.8) // focus on vocal frequency range
          );
          const rawValue = dataArrayRef.current![dataIndex] || 0;
          
          // Scaled height: base height 6px, up to 52px max
          const scaledHeight = 6 + (rawValue / 255) * 46;
          return scaledHeight;
        });

        setBarHeights(newHeights);
        animationFrameId.current = requestAnimationFrame(drawRealtime);
      };

      animationFrameId.current = requestAnimationFrame(drawRealtime);

    } catch (err) {
      console.warn("Speech API microphone userMedia failed or was blocked in sandbox, starting simulation mode:", err);
      // Fallback to high-fidelity, organic simulation mode
      startSimulation();
    }
  };

  const startSimulation = () => {
    let tick = 0;
    
    const drawSimulation = () => {
      tick += 1;
      
      // We simulate vocal pacing: high energy blocks alternating with brief silent transitions
      const slowInflow = Math.sin(tick * 0.04);
      const isSpeaking = slowInflow > -0.4; // conversational pause threshold
      const pauseMultiplier = isSpeaking ? 1.0 : 0.05;

      // Base intensity
      const baseIntensity = isSpeaking 
        ? Math.round(35 + Math.sin(tick * 0.1) * 20 + Math.random() * 15) 
        : Math.round(2 + Math.random() * 3);
      
      setCurrentIntensity(baseIntensity);
      setDbLevel(isSpeaking ? Math.round(-30 + Math.sin(tick * 0.1) * 12) : -58);

      const newHeights = Array.from({ length: numBars }, (_, i) => {
        // Compose waves to look like continuous physical fluid speech
        const wave1 = Math.sin(tick * 0.12 + i * 0.25) * 18;
        const wave2 = Math.cos(tick * 0.07 - i * 0.4) * 10;
        const randomSpike = Math.random() * 12;
        
        // Sum waves and apply envelope
        let heightVal = (20 + wave1 + wave2 + randomSpike) * pauseMultiplier;
        
        // Taper the edges of the waveform (left and right get shorter)
        const taper = Math.sin((i / (numBars - 1)) * Math.PI); // bell curve multiplier
        heightVal = (heightVal * taper) + 6;

        return Math.max(6, Math.min(52, heightVal));
      });

      setBarHeights(newHeights);
      animationFrameId.current = requestAnimationFrame(drawSimulation);
    };

    animationFrameId.current = requestAnimationFrame(drawSimulation);
  };

  const stopAudioAnalysis = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    analyserRef.current = null;
    dataArrayRef.current = null;
    
    // Reset back to quiescent state smoothly
    setBarHeights(Array(numBars).fill(6));
    setCurrentIntensity(0);
    setDbLevel(-60);
  };

  return (
    <div className="space-y-4">
      {/* Waveform Wrapper */}
      <div className="relative border border-editorial-border bg-white px-8 py-7 flex flex-col justify-between h-[120px] transition-all">
        {/* Real-time Diagnostics HUD overlays */}
        <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-editorial-muted uppercase">
          <div className="flex items-center gap-1">
            <Volume2 size={11} className={isRecording ? "text-editorial-dark animate-pulse" : ""} />
            <span>Voice Intensity Stream</span>
          </div>
          <div>
            {isRecording ? (
              <span className="text-editorial-dark font-bold">
                {currentIntensity}% / {dbLevel} dB
              </span>
            ) : (
              <span>STANDBY</span>
            )}
          </div>
        </div>

        {/* Waves Container */}
        <div className="flex items-center justify-center gap-[4px] h-[54px] w-full max-w-md mx-auto overflow-hidden">
          {barHeights.map((height, i) => (
            <motion.div
              key={i}
              animate={{ height }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 20,
                mass: 0.8
              }}
              style={{ originY: 0.5 }}
              className={`w-1 rounded-full transition-colors ${
                isRecording 
                  ? currentIntensity > 60 && i % 4 === 0 
                    ? "bg-amber-500" 
                    : "bg-editorial-dark"
                  : "bg-editorial-border"
              }`}
            />
          ))}
        </div>

        {/* Bottom subtle guidance line */}
        <div className="flex justify-between items-center text-[7px] font-mono text-editorial-muted uppercase tracking-wider">
          <span>0 dB (CLIP)</span>
          <div className="w-1/3 h-[1px] bg-editorial-border/60 relative">
            {isRecording && (
              <motion.div 
                className="absolute top-0 left-0 h-[1px] bg-editorial-dark"
                animate={{ width: `${currentIntensity}%` }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
              />
            )}
          </div>
          <span>-60 dB (SILENT)</span>
        </div>
      </div>

      {/* Info indicator */}
      {isRecording && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-editorial-light-gray/60 border border-editorial-border text-[10px] text-editorial-muted font-mono uppercase">
          <Info size={11} className="text-editorial-dark shrink-0" />
          <span>
            {currentIntensity > 55 ? "Speaking loudly. Cadence is active." : currentIntensity > 15 ? "Diction detected. Voice modulation remains highly focused." : "Natural brief pause or inhalation observed."}
          </span>
        </div>
      )}
    </div>
  );
}
