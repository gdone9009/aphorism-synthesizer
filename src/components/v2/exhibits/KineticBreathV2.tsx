import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../../../services/audioSynth';
import { Mic, StopCircle } from 'lucide-react';

interface Particle {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
}

const WORDS_V2 = ['속도', '소음', '미래', '기계', '바람', '침묵', '0', '연기', '파편', '전화', '엔진', '구체시'];

export const KineticBreathV2: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number | null>(null);

  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const text = WORDS_V2[i % WORDS_V2.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 170;
      const baseX = width / 2 + Math.cos(angle) * radius;
      const baseY = height / 2 + Math.sin(angle) * radius;

      particles.push({
        text,
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        baseX,
        baseY,
        size: Math.floor(Math.random() * 8) + 14,
      });
    }
    particlesRef.current = particles;
  };

  const toggleMic = async () => {
    audioSynth.playClick();
    if (micActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setMicActive(false);
      setVolume(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;

        src.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        setMicActive(true);
      } catch (e) {
        console.warn('Microphone error:', e);
        alert('마이크 접근 실패.');
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 450;

    initParticles(canvas.width, canvas.height);

    const dataArray = new Uint8Array(128);

    const render = () => {
      let currentVol = 0;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        currentVol = sum / dataArray.length;
        setVolume(Math.min(100, Math.floor(currentVol)));
      }

      ctx.fillStyle = 'rgba(251, 250, 245, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentVol < 20) {
        ctx.font = '900 240px "Crimson Pro", serif';
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', canvas.width / 2, canvas.height / 2);
      }

      particlesRef.current.forEach((p) => {
        if (currentVol > 20) {
          const force = (currentVol - 20) * 0.18;
          p.vx += (Math.random() - 0.5) * force;
          p.vy += (Math.random() - 0.5) * force;
        } else {
          p.vx += (p.baseX - p.x) * 0.03;
          p.vy += (p.baseY - p.y) * 0.03;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = currentVol > 20 ? '#ef4444' : '#1c1917';
        ctx.fillText(p.text, p.x, p.y);
      });

      animIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls Bar matching exact reference UI */}
      <div className="flex justify-between items-center bg-stone-100 p-4 border border-stone-200 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-stone-700 uppercase">
            KINETIC_BREATH_AUDIO_SENSOR
          </div>
          <div className="text-xs font-mono text-stone-400">
            VOL: <span className={volume > 20 ? 'text-red-600 font-bold' : 'text-stone-700'}>{volume}%</span>
          </div>
        </div>

        <button
          onClick={toggleMic}
          className={`px-6 py-2 font-mono font-black text-xs uppercase tracking-widest rounded-sm shadow transition-all ${
            micActive
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-black text-white hover:bg-stone-900'
          }`}
        >
          {micActive ? (
            <span className="flex items-center gap-1.5"><StopCircle className="w-4 h-4" /> Stop Microphone</span>
          ) : (
            <span className="flex items-center gap-1.5"><Mic className="w-4 h-4" /> Start Microphone (Breathe)</span>
          )}
        </button>
      </div>

      {/* HTML5 Canvas */}
      <div className="bg-[#fbfaf5] border border-stone-300 rounded-sm shadow-xl overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </div>
  );
};
