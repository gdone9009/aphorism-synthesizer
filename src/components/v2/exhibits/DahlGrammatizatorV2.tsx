import React, { useState } from 'react';
import type { DahlParams } from '../../../types';
import { generateDahlText } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const DahlGrammatizatorV2: React.FC = () => {
  const [params, setParams] = useState<DahlParams>({
    subject: '무명의 작가와 자동 교정 기계',
    genre: 'Satire Digest',
    tension: 70,
    surprise: 80,
    humor: 40,
    pathos: 30,
    mystery: 90,
    passion: 60,
    calmness: 40,
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
      <div className="bg-stone-100 border border-stone-300 p-6 rounded-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase text-stone-700">
            DASHBOARD_CONTROL: ROALD_DAHL_GRAMMATIZATOR
          </h3>
          <span className="text-[10px] mono text-stone-500 font-bold">
            MODEL: ADOLF_KNIFE_1953
          </span>
        </div>

        {/* Subject & Genre */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
              소설 주제 (SUBJECT)
            </label>
            <input
              type="text"
              value={params.subject}
              onChange={(e) => setParams({ ...params, subject: e.target.value })}
              className="w-full p-2.5 text-sm font-serif border border-stone-300 rounded bg-white text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
              장르 서식 (GENRE)
            </label>
            <select
              value={params.genre}
              onChange={(e) => setParams({ ...params, genre: e.target.value })}
              className="w-full p-2.5 text-sm font-serif border border-stone-300 rounded bg-white text-stone-900 focus:outline-none"
            >
              <option value="Satire Digest">풍자 다이제스트 (Satire)</option>
              <option value="Mystery Weekly">미스터리 위클리 (Mystery)</option>
              <option value="Women’s Magazine">여성 잡지 (Romance)</option>
              <option value="Sci-Fi Pulp">SF 펄프 픽션 (Sci-Fi)</option>
            </select>
          </div>
        </div>

        {/* 5 Literary Elements Sliders */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded border border-stone-200">
          {(['tension', 'surprise', 'humor', 'pathos', 'mystery'] as const).map((key) => (
            <div key={key} className="space-y-1 text-center">
              <span className="block text-[10px] font-mono font-bold uppercase text-stone-600">
                {key}: {params[key]}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={params[key]}
                onChange={(e) => setParams({ ...params, [key]: Number(e.target.value) })}
                className="w-full accent-stone-900 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Dual Pedals matching exact reference UI */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* Accelerator Passion Pedal */}
          <div className="bg-stone-200 p-5 rounded border border-stone-300 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-800 uppercase">
              <span className="flex items-center gap-1 text-red-700">
                <Flame className="w-4 h-4" /> 가속 페달 (PASSION)
              </span>
              <span className="mono text-red-700">{params.passion}%</span>
            </div>
            {/* Gauge bar with reference style */}
            <div className="w-full bg-stone-300 h-4 rounded-sm overflow-hidden border border-stone-400">
              <div
                className={`h-full transition-all duration-150 ${params.passion > 50 ? 'bg-red-600' : 'bg-stone-800'}`}
                style={{ width: `${params.passion}%` }}
              />
            </div>
            <div className="flex justify-between gap-2 pt-1">
              <button
                onClick={() => handlePedalPress('passion', -15)}
                className="px-3 py-1.5 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold text-stone-800 rounded uppercase"
              >
                브레이크를 밟으십시오 (-)
              </button>
              <button
                onClick={() => handlePedalPress('passion', 15)}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold rounded uppercase shadow"
              >
                가속 페달을 밟으십시오 (+)
              </button>
            </div>
          </div>

          {/* Calmness Brake Pedal */}
          <div className="bg-stone-200 p-5 rounded border border-stone-300 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-800 uppercase">
              <span className="flex items-center gap-1 text-stone-900">
                <ShieldAlert className="w-4 h-4" /> 감정 억제 (CALMNESS)
              </span>
              <span className="mono text-stone-900">{params.calmness}%</span>
            </div>
            <div className="w-full bg-stone-300 h-4 rounded-sm overflow-hidden border border-stone-400">
              <div
                className="bg-stone-800 h-full transition-all duration-150"
                style={{ width: `${params.calmness}%` }}
              />
            </div>
            <div className="flex justify-between gap-2 pt-1">
              <button
                onClick={() => handlePedalPress('calmness', -15)}
                className="px-3 py-1.5 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold text-stone-800 rounded uppercase"
              >
                억제 해제 (-)
              </button>
              <button
                onClick={() => handlePedalPress('calmness', 15)}
                className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white font-mono text-xs font-bold rounded uppercase shadow"
              >
                차분함 증폭 (+)
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-5 bg-black hover:bg-red-900 text-white font-mono font-bold uppercase tracking-[0.4em] text-sm rounded-sm shadow-xl transition-all disabled:opacity-20 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          {loading ? '엔진 과열 중... 소설 문장 양산 중...' : '자동 교정 소설 생성 (GRAMMATIZATOR_RUN)'}
        </button>
      </div>

      {/* Result Display */}
      {resultText && (
        <div className="bg-white border-2 border-stone-900 p-6 rounded-sm shadow-2xl space-y-3 animate-fade-in">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2 font-mono text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-widest">
              [ENGINE_OUTPUT] 교정 결과물
            </span>
            <span className="text-stone-400">
              PASSION: {params.passion}% | CALMNESS: {params.calmness}%
            </span>
          </div>
          <div className="font-serif text-lg text-stone-900 leading-relaxed whitespace-pre-line p-2">
            {resultText}
          </div>
        </div>
      )}
    </div>
  );
};
