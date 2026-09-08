import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../../../services/audioSynth';
import { Mic, StopCircle, Wind, Radio } from 'lucide-react';

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

const CONCRETE_WORDS_V3 = ['속도', '소음', '미래', '기계', '바람', '침묵', '0', '연기', '파편', '전화', '엔진', '구체시', '사이버네틱스'];

export const KineticBreathV3: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number | null>(null);

  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const text = CONCRETE_WORDS_V3[i % CONCRETE_WORDS_V3.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 180;
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
    canvas.height = 460;

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

      ctx.fillStyle = 'rgba(251, 250, 245, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentVol < 20) {
        ctx.font = '900 240px "Crimson Pro", serif';
        ctx.fillStyle = 'rgba(220, 38, 38, 0.09)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', canvas.width / 2, canvas.height / 2);
      }

      particlesRef.current.forEach((p) => {
        if (currentVol > 20) {
          const force = (currentVol - 20) * 0.2;
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
        ctx.fillStyle = currentVol > 25 ? '#dc2626' : '#1c1917';
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#eeebd9] p-4 border-2 border-stone-900 rounded">
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-cyan-900" />
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-900 uppercase">
              KINETIC_BREATH_ACOUSTIC_FORCE_FIELD
            </h4>
            <p className="text-xs text-stone-600 font-serif">
              음성 및 숨결 입력을 받아 입자를 흩날리며, 정적 시 중앙 '0' 구조로 응집합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <div className="text-xs font-mono font-bold text-stone-700">
            AUDIO_VOL: <span className={volume > 20 ? 'text-red-700 font-black' : 'text-stone-900'}>{volume}%</span>
          </div>

          <button
            onClick={toggleMic}
            className={`px-5 py-2 font-mono font-bold text-xs uppercase tracking-widest rounded shadow transition-all ${
              micActive ? 'bg-red-800 text-white animate-pulse' : 'bg-stone-950 text-stone-100 hover:bg-black'
            }`}
          >
            {micActive ? (
              <span className="flex items-center gap-1"><StopCircle className="w-4 h-4" /> Stop Mic</span>
            ) : (
              <span className="flex items-center gap-1"><Mic className="w-4 h-4" /> Start Mic (Breathe)</span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#fbfaf5] border-2 border-stone-900 rounded shadow-2xl relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </div>
  );
};
