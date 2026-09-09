import React from 'react';
import type { ExhibitItem } from '../../types';
import { ArrowLeft, Cpu, Sparkles } from 'lucide-react';

interface ExhibitWrapperV4Props {
  exhibit: ExhibitItem;
  onBack: () => void;
  children: React.ReactNode;
}

export const ExhibitWrapperV4: React.FC<ExhibitWrapperV4Props> = ({ exhibit, onBack, children }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6 font-serif space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono font-bold rounded border border-stone-800 transition-all hover:-translate-x-1 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" /> 메인 전시관으로 돌아가기 (MAIN HALL)
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYSTEM_V4: ACTIVE_EXHIBIT</span>
        </div>
      </div>

      {/* Exhibit Header Banner */}
      <div className="bg-stone-950 text-stone-100 border-2 border-amber-500/60 p-6 rounded-lg shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span>[{exhibit.year}] {exhibit.creator}</span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                {exhibit.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-100 font-serif">
              {exhibit.name}
            </h2>
            <p className="text-stone-300 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
              {exhibit.historicalContext}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Machine Content Area */}
      <div className="bg-white border-2 border-stone-900 rounded-lg p-6 md:p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
};
