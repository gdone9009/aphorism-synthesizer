import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../../services/audioSynth';
import { Mic, Wind, Volume2, StopCircle } from 'lucide-react';

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

const CONCRETE_WORDS = [
  '속도', '소음', '미래', '기계', '바람', '침묵', '0', '연기', '파편', '전화', '엔진', '철선'
];

export const KineticBreath: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number | null>(null);

  // Initialize Canvas Particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const text = CONCRETE_WORDS[i % CONCRETE_WORDS.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 160;
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

  // Toggle Microphone Stream
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
        alert('마이크 접근 권한을 얻을 수 없습니다.');
      }
    }
  };

  // Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 420;

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

      // Fade canvas trail
      ctx.fillStyle = 'rgba(251, 250, 245, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Central '0' Concrete Structure if quiet
      if (currentVol < 25) {
        ctx.font = '900 180px "Crimson Pro", serif';
        ctx.fillStyle = 'rgba(185, 28, 28, 0.08)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', canvas.width / 2, canvas.height / 2);
      }

      // Update & Draw Particles
      particlesRef.current.forEach((p) => {
        if (currentVol > 20) {
          // Wind force scatters particles like smoke
          const force = (currentVol - 20) * 0.15;
          p.vx += (Math.random() - 0.5) * force;
          p.vy += (Math.random() - 0.5) * force;
        } else {
          // Silence pulls particles back to '0' central structure
          p.vx += (p.baseX - p.x) * 0.03;
          p.vy += (p.baseY - p.y) * 0.03;
        }

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw Text
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = currentVol > 30 ? '#dc2626' : '#1c1917';
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
      {/* Controls & Mic Indicator */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#eeebd9] p-4 border-2 border-stone-800 rounded">
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-cyan-800" />
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-900 uppercase">
              키네틱 브레스 마이크 파이프라인 (Kinetic Breath Audio Sensor)
            </h4>
            <p className="text-xs text-stone-600 font-serif">
              마이크에 입김을 불거나 소리를 내면 텍스트가 흩날리고, 침묵 시 중앙 '0' 구조로 응집합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Volume Bar */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-stone-600" />
            <div className="w-24 bg-stone-300 h-2.5 rounded-full overflow-hidden border border-stone-400">
              <div
                className={`h-full transition-all ${volume > 30 ? 'bg-red-600' : 'bg-stone-800'}`}
                style={{ width: `${volume}%` }}
              />
            </div>
            <span className="mono text-xs font-bold text-stone-700 w-8">{volume}</span>
          </div>

          <button
            onClick={toggleMic}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded shadow flex items-center gap-1.5 transition-all ${
              micActive
                ? 'bg-red-800 text-white animate-pulse'
                : 'bg-stone-900 text-stone-100 hover:bg-stone-800'
            }`}
          >
            {micActive ? (
              <>
                <StopCircle className="w-4 h-4" /> 마이크 중지
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" /> 마이크 켜기 (Breathe)
              </>
            )}
          </button>
        </div>
      </div>

      {/* HTML5 Interactive Physics Canvas */}
      <div className="bg-[#fbfaf5] border-2 border-stone-800 rounded shadow-2xl relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full block" />

        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-stone-400">
          CANVAS_PHYSICS: ACTIVE | MIC_STATE: {micActive ? 'ONLINE' : 'SIMULATION_IDLE'}
        </div>
      </div>
    </div>
  );
};
