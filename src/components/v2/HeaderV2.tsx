import React from 'react';
import { Key, Sparkles, Cpu } from 'lucide-react';
import type { EpochCategory, AppVersion } from '../../types';

interface HeaderV2Props {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  version: AppVersion;
  onSelectVersion: (v: AppVersion) => void;
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
  onSelectVersion,
}) => {
  const versions: AppVersion[] = ['v1', 'v2', 'v3', 'v4'];

  return (
    <header className="bg-[#fbfaf5] border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      {/* Version Selector Bar */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> SYSTEM_VERSION:
          </span>
          <div className="flex bg-stone-950 p-0.5 rounded border border-stone-800">
            {versions.map((v) => (
              <button
                key={v}
                onClick={() => onSelectVersion(v)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                  version === v
                    ? 'bg-amber-400 text-stone-950 shadow'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
                }`}
              >
                {v} {v === 'v4' && '★ NEW'}
              </button>
            ))}
          </div>
        </div>

        <a
          href="https://gdone9009.github.io/aphorism-synthesizer/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-700/60"
        >
          <Sparkles className="w-3 h-3 text-amber-400" /> 🧪 합성 명언 생성기 바로가기 ↗
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title */}
        <div 
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer text-center md:text-left"
        >
          <h1 className="text-xl md:text-2xl font-black text-stone-900 tracking-tighter uppercase">
            The Museum of Literary Machines
          </h1>
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase mt-0.5">
            V2 ARCHIVE OF MECHANICAL POETICS (1913 - 2026)
          </p>
        </div>

        {/* Category Navigation & Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xs">
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

          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded font-mono font-bold border transition-colors flex items-center gap-1.5 ${
              hasApiKey
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700 hover:bg-emerald-900'
                : 'bg-stone-900 text-stone-100 border-stone-900 hover:bg-stone-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasApiKey ? 'KEY 설정됨' : 'Google API Key'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
