import React from 'react';
import { Key, Sparkles, Network, Download, Cpu } from 'lucide-react';
import type { EpochCategory, AppVersion } from '../../types';

interface HeaderV4Props {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  onOpenSynergyModal: () => void;
  onOpenExporterModal: () => void;
  hasApiKey: boolean;
  version: AppVersion;
  onSelectVersion: (v: AppVersion) => void;
}

export const HeaderV4: React.FC<HeaderV4Props> = ({
  currentCategory,
  onSelectCategory,
  onOpenApiKeyModal,
  onOpenSynergyModal,
  onOpenExporterModal,
  hasApiKey,
  version,
  onSelectVersion,
}) => {
  const versions: AppVersion[] = ['v1', 'v2', 'v3', 'v4'];

  return (
    <header className="bg-stone-950 text-stone-100 border-b-2 border-amber-500/50 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Version Selector Bar */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-1.5 flex justify-between items-center text-xs font-mono">
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

        <div className="flex items-center gap-3">
          <a
            href="https://gdone9009.github.io/aphorism-synthesizer/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-700/60"
          >
            <Sparkles className="w-3 h-3 text-amber-400" /> 🧪 합성 명언 생성기 바로가기 ↗
          </a>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title */}
        <div
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer text-center md:text-left group"
        >
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <span className="mono text-xs font-black bg-amber-400 text-stone-950 px-2 py-0.5 rounded shadow-sm">
              CYBERNETIC_V4_ULTRA
            </span>
            <h1 className="text-xl md:text-2xl font-black text-amber-100 tracking-tighter uppercase group-hover:text-amber-400 transition-colors">
              The Museum of Literary Machines
            </h1>
          </div>
          <p className="text-[11px] text-stone-400 font-mono tracking-widest uppercase mt-1">
            사이버네틱 문학 기술사 및 V4 멀티-에이전트 시너지 시스템
          </p>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xs">
          <button
            onClick={() => onSelectCategory('MAIN')}
            className={`px-3 py-1.5 rounded border transition-all font-bold ${
              currentCategory === 'MAIN'
                ? 'bg-amber-400 text-stone-950 border-amber-400'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
            }`}
          >
            🏛️ 메인 전시관
          </button>

          <button
            onClick={onOpenSynergyModal}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>파이프라인 시너지</span>
          </button>

          <button
            onClick={onOpenExporterModal}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>아티팩트 내보내기</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded font-bold border transition-colors flex items-center gap-1.5 ${
              hasApiKey
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700 hover:bg-emerald-900'
                : 'bg-amber-500 text-stone-950 border-amber-400 hover:bg-amber-400'
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
