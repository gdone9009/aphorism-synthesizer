import React, { useState } from 'react';
import { generateInterpolatedText, generatePhoneticGrid } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import type { LatentSynthesisResult } from '../../types';
import { Compass, Sliders, Sparkles } from 'lucide-react';

export const ParrishSynthesizer: React.FC = () => {
  const [mode, setMode] = useState<'linear' | 'compass'>('linear');

  // Mode 1: Linear Interpolation
  const [textA, setTextA] = useState('차가운 회로 속에서 전깃불이 비친다');
  const [textB, setTextB] = useState('깊은 바닷속 고요한 별빛이 넘쳐흐른다');
  const [ratio, setRatio] = useState<number>(0.5);
  const [interpolatedText, setInterpolatedText] = useState('');
  const [loadingLinear, setLoadingLinear] = useState(false);

  // Mode 2: Phonetic Compass
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
      {/* Mode Switcher */}
      <div className="flex gap-2 border-b border-stone-300 pb-3">
        <button
          onClick={() => { audioSynth.playClick(); setMode('linear'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            mode === 'linear'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          선형 보간 (Linear Interpolation)
        </button>

        <button
          onClick={() => { audioSynth.playClick(); setMode('compass'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            mode === 'compass'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          음운론적 나침반 (Phonetic Compass)
        </button>
      </div>

      {mode === 'linear' ? (
        /* Linear Interpolation Mode */
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                텍스트 A (Ratio = 0.0)
              </label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                rows={3}
                className="w-full p-2.5 font-serif text-sm border-2 border-stone-400 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                텍스트 B (Ratio = 1.0)
              </label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                rows={3}
                className="w-full p-2.5 font-serif text-sm border-2 border-stone-400 rounded bg-white"
              />
            </div>
          </div>

          {/* Interpolation Ratio Slider */}
          <div className="bg-[#eeebd9] p-4 border-2 border-stone-800 rounded space-y-2">
            <div className="flex justify-between font-mono text-xs font-bold text-stone-800">
              <span>Text A (0.0)</span>
              <span className="text-blue-900 font-black">보간 비율 (Ratio): {(ratio * 100).toFixed(0)}%</span>
              <span>Text B (1.0)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
          </div>

          <button
            onClick={handleInterpolate}
            disabled={loadingLinear}
            className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            잠재 공간 텍스트 보간 (Interpolate Latent Text)
          </button>

          {interpolatedText && (
            <div className="bg-white border-2 border-blue-900 p-6 rounded shadow-xl space-y-2 animate-fade-in">
              <span className="font-mono text-xs font-bold text-blue-900 uppercase">
                [OUTPUT] 보간된 중간 텍스트
              </span>
              <p className="font-serif text-lg font-bold text-stone-900 leading-relaxed">
                "{interpolatedText}"
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Phonetic Compass Mode */
        <div className="space-y-6">
          <p className="text-xs text-stone-600 italic">
            동서남북 4개 앵커 단어를 설정하면, 벡터 공간의 사분면에 위치하는 5개의 새로운 신조어를 합성합니다.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['top', 'bottom', 'left', 'right'] as const).map((dir) => (
              <div key={dir}>
                <label className="block text-[11px] font-mono font-bold uppercase text-stone-700 mb-1">
                  {dir} Word
                </label>
                <input
                  type="text"
                  value={anchors[dir]}
                  onChange={(e) => setAnchors({ ...anchors, [dir]: e.target.value })}
                  className="w-full p-2 font-serif text-sm border border-stone-400 rounded bg-white text-center font-bold"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSynthesizeCompass}
            disabled={loadingCompass}
            className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            나침반 신조어 합성 (Synthesize Phonetic Neologisms)
          </button>

          {/* Compass 2D Visualizer Grid */}
          <div className="bg-[#f4f1e8] border-2 border-stone-800 p-8 rounded relative h-72 flex items-center justify-center shadow-inner">
            {/* Anchors */}
            <span className="absolute top-3 font-serif font-bold text-sm text-stone-800">Top: {anchors.top}</span>
            <span className="absolute bottom-3 font-serif font-bold text-sm text-stone-800">Bottom: {anchors.bottom}</span>
            <span className="absolute left-3 font-serif font-bold text-sm text-stone-800">Left: {anchors.left}</span>
            <span className="absolute right-3 font-serif font-bold text-sm text-stone-800">Right: {anchors.right}</span>

            {/* Crosshair Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-stone-300" />
              <div className="h-full w-px bg-stone-300 absolute" />
            </div>

            {/* Generated Latent Neologisms */}
            {latentGrid ? (
              <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between p-4 font-mono">
                <div className="flex justify-between">
                  <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded text-xs font-bold shadow">
                    {latentGrid.topLeft}
                  </span>
                  <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded text-xs font-bold shadow">
                    {latentGrid.topRight}
                  </span>
                </div>

                <div className="text-center">
                  <span className="bg-red-900 text-amber-100 px-3 py-1.5 rounded font-black text-sm shadow-xl">
                    CENTER: {latentGrid.center}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded text-xs font-bold shadow">
                    {latentGrid.bottomLeft}
                  </span>
                  <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded text-xs font-bold shadow">
                    {latentGrid.bottomRight}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-stone-400 font-mono text-xs italic z-10">
                버튼을 눌러 사분면 신조어를 생성하세요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
