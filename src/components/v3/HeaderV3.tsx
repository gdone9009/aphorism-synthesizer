import React from 'react';
import { Key, Sparkles, Network, Compass, Download } from 'lucide-react';
import type { EpochCategory } from '../../types';

interface HeaderV3Props {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  onOpenSynergyModal: () => void;
  onOpenExporterModal: () => void;
  hasApiKey: boolean;
  version: 'v1' | 'v2' | 'v3';
  onSelectVersion: (v: 'v1' | 'v2' | 'v3') => void;
}

export const CATEGORIES_V3 = [
  { id: 'REDUCTION', name: '환원의 시대', desc: '1913~1959 통계 및 수치 미학' },
  { id: 'AUTOMATION', name: '자동화의 시대', desc: '1953~1967 규칙 기반 소설 공학' },
  { id: 'DISCOVERY_RESISTANCE', name: '발굴과 저항의 시대', desc: '1941~2026 벡터 공간 및 변증법적 저항' },
];

export const HeaderV3: React.FC<HeaderV3Props> = ({
  currentCategory,
  onSelectCategory,
  onOpenApiKeyModal,
  onOpenSynergyModal,
  onOpenExporterModal,
  hasApiKey,
  version,
  onSelectVersion,
}) => {
  return (
    <header className="bg-[#fcfbf7] border-b-2 border-stone-900 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div 
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer text-center md:text-left group"
        >
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="mono text-xs font-black bg-stone-900 text-amber-300 px-2 py-0.5 rounded shadow-sm">
              CYBERNETIC_V3
            </span>
            <h1 className="text-xl md:text-2xl font-black text-stone-950 tracking-tighter uppercase group-hover:text-red-800 transition-colors">
              The Museum of Literary Machines
            </h1>
          </div>
          <p className="text-[11px] text-stone-500 font-mono tracking-widest uppercase mt-0.5">
            사이버네틱 문학 기술사 및 실시간 AI-벡터 종합 시스템
          </p>
        </div>

        {/* Category Navigation & Cybernetic Tools */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xs">
          
          {/* Cross Link to Aphorism Synthesizer Site */}
          <a
            href="https://gdone9009.github.io/aphorism-synthesizer/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-sm font-mono font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 border border-stone-900 shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            <span>🧪 합성 명언 생성기 바로가기</span>
          </a>
          <button
            onClick={() => onSelectCategory('MAIN')}
            className={`px-3 py-1.5 rounded-sm transition-all font-bold ${
              currentCategory === 'MAIN'
                ? 'bg-stone-950 text-amber-200 shadow'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline-block mr-1" />
            계보도 (Main Hall)
          </button>

          <div className="w-px h-4 bg-stone-300 mx-1 hidden md:block" />

          {/* Epoch Category Tabs */}
          {CATEGORIES_V3.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as EpochCategory)}
              className={`px-3 py-1.5 rounded-sm transition-all font-bold ${
                currentCategory === cat.id
                  ? 'bg-red-900 text-stone-100 shadow'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="w-px h-4 bg-stone-300 mx-1 hidden md:block" />

          {/* Synergy Pipeline Button */}
          <button
            onClick={onOpenSynergyModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-indigo-100 font-bold rounded-sm shadow transition-all hover:scale-105"
            title="여러 문학 기계를 하나로 연결하는 교차 파이프라인 모드"
          >
            <Network className="w-3.5 h-3.5 text-indigo-300" />
            기계 교차 파이프라인
          </button>

          {/* Artifact Exporter Button */}
          <button
            onClick={onOpenExporterModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-100 font-bold rounded-sm shadow transition-all hover:scale-105"
            title="작성된 문학 결과물을 사이버네틱 판화/원고로 내보내기"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            원고 내보내기
          </button>

          {/* Version Switcher Selector */}
          <select
            value={version}
            onChange={(e) => onSelectVersion(e.target.value as 'v1' | 'v2' | 'v3')}
            className="px-2 py-1 bg-stone-200 text-stone-900 font-bold rounded border border-stone-400 focus:outline-none cursor-pointer"
          >
            <option value="v3">V3 (Cybernetic Mode)</option>
            <option value="v2">V2 (Reference Exact)</option>
            <option value="v1">V1 (Classic Mode)</option>
          </select>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded-sm uppercase ${
              hasApiKey
                ? 'bg-emerald-900 text-emerald-100 border border-emerald-950'
                : 'bg-red-800 text-white border border-red-950 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {hasApiKey ? 'GEMINI_CONNECTED' : 'SET_API_KEY'}
            <Sparkles className="w-3 h-3 text-amber-300" />
          </button>

        </div>
      </div>
    </header>
  );
};
