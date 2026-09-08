import React from 'react';
import { Key, Sparkles } from 'lucide-react';
import type { EpochCategory } from '../../types';

interface HeaderV2Props {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  version: 'v1' | 'v2';
  onToggleVersion: () => void;
}

export const CATEGORIES_V2 = [
  { id: 'REDUCTION', name: '환원의 시대', desc: '언어를 통계적 사슬로 환원합니다.' },
  { id: 'AUTOMATION', name: '자동화의 시대', desc: '서사 생성의 규격화 및 다이얼 기계화.' },
  { id: 'DISCOVERY_RESISTANCE', name: '발굴과 저항의 시대', desc: '벡터 보간, 신체 소음, 변증법적 긴장.' },
];

export const HeaderV2: React.FC<HeaderV2Props> = ({
  currentCategory,
  onSelectCategory,
  onOpenApiKeyModal,
  hasApiKey,
  version,
  onToggleVersion,
}) => {
  return (
    <header className="bg-[#fbfaf5] border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div 
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer text-center md:text-left"
        >
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tighter uppercase">
            The Museum of Literary Machines
          </h1>
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase mt-0.5">
            1913 - 2026 ARCHIVE OF MECHANICAL POETICS
          </p>
        </div>

        {/* Category Navigation & Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xs">
          {/* Main Hall Tab */}
          <button
            onClick={() => onSelectCategory('MAIN')}
            className={`px-3 py-1.5 rounded transition-all ${
              currentCategory === 'MAIN'
                ? 'bg-black text-white font-bold'
                : 'text-stone-600 hover:text-black hover:bg-stone-100'
            }`}
          >
            Main Hall (계보도)
          </button>

          <div className="w-px h-4 bg-stone-300 mx-1 hidden md:block" />

          {/* Epoch Category Tabs */}
          {CATEGORIES_V2.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as EpochCategory)}
              className={`px-3 py-1.5 rounded transition-all ${
                currentCategory === cat.id
                  ? 'bg-black text-white font-bold'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="w-px h-4 bg-stone-300 mx-1 hidden md:block" />

          {/* Version Switcher */}
          <button
            onClick={onToggleVersion}
            className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold rounded border border-stone-400"
            title="V1과 V2 버전을 전환합니다"
          >
            MODE: <span className="text-red-700 font-black">{version.toUpperCase()}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded border uppercase ${
              hasApiKey
                ? 'bg-emerald-900 text-white border-emerald-950'
                : 'bg-red-700 text-white border-red-900 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {hasApiKey ? 'GEMINI_CONNECTED' : 'SET_API_KEY'}
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
