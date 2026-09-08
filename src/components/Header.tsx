import React from 'react';
import { Key, Sparkles, BookOpen, Compass } from 'lucide-react';
import type { EpochCategory, EpochInfo } from '../types';

interface HeaderProps {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const EPOCHS: EpochInfo[] = [
  { id: 'REDUCTION', name: '환원의 시대', desc: '언어를 통계적 사슬과 수치미학으로 환원 (1913~1959)' },
  { id: 'AUTOMATION', name: '자동화의 시대', desc: '다이얼, 카드로 서사 생성을 기계화 (1953~1967)' },
  { id: 'DISCOVERY_RESISTANCE', name: '발굴과 저항의 시대', desc: '벡터 보간, 신체 소음, 변증법적 저항 (1941~2026)' },
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  return (
    <header className="border-b-2 border-stone-800 bg-[#f4f1e8] shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div 
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer group text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2">
            <BookOpen className="w-6 h-6 text-red-800 group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              The Museum of Literary Machines
            </h1>
          </div>
          <p className="text-xs md:text-sm italic text-stone-600 font-serif mt-0.5">
            문학 기계 박물관: 1913년 마르코프 사슬에서 2026년 Gemini까지의 기술사
          </p>
        </div>

        {/* Epoch Navigation & API Key */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => onSelectCategory('MAIN')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
              currentCategory === 'MAIN'
                ? 'bg-stone-900 text-amber-100 border-stone-900 shadow-sm'
                : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline-block mr-1" />
            계보도 (Main Hall)
          </button>

          {EPOCHS.map((epoch) => (
            <button
              key={epoch.id}
              onClick={() => onSelectCategory(epoch.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                currentCategory === epoch.id
                  ? 'bg-red-800 text-stone-100 border-red-900 shadow-sm'
                  : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
              }`}
            >
              {epoch.name}
            </button>
          ))}

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
              hasApiKey
                ? 'bg-emerald-800 text-emerald-100 border-emerald-900 hover:bg-emerald-700'
                : 'bg-amber-800 text-amber-100 border-amber-900 hover:bg-amber-700 animate-pulse'
            }`}
            title="Google Gemini API Key 설정"
          >
            <Key className="w-3.5 h-3.5" />
            {hasApiKey ? 'GEMINI_CONNECTED' : 'SET_API_KEY'}
            <Sparkles className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
