import React, { useState } from 'react';
import type { ExhibitItem } from '../../types';
import { ArrowLeft, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

interface ExhibitWrapperV3Props {
  exhibit: ExhibitItem;
  onBack: () => void;
  children: React.ReactNode;
}

export const ExhibitWrapperV3: React.FC<ExhibitWrapperV3Props> = ({
  exhibit,
  onBack,
  children,
}) => {
  const [docentPlaying, setDocentPlaying] = useState(false);

  const handleBack = () => {
    audioSynth.playClick();
    onBack();
  };

  const toggleDocent = () => {
    audioSynth.playClick();
    setDocentPlaying(!docentPlaying);
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
      <div className="bg-[#fbfaf5] border-2 border-stone-900 shadow-2xl rounded-sm overflow-hidden relative">
        {/* Watermark letter */}
        <div className="absolute top-4 right-6 text-7xl font-mono font-black text-stone-200 pointer-events-none select-none">
          {exhibit.id.slice(0, 3)}
        </div>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b-2 border-stone-900 bg-[#f4f1e8]">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-bold text-red-900 bg-red-100 px-2.5 py-0.5 rounded border border-red-300">
                [{exhibit.year}] {exhibit.category}
              </span>
              <span className="mono text-xs text-stone-600 font-bold">
                {exhibit.creator}
              </span>
            </div>

            {/* Docent Toggle Button */}
            <button
              onClick={toggleDocent}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold rounded-sm border uppercase transition-all ${
                docentPlaying ? 'bg-amber-900 text-white border-amber-950 animate-pulse' : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
              }`}
            >
              {docentPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {docentPlaying ? '큐레이터 도슨트 ON' : '도슨트 해설 켜기'}
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-stone-950 mb-2">
            {exhibit.name}
          </h2>
          <p className="text-sm md:text-base italic text-stone-700 font-serif mb-4">
            {exhibit.description}
          </p>

          {/* Docent Audio Guide Box if playing */}
          {docentPlaying && (
            <div className="bg-amber-100 border-2 border-amber-800 p-4 rounded mb-4 text-xs font-serif text-amber-950 space-y-1 animate-fade-in shadow">
              <span className="font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> DOCENT_AUDIO_GUIDE:
              </span>
              <p className="leading-relaxed">
                "이 기계는 인간의 언어를 전형적인 기계적 질서 속으로 밀어 넣은 후, 예상치 못한 논리의 불꽃(Spark)이나 파국(Overturn)을 도출하도록 설계되었습니다. 조작반과 시각화 그래프를 직접 움직이며 인간과 기계 간의 긴장을 느껴보십시오."
              </p>
            </div>
          )}

          {/* Historical Context Callout */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-950 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Media History & Philosophy:
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
