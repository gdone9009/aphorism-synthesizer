import React from 'react';
import type { EpochCategory } from '../../types';
import { MachineId } from '../../types';
import { EXHIBITS_DATA } from '../TimelineMainHall';

interface MainHallV3Props {
  onSelectMachine: (id: MachineId) => void;
  selectedCategory: EpochCategory | 'MAIN';
}

export const MainHallV3: React.FC<MainHallV3Props> = ({
  onSelectMachine,
  selectedCategory,
}) => {
  const filtered = selectedCategory === 'MAIN'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter(e => e.category === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      {/* Intro Banner */}
      <div className="bg-[#f2efe4] border-2 border-stone-900 p-8 rounded-sm shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-3 right-4 font-mono text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          CYBERNETIC_SYNTHESIS_V3
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-stone-950 mb-3 tracking-tighter uppercase">
          기계 문학의 계보 및 사이버네틱 종합관
        </h2>
        <p className="text-stone-700 text-sm md:text-base leading-relaxed max-w-4xl font-serif">
          문학 기계의 본질은 인간 저자성과 기계적 연산 간의 **변증법적 마찰열**에 있습니다. 1913년 안드레이 마르코프의 확률 사슬부터 2026년 Gemini 3 Flash까지—9개의 체화형 기계들을 조작하고, 노드 그래프·2D 벡터 공간·수학적 파이프라인을 직접 조작해 보세요.
        </p>
      </div>

      {/* Grid of Exhibits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelectMachine(u.id)}
            className="group relative bg-[#fbfaf5] border-2 border-stone-900 p-6 rounded-sm hover:border-red-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Watermark Initial Letter */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none">
              <span className="text-8xl font-black font-mono">
                {u.id[0]}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center border-b border-stone-300 pb-3 mb-3">
                <span className="mono text-xs font-bold text-stone-600 uppercase tracking-widest">
                  [{u.year}] {u.category}
                </span>
                <span className="text-[10px] mono font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-300 uppercase">
                  V3_VISUALIZER
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-950 group-hover:text-red-800 transition-colors mb-1">
                {u.name}
              </h3>
              <p className="text-xs italic text-stone-600 mb-3 font-serif">
                {u.creator}
              </p>
              <p className="text-xs text-stone-700 leading-relaxed font-serif mb-4">
                {u.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs mono font-bold text-stone-800 group-hover:text-red-800 group-hover:underline uppercase tracking-wider">
                기계 시동 & 시각화 가동 →
              </span>
              <span className="text-xs opacity-40 font-mono">EXHIBIT_#0{EXHIBITS_DATA.indexOf(u) + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
