import React, { useState } from 'react';
import type { DahlParams } from '../../../types';
import { generateDahlText } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Flame, ShieldAlert, Sparkles, Activity, Gauge } from 'lucide-react';

export const DahlGrammatizatorV3: React.FC = () => {
  const [params, setParams] = useState<DahlParams>({
    subject: '아돌프 나이프의 자동 문법 교정기와 저자성',
    genre: 'Satire Digest',
    tension: 75,
    surprise: 85,
    humor: 40,
    pathos: 30,
    mystery: 95,
    passion: 65,
    calmness: 45,
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

  // Heat Dissipation level
  const heatLevel = Math.min(100, Math.floor((params.passion * 1.2 + params.tension * 0.8) / 2));

  return (
    <div className="space-y-8">
      {/* VU Meters & Analog Cybernetic Dashboard */}
      <div className="bg-[#eeebd9] border-2 border-stone-900 p-6 rounded-sm shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b-2 border-stone-800 pb-3 font-mono">
          <span className="text-xs font-bold uppercase text-stone-950 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-red-800" /> GRAMMATIZATOR_CYBERNETIC_DASHBOARD_V3
          </span>
          <span className="text-[10px] text-stone-600 font-black">ADOLF_KNIFE_SYSTEM_1953</span>
        </div>

        {/* Analog VU Meters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-900 text-stone-100 p-4 rounded border border-stone-800 text-center space-y-1">
            <span className="block font-mono text-[9px] text-stone-400">ENGINE_HEAT (과열도)</span>
            <span className={`font-mono text-xl font-black ${heatLevel > 70 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {heatLevel}°C
            </span>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${heatLevel > 70 ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${heatLevel}%` }} />
            </div>
          </div>

          <div className="bg-stone-900 text-stone-100 p-4 rounded border border-stone-800 text-center space-y-1">
            <span className="block font-mono text-[9px] text-stone-400">PASSION_INDEX (열정)</span>
            <span className="font-mono text-xl font-black text-red-400">{params.passion}%</span>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-red-600" style={{ width: `${params.passion}%` }} />
            </div>
          </div>

          <div className="bg-stone-900 text-stone-100 p-4 rounded border border-stone-800 text-center space-y-1">
            <span className="block font-mono text-[9px] text-stone-400">CALMNESS_BRAKE (차분함)</span>
            <span className="font-mono text-xl font-black text-slate-300">{params.calmness}%</span>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400" style={{ width: `${params.calmness}%` }} />
            </div>
          </div>

          <div className="bg-stone-900 text-stone-100 p-4 rounded border border-stone-800 text-center space-y-1">
            <span className="block font-mono text-[9px] text-stone-400">TENSION_SURPRISE</span>
            <span className="font-mono text-xl font-black text-amber-400">{params.tension} / {params.surprise}</span>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${params.surprise}%` }} />
            </div>
          </div>
        </div>

        {/* Inputs & Parameters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-stone-800 uppercase mb-1">소설 주제 (Subject)</label>
            <input
              type="text"
              value={params.subject}
              onChange={(e) => setParams({ ...params, subject: e.target.value })}
              className="w-full p-2.5 font-serif text-sm border border-stone-400 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-stone-800 uppercase mb-1">장르 서식 (Genre Format)</label>
            <select
              value={params.genre}
              onChange={(e) => setParams({ ...params, genre: e.target.value })}
              className="w-full p-2.5 font-serif text-sm border border-stone-400 rounded bg-white"
            >
              <option value="Satire Digest">풍자 다이제스트 (Satire)</option>
              <option value="Mystery Weekly">미스터리 위클리 (Mystery)</option>
              <option value="Women’s Magazine">여성 잡지 (Romance)</option>
              <option value="Sci-Fi Pulp">SF 펄프 픽션 (Sci-Fi)</option>
            </select>
          </div>
        </div>

        {/* Dual Pedals */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* Passion Accelerator */}
          <div className="bg-stone-200 border-2 border-red-800 p-5 rounded space-y-3 shadow">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-red-950 uppercase">
              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-red-700" /> PASSION ACCELERATOR</span>
              <span className="font-black text-sm">{params.passion}%</span>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => handlePedalPress('passion', -15)}
                className="px-3 py-2 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold rounded uppercase"
              >
                페달 감속 (-)
              </button>
              <button
                onClick={() => handlePedalPress('passion', 15)}
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-mono text-xs font-bold rounded uppercase shadow"
              >
                가속 페달 밟기 (+)
              </button>
            </div>
          </div>

          {/* Calmness Brake */}
          <div className="bg-stone-200 border-2 border-slate-700 p-5 rounded space-y-3 shadow">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-950 uppercase">
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-slate-700" /> CALMNESS BRAKE</span>
              <span className="font-black text-sm">{params.calmness}%</span>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => handlePedalPress('calmness', -15)}
                className="px-3 py-2 bg-stone-300 hover:bg-stone-400 font-mono text-xs font-bold rounded uppercase"
              >
                브레이크 해제 (-)
              </button>
              <button
                onClick={() => handlePedalPress('calmness', 15)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs font-bold rounded uppercase shadow"
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
          className="w-full py-5 bg-stone-950 hover:bg-red-950 text-stone-100 font-mono font-bold uppercase tracking-widest text-sm rounded shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-30"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          {loading ? '엔진 작동 중... 자동 교정 소설 연산 중...' : '자동 교정 소설 양산 (RUN GRAMMATIZATOR V3)'}
        </button>
      </div>

      {/* Output Display */}
      {resultText && (
        <div className="bg-white border-2 border-stone-900 p-6 rounded shadow-2xl space-y-3 animate-fade-in">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2 font-mono text-xs">
            <span className="font-bold text-red-900 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-4 h-4 text-red-700" /> [CYBERNETIC_PROSE_OUTPUT]
            </span>
            <span className="text-stone-400">HEAT: {heatLevel}°C</span>
          </div>
          <div className="font-serif text-lg text-stone-900 leading-relaxed whitespace-pre-line p-2">
            {resultText}
          </div>
        </div>
      )}
    </div>
  );
};
