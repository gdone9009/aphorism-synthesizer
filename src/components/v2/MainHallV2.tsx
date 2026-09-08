import React from 'react';
import type { EpochCategory } from '../../types';
import { MachineId } from '../../types';
import { EXHIBITS_DATA } from '../TimelineMainHall';

interface MainHallV2Props {
  onSelectMachine: (id: MachineId) => void;
  selectedCategory: EpochCategory | 'MAIN';
}

export const MainHallV2: React.FC<MainHallV2Props> = ({
  onSelectMachine,
  selectedCategory,
}) => {
  const filtered = selectedCategory === 'MAIN'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter(e => e.category === selectedCategory);

  return (
    <section className="max-w-6xl mx-auto py-10 px-6">
      {/* Intro Header */}
      <div className="mb-10 border-b border-stone-300 pb-6">
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase mb-2">
          계보도 전시관 (EXHIBITION MAIN HALL)
        </h2>
        <p className="text-sm text-stone-600 font-serif max-w-3xl leading-relaxed">
          1913년 안드레이 마르코프의 확률적 언어 분석부터 현대 Gemini 3 Flash까지—문학 기술사의 결정적 순간들을 구현한 9개의 체화형 문학 기계들입니다. 전시물을 선택하여 시동하십시오.
        </p>
      </div>

      {/* Grid of Exhibits matching exact reference UI */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelectMachine(u.id)}
            className="group relative bg-white border border-stone-200 p-6 text-left hover:border-black hover:shadow-2xl transition-all duration-300 active:scale-98 flex flex-col justify-between rounded-sm overflow-hidden"
          >
            {/* Watermark Initial Letter matching exact reference: n.id[0] */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none">
              <span className="text-8xl font-black font-mono">
                {u.id[0]}
              </span>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="mono text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  [{u.year}] {u.category}
                </span>
                <span className="text-[9px] mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 border border-stone-300 uppercase">
                  EXHIBIT_#0{EXHIBITS_DATA.indexOf(u) + 1}
                </span>
              </div>

              <h3 className="text-xl font-black text-stone-900 leading-tight tracking-tight uppercase group-hover:text-red-700 transition-colors mb-1">
                {u.name}
              </h3>
              <p className="text-xs italic text-stone-500 mb-3 font-serif">
                {u.creator}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed font-serif">
                {u.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex justify-between items-center text-[9px] mono text-stone-400">
              <span className="font-bold text-stone-900 group-hover:text-red-700 group-hover:underline uppercase tracking-wider">
                기계 시동하기 (OPERATE MACHINE) →
              </span>
              <span>AESTHETIC_GAIN: MAX</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
