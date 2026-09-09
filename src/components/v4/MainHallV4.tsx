import React from 'react';
import type { EpochCategory, MachineId } from '../../types';
import { EXHIBITS_DATA } from '../TimelineMainHall';
import { Sparkles, Cpu, ChevronRight, Zap, Layers } from 'lucide-react';

interface MainHallV4Props {
  onSelectMachine: (id: MachineId) => void;
  selectedCategory: EpochCategory | 'MAIN';
}

export const MainHallV4: React.FC<MainHallV4Props> = ({
  onSelectMachine,
  selectedCategory,
}) => {
  const filtered = selectedCategory === 'MAIN'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter(e => e.category === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto py-8 px-6 space-y-8 font-serif">
      {/* V4 Hero Banner */}
      <div className="bg-stone-950 text-stone-100 border-2 border-amber-500/60 p-8 rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono rounded-full border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>V4 CYBERNETIC SYNERGY ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-amber-100 font-serif">
            사이버네틱 문학 기술사 & V4 종합 멀티-에이전트 전시관
          </h2>

          <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-3xl font-serif">
            1913년 마르코프의 확률적 텍스트 환원부터 2026년 Google Gemini 기반의 벡터 공간과 변증법적 저항까지, 9개 문학기계의 고유한 미학을 오디오-비주얼 상호작용과 파이프라인 시너지로 경험하십시오.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs text-amber-400">
            <span className="flex items-center gap-1 bg-stone-900 px-3 py-1 rounded border border-stone-800">
              <Cpu className="w-3.5 h-3.5 text-amber-500" /> REALTIME GEMINI-2.5-FLASH
            </span>
            <span className="flex items-center gap-1 bg-stone-900 px-3 py-1 rounded border border-stone-800">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> AUDIO-SYNTH INTEGRATED
            </span>
            <span className="flex items-center gap-1 bg-stone-900 px-3 py-1 rounded border border-stone-800">
              <Layers className="w-3.5 h-3.5 text-amber-500" /> PIPELINE SYNERGY ENGINE
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 9 Machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMachine(item.id)}
            className="bg-stone-900 text-stone-100 border-2 border-stone-800 hover:border-amber-500/80 rounded-lg p-6 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                  {item.year}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  {item.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-400 transition-colors font-serif">
                {item.name}
              </h3>

              <p className="text-xs text-stone-400 font-mono italic">
                {item.creator}
              </p>

              <p className="text-xs text-stone-300 font-serif leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:text-amber-300 mt-4 relative z-10">
              <span>기계 가동 (V4 RUN)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
