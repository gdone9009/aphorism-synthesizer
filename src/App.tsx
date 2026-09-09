import { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AphorismSynthesizerApp } from './components/AphorismSynthesizerApp';
import { getStoredApiKey } from './services/geminiService';
import { Sparkles, ExternalLink, Key } from 'lucide-react';

export function App() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const handleSaveApiKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-stone-900 flex flex-col font-serif">
      {/* Dedicated Header for Aphorism Synthesizer */}
      <header className="border-b-2 border-stone-800 bg-stone-900 text-stone-100 py-3.5 px-4 md:px-8 shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-400 text-stone-950 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg tracking-tight text-amber-100 font-serif flex items-center gap-2">
                합성 명언 생성기 <span className="text-xs text-amber-400 font-mono font-normal">Aphorism Synthesizer</span>
              </h1>
              <p className="text-[11px] text-stone-400 font-mono">
                160 MATERIALS • GOOGLE GEMINI API INTEGRATED
              </p>
            </div>
          </div>

          {/* Actions & Cross-Link */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded font-mono text-xs font-bold transition-all shadow-sm ${
                hasApiKey 
                  ? 'bg-emerald-950 text-emerald-200 border border-emerald-700 hover:bg-emerald-900' 
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasApiKey ? 'Google Key 설정됨' : 'Google API Key 입력'}</span>
            </button>

            <a
              href="https://gdone9009.github.io/the-museum-of-literary-machines/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded text-xs font-mono font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>🏛️ 문학기계박물관 바로가기</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content: Pure Aphorism Synthesizer Application */}
      <main className="flex-1">
        <AphorismSynthesizerApp
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
      </main>

      {/* Dedicated Footer */}
      <footer className="border-t border-stone-300 py-6 bg-white text-center text-xs text-stone-600 font-serif mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-bold text-stone-800">합성 명언 생성기 (Aphorism Synthesizer)</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              기존 명언·명구 160선 재료의 대립과 융합 및 Google Gemini API 기반 사유 오케스트레이션
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px] text-stone-500">
              INDEPENDENT REPOSITORY: <span className="text-stone-800 font-bold">aphorism-synthesizer</span>
            </p>
            <p className="font-mono text-[10px] text-stone-400 mt-0.5">
              © 2026 Built with React 19, Tailwind CSS & Google Gemini
            </p>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
