import React from 'react';
import type { ExhibitItem } from '../types';
import { ArrowLeft, Info } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface ExhibitWrapperProps {
  exhibit: ExhibitItem;
  onBack: () => void;
  children: React.ReactNode;
}

export const ExhibitWrapper: React.FC<ExhibitWrapperProps> = ({
  exhibit,
  onBack,
  children,
}) => {
  const handleBack = () => {
    audioSynth.playClick();
    onBack();
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        계보도 메인 홀로 돌아가기 (Return to Main Hall)
      </button>

      {/* Exhibit Container */}
      <div className="bg-[#fbfaf5] border-2 border-stone-800 shadow-2xl rounded-sm overflow-hidden relative">
        {/* Background ID watermark */}
        <div className="absolute top-4 right-6 text-7xl font-mono font-black text-stone-200 pointer-events-none select-none">
          {exhibit.id.slice(0, 3)}
        </div>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b-2 border-stone-800 bg-[#f4f1e8]">
          <div className="flex items-center gap-2 mb-2">
            <span className="mono text-xs font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-300">
              [{exhibit.year}] {exhibit.category}
            </span>
            <span className="mono text-xs text-stone-500 font-bold">
              {exhibit.creator}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">
            {exhibit.name}
          </h2>
          <p className="text-sm md:text-base italic text-stone-700 font-serif mb-4">
            {exhibit.description}
          </p>

          {/* Historical Context Callout */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-900 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Context & Philosophy:
            </div>
            <p className="text-xs md:text-sm text-amber-950 font-serif leading-relaxed">
              {exhibit.historicalContext}
            </p>
          </div>
        </div>

        {/* Interactive Machine Content */}
        <div className="p-6 md:p-8 bg-[#fbfaf5]">
          {children}
        </div>
      </div>
    </div>
  );
};
