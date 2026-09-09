import React from 'react';
import { Key, Sparkles, BookOpen, Compass, Cpu } from 'lucide-react';
import type { EpochCategory, EpochInfo, AppVersion } from '../types';

interface HeaderProps {
  currentCategory: EpochCategory | 'MAIN';
  onSelectCategory: (cat: EpochCategory | 'MAIN') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  version: AppVersion;
  onSelectVersion: (v: AppVersion) => void;
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
  version,
  onSelectVersion,
}) => {
  const versions: AppVersion[] = ['v1', 'v2', 'v3', 'v4'];

  return (
    <header className="border-b-2 border-stone-800 bg-[#f4f1e8] shadow-md sticky top-0 z-40">
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

      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title */}
        <div 
          onClick={() => onSelectCategory('MAIN')}
          className="cursor-pointer group text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2">
            <BookOpen className="w-6 h-6 text-red-800 group-hover:rotate-12 transition-transform" />
            <h1 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
              The Museum of Literary Machines
            </h1>
          </div>
          <p className="text-xs italic text-stone-600 font-serif mt-0.5">
            문학 기계 박물관 (V1 Architecture): 1913년 마르코프 사슬에서 2026년 Gemini까지의 기술사
          </p>
        </div>

        {/* Epoch Navigation & API Key */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xs">
          <button
            onClick={() => onSelectCategory('MAIN')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded border transition-all ${
              currentCategory === 'MAIN'
                ? 'bg-stone-900 text-amber-100 border-stone-900 shadow-sm'
                : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline-block mr-1" />
            계보도
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded font-bold border transition-colors flex items-center gap-1.5 ${
              hasApiKey
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : 'bg-stone-900 text-stone-100 border-stone-900 hover:bg-red-900'
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
