import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TimelineMainHall, EXHIBITS_DATA } from './components/TimelineMainHall';
import { ExhibitWrapper } from './components/ExhibitWrapper';
import type { EpochCategory, MachineId } from './types';
import { getStoredApiKey } from './services/geminiService';

// V1 Exhibits
import { MarkovMachine } from './components/exhibits/MarkovMachine';
import { DahlGrammatizator } from './components/exhibits/DahlGrammatizator';
import { CalvinoStoryMachine } from './components/exhibits/CalvinoStoryMachine';
import { BorgesLibrary } from './components/exhibits/BorgesLibrary';
import { BenseArtificialPoetry } from './components/exhibits/BenseArtificialPoetry';
import { BarakaScriber } from './components/exhibits/BarakaScriber';
import { ParrishSynthesizer } from './components/exhibits/ParrishSynthesizer';
import { KineticBreath } from './components/exhibits/KineticBreath';
import { OhSentenceBaduk } from './components/exhibits/OhSentenceBaduk';

// V2 Components (Reference Exact Mode)
import { HeaderV2 } from './components/v2/HeaderV2';
import { MainHallV2 } from './components/v2/MainHallV2';
import { ExhibitWrapperV2 } from './components/v2/ExhibitWrapperV2';
import { DahlGrammatizatorV2 } from './components/v2/exhibits/DahlGrammatizatorV2';
import { CalvinoStoryMachineV2 } from './components/v2/exhibits/CalvinoStoryMachineV2';
import { BorgesLibraryV2 } from './components/v2/exhibits/BorgesLibraryV2';
import { BarakaScriberV2 } from './components/v2/exhibits/BarakaScriberV2';
import { ParrishSynthesizerV2 } from './components/v2/exhibits/ParrishSynthesizerV2';
import { KineticBreathV2 } from './components/v2/exhibits/KineticBreathV2';
import { OhSentenceBadukV2 } from './components/v2/exhibits/OhSentenceBadukV2';
import { MarkovMachineV2 } from './components/v2/exhibits/MarkovMachineV2';
import { BenseArtificialPoetryV2 } from './components/v2/exhibits/BenseArtificialPoetryV2';

export function App() {
  const [version, setVersion] = useState<'v1' | 'v2'>('v2'); // Default to V2 as requested by user
  const [currentCategory, setCurrentCategory] = useState<EpochCategory | 'MAIN'>('MAIN');
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const handleSaveApiKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  const selectedExhibit = EXHIBITS_DATA.find(e => e.id === selectedMachineId);

  const renderV1Content = () => {
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

  const renderV2Content = () => {
    switch (selectedMachineId) {
      case 'MARKOV': return <MarkovMachineV2 />;
      case 'DAHL_PEDAL': return <DahlGrammatizatorV2 />;
      case 'CALVINO_MACHINE': return <CalvinoStoryMachineV2 />;
      case 'BORGES_LIBRARY': return <BorgesLibraryV2 />;
      case 'MAX_BENSE': return <BenseArtificialPoetryV2 />;
      case 'EXPRESSION_SCRIBER': return <BarakaScriberV2 />;
      case 'PARRISH_SYNTHESIZER': return <ParrishSynthesizerV2 />;
      case 'KINETIC_BREATH': return <KineticBreathV2 />;
      case 'SENTENCE_GO': return <OhSentenceBadukV2 />;
      default: return null;
    }
  };

  const handleToggleVersion = () => {
    setVersion(prev => (prev === 'v1' ? 'v2' : 'v1'));
  };

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-stone-900 flex flex-col font-serif selection:bg-red-200 jacquard-pattern">
      {/* Header according to version */}
      {version === 'v2' ? (
        <HeaderV2
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSelectedMachineId(null);
          }}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={hasApiKey}
          version={version}
          onToggleVersion={handleToggleVersion}
        />
      ) : (
        <div className="relative">
          <div className="bg-stone-900 text-stone-200 text-xs font-mono py-1 px-4 text-center flex justify-between items-center">
            <span>[MODE: V1 - CUSTOM ARCHITECTURE]</span>
            <button
              onClick={handleToggleVersion}
              className="bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded text-[10px]"
            >
              SWITCH TO V2 (EXACT REFERENCE) →
            </button>
          </div>
          <Header
            currentCategory={currentCategory}
            onSelectCategory={(cat) => {
              setCurrentCategory(cat);
              setSelectedMachineId(null);
            }}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            hasApiKey={hasApiKey}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {version === 'v2' ? (
          selectedExhibit ? (
            <ExhibitWrapperV2
              exhibit={selectedExhibit}
              onBack={() => setSelectedMachineId(null)}
            >
              {renderV2Content()}
            </ExhibitWrapperV2>
          ) : (
            <MainHallV2
              selectedCategory={currentCategory}
              onSelectMachine={(id) => setSelectedMachineId(id)}
            />
          )
        ) : (
          selectedExhibit ? (
            <ExhibitWrapper
              exhibit={selectedExhibit}
              onBack={() => setSelectedMachineId(null)}
            >
              {renderV1Content()}
            </ExhibitWrapper>
          ) : (
            <TimelineMainHall
              selectedCategory={currentCategory}
              onSelectMachine={(id) => setSelectedMachineId(id)}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 bg-white/80 backdrop-blur-sm text-center text-xs text-stone-500 font-serif mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2026 The Museum of Literary Machines ({version.toUpperCase()}). Built with React 19, Tailwind CSS & Google Gemini.</p>
          <p className="mono text-[10px] text-stone-400">
            REFERENCE_EXACT_MODE: {version.toUpperCase()} | GOOGLE_ANTIGRAVITY
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
