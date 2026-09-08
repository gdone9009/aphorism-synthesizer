import { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AphorismSynthesizerApp } from './components/AphorismSynthesizerApp';
import { getStoredApiKey } from './services/geminiService';
import { Sparkles, BookOpen, ExternalLink } from 'lucide-react';

// V1 / Museum components for fallback view
import { TimelineMainHall, EXHIBITS_DATA } from './components/TimelineMainHall';
import { ExhibitWrapper } from './components/ExhibitWrapper';
import { MarkovMachine } from './components/exhibits/MarkovMachine';
import { DahlGrammatizator } from './components/exhibits/DahlGrammatizator';
import { CalvinoStoryMachine } from './components/exhibits/CalvinoStoryMachine';
import { BorgesLibrary } from './components/exhibits/BorgesLibrary';
import { BenseArtificialPoetry } from './components/exhibits/BenseArtificialPoetry';
import { BarakaScriber } from './components/exhibits/BarakaScriber';
import { ParrishSynthesizer } from './components/exhibits/ParrishSynthesizer';
import { KineticBreath } from './components/exhibits/KineticBreath';
import { OhSentenceBaduk } from './components/exhibits/OhSentenceBaduk';
import type { EpochCategory, MachineId } from './types';

export function App() {
  const [mainView, setMainView] = useState<'SYNTHESIZER' | 'MUSEUM'>('SYNTHESIZER');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [, setHasApiKey] = useState(false);

  // Museum fallback state
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(null);
  const [currentCategory] = useState<EpochCategory | 'MAIN'>('MAIN');

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const handleSaveApiKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  const selectedExhibit = EXHIBITS_DATA.find(e => e.id === selectedMachineId);

  const renderMuseumContent = () => {
    switch (selectedMachineId) {
      case 'MARKOV': return <MarkovMachine />;
      case 'DAHL_PEDAL': return <DahlGrammatizator />;
      case 'CALVINO_MACHINE': return <CalvinoStoryMachine />;
      case 'BORGES_LIBRARY': return <BorgesLibrary />;
      case 'MAX_BENSE': return <BenseArtificialPoetry />;
      case 'EXPRESSION_SCRIBER': return <BarakaScriber />;
      case 'PARRISH_SYNTHESIZER': return <ParrishSynthesizer />;
      case 'KINETIC_BREATH': return <KineticBreath />;
      case 'SENTENCE_GO': return <OhSentenceBaduk />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-stone-900 flex flex-col font-serif">
      {/* Global Top Navbar */}
      <header className="border-b-2 border-stone-800 bg-stone-900 text-stone-100 py-3 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-400 text-stone-950 flex items-center justify-center font-bold font-mono text-sm">
              AS
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base tracking-tight text-amber-100 font-mono">
                합성 명언 생성기 <span className="text-xs text-amber-400 font-normal">Aphorism Synthesizer</span>
              </h1>
              <p className="text-[10px] text-stone-400 font-mono">
                GOOGLE GEMINI API INTEGRATED • 160 MATERIALS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMainView('SYNTHESIZER');
                setSelectedMachineId(null);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mainView === 'SYNTHESIZER'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>명언 합성기</span>
            </button>

            <button
              onClick={() => setMainView('MUSEUM')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mainView === 'MUSEUM'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>내장 박물관 뷰</span>
            </button>

            <a
              href="https://gdone9009.github.io/the-museum-of-literary-machines/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>🏛️ 문학기계박물관 바로가기</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main App Area */}
      <main className="flex-1">
        {mainView === 'SYNTHESIZER' ? (
          <AphorismSynthesizerApp
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        ) : (
          <div className="py-6">
            {selectedExhibit ? (
              <ExhibitWrapper
                exhibit={selectedExhibit}
                onBack={() => setSelectedMachineId(null)}
              >
                {renderMuseumContent()}
              </ExhibitWrapper>
            ) : (
              <TimelineMainHall
                selectedCategory={currentCategory}
                onSelectMachine={(id) => setSelectedMachineId(id)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 py-6 bg-white/80 backdrop-blur-sm text-center text-xs text-stone-600 font-serif mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2026 합성 명언 생성기 (Aphorism Synthesizer). Built with React 19, Tailwind CSS & Google Gemini API.</p>
          <p className="font-mono text-[10px] text-stone-400">
            GITHUB PAGES READY | GOOGLE_ANTIGRAVITY
          </p>
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
