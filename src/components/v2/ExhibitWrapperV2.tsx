import React from 'react';
import type { ExhibitItem } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

interface ExhibitWrapperV2Props {
  exhibit: ExhibitItem;
  onBack: () => void;
  children: React.ReactNode;
}

export const ExhibitWrapperV2: React.FC<ExhibitWrapperV2Props> = ({
  exhibit,
  onBack,
  children,
}) => {
  const handleBack = () => {
    audioSynth.playClick();
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Back to main hall button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        계보도 메인 홀로 돌아가기 (Return to Main Hall)
      </button>

      {/* Exhibit Container matching exact reference 'vn' component */}
      <div className="max-w-4xl mx-auto my-4 p-8 bg-white border border-stone-200 shadow-xl rounded-sm relative overflow-hidden">
        {/* Background Watermark Initial Letter */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none">
          <span className="text-8xl font-bold mono text-stone-900">
            {exhibit.id[0]}
          </span>
        </div>

        {/* Header matching exact reference */}
        <header className="mb-8 border-b border-stone-100 pb-4 relative z-10">
          <div className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest mb-1">
            [{exhibit.year}] {exhibit.creator}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-stone-800">
            {exhibit.name}
          </h2>
          <p className="text-lg italic text-stone-600 mb-4 font-serif">
            {exhibit.description}
          </p>

          {/* Context callout box */}
          <div className="bg-amber-50 p-4 rounded-sm border-l-4 border-amber-200">
            <p className="text-sm text-amber-900 leading-relaxed font-serif">
              <span className="font-bold uppercase text-xs tracking-wider mr-2 font-mono">
                Context:
              </span>
              {exhibit.historicalContext}
            </p>
          </div>
        </header>

        {/* Main Exhibit Body */}
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
