import React, { useState, useEffect, useRef } from 'react';
import { generatePhoneticGrid } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import type { LatentSynthesisResult } from '../../../types';
import { Compass, Move, Sparkles } from 'lucide-react';

export const ParrishSynthesizerV3: React.FC = () => {
  const [anchors, setAnchors] = useState({
    top: '새벽',
    bottom: '금속',
    left: '침묵',
    right: '파도',
  });

  const [latentPos, setLatentPos] = useState({ x: 0.5, y: 0.5 });
  const [latentGrid, setLatentGrid] = useState<LatentSynthesisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  const handleSynthesize = async () => {
    audioSynth.playLever();
    setLoading(true);
    try {
      const res = await generatePhoneticGrid(anchors.top, anchors.bottom, anchors.left, anchors.right);
      setLatentGrid(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSynthesize();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 650;
    canvas.height = 340;

    const render = () => {
      ctx.fillStyle = '#fbfaf5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#e7e5e4';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.font = 'bold 13px "Crimson Pro", serif';
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';

      ctx.fillText(`TOP: ${anchors.top}`, canvas.width / 2, 20);
      ctx.fillText(`BOTTOM: ${anchors.bottom}`, canvas.width / 2, canvas.height - 10);
      ctx.textAlign = 'left';
      ctx.fillText(`LEFT: ${anchors.left}`, 15, canvas.height / 2);
      ctx.textAlign = 'right';
      ctx.fillText(`RIGHT: ${anchors.right}`, canvas.width - 15, canvas.height / 2);

      const px = latentPos.x * canvas.width;
      const py = latentPos.y * canvas.height;

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, py); ctx.lineTo(canvas.width / 2, 20);
      ctx.moveTo(px, py); ctx.lineTo(canvas.width / 2, canvas.height - 10);
      ctx.moveTo(px, py); ctx.lineTo(15, canvas.height / 2);
      ctx.moveTo(px, py); ctx.lineTo(canvas.width - 15, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'center';
      ctx.fillText(`V[${latentPos.x.toFixed(2)}, ${latentPos.y.toFixed(2)}]`, px, py - 20);
    };

    render();

  }, [latentPos, anchors]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    updatePos(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      updatePos(e);
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      audioSynth.playClick();
    }
  };

  const updatePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setLatentPos({ x, y });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-stone-200 pb-3">
        <span className="font-mono text-xs font-bold text-stone-900 uppercase flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-blue-800" />
          VECTOR_LATENT_SPACE_CANVAS (드래그 조작형 2D 벡터 잠재 공간)
        </span>
        <span className="font-mono text-xs font-bold text-blue-900">
          VECTOR_COORDS: [{latentPos.x.toFixed(2)}, {latentPos.y.toFixed(2)}]
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['top', 'bottom', 'left', 'right'] as const).map((dir) => (
          <div key={dir}>
            <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 mb-1">
              {dir} Anchor
            </label>
            <input
              type="text"
              value={anchors[dir]}
              onChange={(e) => setAnchors({ ...anchors, [dir]: e.target.value })}
              className="w-full p-2 font-serif text-sm border border-stone-300 rounded bg-white text-center font-bold"
            />
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-stone-900 rounded p-2 shadow-2xl relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full block cursor-crosshair rounded border border-stone-200"
        />
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-stone-400 pointer-events-none flex items-center gap-1">
          <Move className="w-3 h-3" /> 드래그하여 벡터 좌표 위치를 이동시키세요.
        </div>
      </div>

      <button
        onClick={handleSynthesize}
        disabled={loading}
        className="w-full py-4 bg-blue-950 hover:bg-black text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        {loading ? '벡터 잠재 공간 보간 산출 중...' : '벡터 잠재 공간 조어 합성 (Synthesize Phonetic Neologisms)'}
      </button>

      {latentGrid && (
        <div className="bg-white border-2 border-blue-900 p-6 rounded shadow-xl font-mono space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2 text-xs font-bold text-blue-900">
            <span>[SYNTHESIZED_VECTOR_NEOLOGISMS]</span>
            <span>RATIO: X={latentPos.x.toFixed(2)}, Y={latentPos.y.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="block text-[9px] text-stone-400 mb-1">TOP-LEFT</span>
              <span className="font-bold text-stone-900">{latentGrid.topLeft}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="block text-[9px] text-stone-400 mb-1">TOP-RIGHT</span>
              <span className="font-bold text-stone-900">{latentGrid.topRight}</span>
            </div>
            <div className="p-3 bg-red-900 text-amber-200 rounded font-black border border-red-950 shadow">
              <span className="block text-[9px] text-amber-300 mb-1">VECTOR CENTER</span>
              <span className="text-lg font-black">{latentGrid.center}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="block text-[9px] text-stone-400 mb-1">BOTTOM-LEFT</span>
              <span className="font-bold text-stone-900">{latentGrid.bottomLeft}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="block text-[9px] text-stone-400 mb-1">BOTTOM-RIGHT</span>
              <span className="font-bold text-stone-900">{latentGrid.bottomRight}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
