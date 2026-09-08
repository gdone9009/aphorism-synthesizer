import React, { useState } from 'react';
import type { DahlParams } from '../../types';
import { generateDahlText } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import { Cpu, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const DahlGrammatizator: React.FC = () => {
  const [params, setParams] = useState<DahlParams>({
    subject: '어느 무명 작가의 서재',
    genre: 'Mystery Weekly',
    tension: 70,
    surprise: 80,
    humor: 30,
    pathos: 40,
    mystery: 90,
    passion: 50,
    calmness: 50,
  });

  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');

  const handleGenerate = async () => {
    audioSynth.playLever();
    setLoading(true);
    try {
      const text = await generateDahlText(params);
      setResultText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePedalPress = (type: 'passion' | 'calmness', delta: number) => {
    audioSynth.playPedal();
    setParams(prev => ({
      ...prev,
      [type]: Math.min(100, Math.max(0, prev[type] + delta))
    }));
  };

  return (
    <div className="space-y-8">
      {/* Control Dashboard */}
      <div className="bg-[#eeebd9] border-2 border-stone-800 p-6 rounded-sm shadow-md space-y-6">
        <h3 className="text-xs font-mono font-black uppercase text-stone-800 border-b border-stone-400 pb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-red-800" />
          아돌프 나이프의 자동 문법 교정기 제어반 (Grammatizator Dashboard)
        </h3>

        {/* Subject & Genre */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">소설 주제 (Subject)</label>
            <input
              type="text"
              value={params.subject}
              onChange={(e) => setParams({ ...params, subject: e.target.value })}
              className="w-full p-2 text-sm font-serif border border-stone-400 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">장르 서식 (Genre)</label>
            <select
              value={params.genre}
              onChange={(e) => setParams({ ...params, genre: e.target.value })}
              className="w-full p-2 text-sm font-serif border border-stone-400 rounded bg-white"
            >
              <option value="Mystery Weekly">미스터리 위클리 (Mystery)</option>
              <option value="Women’s Magazine">여성 잡지 (Romance)</option>
              <option value="Satire Digest">풍자 다이제스트 (Satire)</option>
              <option value="Sci-Fi Pulp">SF 펄프 픽션 (Sci-Fi)</option>
            </select>
          </div>
        </div>

        {/* Literary Element Sliders */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded border border-stone-300">
          {(['tension', 'surprise', 'humor', 'pathos', 'mystery'] as const).map((key) => (
            <div key={key} className="space-y-1 text-center">
              <span className="block text-[11px] font-mono font-bold uppercase text-stone-700">
                {key} ({params[key]})
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={params[key]}
                onChange={(e) => setParams({ ...params, [key]: Number(e.target.value) })}
                className="w-full accent-red-800 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Dual Pedals */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* Passion Pedal (Accelerator) */}
          <div className="bg-gradient-to-b from-stone-200 to-red-100 border-2 border-red-800 p-4 rounded text-center space-y-3 shadow">
            <div className="flex items-center justify-center gap-2 text-red-900 font-black text-sm uppercase">
              <Flame className="w-5 h-5 animate-pulse" />
              가속 페달: 열정 (Passion: {params.passion}%)
            </div>
            <div className="w-full bg-stone-300 h-3 rounded-full overflow-hidden border border-stone-400">
              <div className="bg-red-700 h-full transition-all" style={{ width: `${params.passion}%` }} />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePedalPress('passion', -15)}
                className="px-3 py-1 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold rounded"
              >
                페달 떼기 (-)
              </button>
              <button
                onClick={() => handlePedalPress('passion', 15)}
                className="px-4 py-1 bg-red-800 hover:bg-red-900 text-white font-mono text-xs font-bold rounded shadow"
              >
                가속 페달 밟기 (+)
              </button>
            </div>
          </div>

          {/* Calmness Pedal (Brake) */}
          <div className="bg-gradient-to-b from-stone-200 to-slate-200 border-2 border-slate-700 p-4 rounded text-center space-y-3 shadow">
            <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-sm uppercase">
              <ShieldAlert className="w-5 h-5" />
              브레이크: 차분함 (Calmness: {params.calmness}%)
            </div>
            <div className="w-full bg-stone-300 h-3 rounded-full overflow-hidden border border-stone-400">
              <div className="bg-slate-700 h-full transition-all" style={{ width: `${params.calmness}%` }} />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePedalPress('calmness', -15)}
                className="px-3 py-1 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold rounded"
              >
                브레이크 떼기 (-)
              </button>
              <button
                onClick={() => handlePedalPress('calmness', 15)}
                className="px-4 py-1 bg-slate-800 hover:bg-slate-900 text-white font-mono text-xs font-bold rounded shadow"
              >
                브레이크 밟기 (+)
              </button>
            </div>
          </div>
        </div>

        {/* Generate Engine Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-stone-900 hover:bg-red-950 text-stone-100 font-black font-mono uppercase tracking-widest text-sm rounded shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          {loading ? '엔진 작동 중... 교정기 문장 양산 중...' : '자동 교정 소설 생성 (Operate Grammatizator Engine)'}
        </button>
      </div>

      {/* Result Display */}
      {resultText && (
        <div className="bg-white border-2 border-stone-800 p-6 rounded shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-300 pb-2">
            <span className="font-mono text-xs font-bold text-red-900 uppercase">
              [OUTPUT] 교정기 양산 문장
            </span>
            <span className="font-mono text-xs text-stone-500">
              Passion: {params.passion}% | Calmness: {params.calmness}%
            </span>
          </div>
          <div className="font-serif text-base text-stone-900 leading-relaxed whitespace-pre-line p-2">
            {resultText}
          </div>
        </div>
      )}
    </div>
  );
};
