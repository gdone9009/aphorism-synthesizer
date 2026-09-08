import React, { useState } from 'react';
import { generateInterpolatedText, generatePhoneticGrid } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import type { LatentSynthesisResult } from '../../../types';
import { Compass, Sliders } from 'lucide-react';

export const ParrishSynthesizerV2: React.FC = () => {
  const [mode, setMode] = useState<'linear' | 'compass'>('compass');

  // Linear mode state
  const [textA, setTextA] = useState('차가운 금속 회로 속에서 기계가 눈을 뜬다');
  const [textB, setTextB] = useState('깊은 바다속 고요한 별빛이 시가 되어 흐른다');
  const [ratio, setRatio] = useState<number>(0.5);
  const [interpolatedText, setInterpolatedText] = useState('');
  const [loadingLinear, setLoadingLinear] = useState(false);

  // Compass mode state
  const [anchors, setAnchors] = useState({
    top: '새벽',
    bottom: '금속',
    left: '침묵',
    right: '파도',
  });
  const [latentGrid, setLatentGrid] = useState<LatentSynthesisResult | null>(null);
  const [loadingCompass, setLoadingCompass] = useState(false);

  const handleInterpolate = async () => {
    audioSynth.playLever();
    setLoadingLinear(true);
    try {
      const res = await generateInterpolatedText(textA, textB, ratio);
      setInterpolatedText(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLinear(false);
    }
  };

  const handleSynthesizeCompass = async () => {
    audioSynth.playLever();
    setLoadingCompass(true);
    try {
      const res = await generatePhoneticGrid(anchors.top, anchors.bottom, anchors.left, anchors.right);
      setLatentGrid(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCompass(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Buttons matching exact reference UI */}
      <div className="flex gap-3 border-b border-stone-200 pb-3">
        <button
          onClick={() => { audioSynth.playClick(); setMode('compass'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded-sm uppercase ${
            mode === 'compass' ? 'bg-black text-white shadow' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" /> Phonetic Compass (음운론적 나침반)
        </button>

        <button
          onClick={() => { audioSynth.playClick(); setMode('linear'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded-sm uppercase ${
            mode === 'linear' ? 'bg-black text-white shadow' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Linear Interpolation (선형 보간)
        </button>
      </div>

      {mode === 'compass' ? (
        /* Phonetic Compass Mode */
        <div className="space-y-6">
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
                  className="w-full p-2 font-serif text-sm border border-stone-300 rounded-sm bg-white text-center font-bold"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSynthesizeCompass}
            disabled={loadingCompass}
            className="w-full py-4 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl disabled:opacity-20"
          >
            {loadingCompass ? 'LATENT_SPACE_CALCULATING...' : 'Synthesize Latent Words (신조어 벡터 보간)'}
          </button>

          {/* 2D Crosshair Grid matching reference UI */}
          <div className="bg-stone-100 border border-stone-300 p-8 rounded-sm relative h-72 flex items-center justify-center shadow-inner">
            <span className="absolute top-3 font-serif font-bold text-xs text-stone-700">TOP: {anchors.top}</span>
            <span className="absolute bottom-3 font-serif font-bold text-xs text-stone-700">BOTTOM: {anchors.bottom}</span>
            <span className="absolute left-3 font-serif font-bold text-xs text-stone-700">LEFT: {anchors.left}</span>
            <span className="absolute right-3 font-serif font-bold text-xs text-stone-700">RIGHT: {anchors.right}</span>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-stone-300" />
              <div className="h-full w-px bg-stone-300 absolute" />
            </div>

            {latentGrid ? (
              <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between p-4 font-mono">
                <div className="flex justify-between">
                  <span className="bg-white border border-stone-300 text-stone-900 px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {latentGrid.topLeft}
                  </span>
                  <span className="bg-white border border-stone-300 text-stone-900 px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {latentGrid.topRight}
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-xl md:text-2xl text-red-700 font-black tracking-tighter bg-white/70 px-3 py-1 rounded backdrop-blur-sm border border-stone-300 shadow-md">
                    {latentGrid.center}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="bg-white border border-stone-300 text-stone-900 px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {latentGrid.bottomLeft}
                  </span>
                  <span className="bg-white border border-stone-300 text-stone-900 px-2 py-1 rounded text-xs font-bold shadow-sm">
                    {latentGrid.bottomRight}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-stone-400 font-mono text-xs italic z-10">
                버튼을 눌러 잠재 공간의 5개 조어(Neologisms)를 합성하세요.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Linear Mode */
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">Text A (0.0)</label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                rows={3}
                className="w-full p-2.5 font-serif text-sm border border-stone-300 rounded-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">Text B (1.0)</label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                rows={3}
                className="w-full p-2.5 font-serif text-sm border border-stone-300 rounded-sm bg-white"
              />
            </div>
          </div>

          <div className="bg-stone-100 p-4 border border-stone-300 rounded-sm space-y-2 font-mono text-xs">
            <div className="flex justify-between font-bold text-stone-700">
              <span>Text A</span>
              <span className="text-red-700">Interpolation Ratio: {(ratio * 100).toFixed(0)}%</span>
              <span>Text B</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <button
            onClick={handleInterpolate}
            disabled={loadingLinear}
            className="w-full py-4 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl disabled:opacity-20"
          >
            {loadingLinear ? 'INTERPOLATING...' : 'Interpolate Text (텍스트 잠재 공간 보간)'}
          </button>

          {interpolatedText && (
            <div className="bg-white border border-stone-300 p-6 rounded-sm shadow-xl space-y-2 animate-fade-in">
              <span className="font-mono text-xs font-bold text-stone-400 uppercase">[INTERPOLATED_OUTPUT]</span>
              <p className="font-serif text-lg font-bold text-stone-900 leading-relaxed font-serif">
                "{interpolatedText}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
