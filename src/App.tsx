import { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { getStoredApiKey } from './services/geminiService';
import type { EpochCategory, MachineId } from './types';

// V3 Cybernetic Museum Components
import { HeaderV3 } from './components/v3/HeaderV3';
import { MainHallV3 } from './components/v3/MainHallV3';
import { EXHIBITS_DATA } from './components/TimelineMainHall';
import { ExhibitWrapperV3 } from './components/v3/ExhibitWrapperV3';
import { SynergyPipelineModal } from './components/v3/SynergyPipelineModal';
import { ArtifactExporterModal } from './components/v3/ArtifactExporterModal';

import { MarkovMachineV3 } from './components/v3/exhibits/MarkovMachineV3';
import { DahlGrammatizatorV3 } from './components/v3/exhibits/DahlGrammatizatorV3';
import { CalvinoStoryMachineV3 } from './components/v3/exhibits/CalvinoStoryMachineV3';
import { BorgesLibraryV3 } from './components/v3/exhibits/BorgesLibraryV3';
import { BenseArtificialPoetryV3 } from './components/v3/exhibits/BenseArtificialPoetryV3';
import { BarakaScriberV3 } from './components/v3/exhibits/BarakaScriberV3';
import { ParrishSynthesizerV3 } from './components/v3/exhibits/ParrishSynthesizerV3';
import { KineticBreathV3 } from './components/v3/exhibits/KineticBreathV3';
import { OhSentenceBadukV3 } from './components/v3/exhibits/OhSentenceBadukV3';

// V2 Components
import { DahlGrammatizatorV2 } from './components/v2/exhibits/DahlGrammatizatorV2';
import { CalvinoStoryMachineV2 } from './components/v2/exhibits/CalvinoStoryMachineV2';
import { BorgesLibraryV2 } from './components/v2/exhibits/BorgesLibraryV2';
import { BarakaScriberV2 } from './components/v2/exhibits/BarakaScriberV2';
import { ParrishSynthesizerV2 } from './components/v2/exhibits/ParrishSynthesizerV2';
import { KineticBreathV2 } from './components/v2/exhibits/KineticBreathV2';
import { OhSentenceBadukV2 } from './components/v2/exhibits/OhSentenceBadukV2';
import { MarkovMachineV2 } from './components/v2/exhibits/MarkovMachineV2';
import { BenseArtificialPoetryV2 } from './components/v2/exhibits/BenseArtificialPoetryV2';
import { ExhibitWrapperV2 } from './components/v2/ExhibitWrapperV2';

// V1 Components
import { MarkovMachine } from './components/exhibits/MarkovMachine';
import { DahlGrammatizator } from './components/exhibits/DahlGrammatizator';
import { CalvinoStoryMachine } from './components/exhibits/CalvinoStoryMachine';
import { BorgesLibrary } from './components/exhibits/BorgesLibrary';
import { BenseArtificialPoetry } from './components/exhibits/BenseArtificialPoetry';
import { BarakaScriber } from './components/exhibits/BarakaScriber';
import { ParrishSynthesizer } from './components/exhibits/ParrishSynthesizer';
import { KineticBreath } from './components/exhibits/KineticBreath';
import { OhSentenceBaduk } from './components/exhibits/OhSentenceBaduk';
import { ExhibitWrapper } from './components/ExhibitWrapper';

export function App() {
  const [version, setVersion] = useState<'v1' | 'v2' | 'v3'>('v3');
  const [currentCategory, setCurrentCategory] = useState<EpochCategory | 'MAIN'>('MAIN');
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(null);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSynergyModalOpen, setIsSynergyModalOpen] = useState(false);
  const [isExporterModalOpen, setIsExporterModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const handleSaveApiKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  const selectedExhibit = EXHIBITS_DATA.find(e => e.id === selectedMachineId);

  const renderV3Content = () => {
    switch (selectedMachineId) {
      case 'MARKOV': return <MarkovMachineV3 />;
      case 'DAHL_PEDAL': return <DahlGrammatizatorV3 />;
      case 'CALVINO_MACHINE': return <CalvinoStoryMachineV3 />;
      case 'BORGES_LIBRARY': return <BorgesLibraryV3 />;
      case 'MAX_BENSE': return <BenseArtificialPoetryV3 />;
      case 'EXPRESSION_SCRIBER': return <BarakaScriberV3 />;
      case 'PARRISH_SYNTHESIZER': return <ParrishSynthesizerV3 />;
      case 'KINETIC_BREATH': return <KineticBreathV3 />;
      case 'SENTENCE_GO': return <OhSentenceBadukV3 />;
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

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-stone-900 flex flex-col font-serif selection:bg-red-200 jacquard-pattern">
      {/* Header V3 */}
      <HeaderV3
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSelectedMachineId(null);
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSynergyModal={() => setIsSynergyModalOpen(true)}
        onOpenExporterModal={() => setIsExporterModalOpen(true)}
        hasApiKey={hasApiKey}
        version={version}
        onSelectVersion={(v) => setVersion(v)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {version === 'v3' ? (
          selectedExhibit ? (
            <ExhibitWrapperV3
              exhibit={selectedExhibit}
              onBack={() => setSelectedMachineId(null)}
            >
              {renderV3Content()}
            </ExhibitWrapperV3>
          ) : (
            <MainHallV3
              selectedCategory={currentCategory}
              onSelectMachine={(id) => setSelectedMachineId(id)}
            />
          )
        ) : version === 'v2' ? (
          selectedExhibit ? (
            <ExhibitWrapperV2
              exhibit={selectedExhibit}
              onBack={() => setSelectedMachineId(null)}
            >
              {renderV2Content()}
            </ExhibitWrapperV2>
          ) : (
            <MainHallV3
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
            <MainHallV3
              selectedCategory={currentCategory}
              onSelectMachine={(id) => setSelectedMachineId(id)}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 py-6 bg-white/80 backdrop-blur-sm text-center text-xs text-stone-600 font-serif mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2026 The Museum of Literary Machines (문학기계박물관). Built with React 19, Tailwind CSS & Google Gemini API.</p>
          <p className="font-mono text-[10px] text-stone-400">
            GITHUB REPOSITORY: <span className="text-stone-800 font-bold">the-museum-of-literary-machines</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />
      <SynergyPipelineModal
        isOpen={isSynergyModalOpen}
        onClose={() => setIsSynergyModalOpen(false)}
      />
      <ArtifactExporterModal
        isOpen={isExporterModalOpen}
        onClose={() => setIsExporterModalOpen(false)}
      />
    </div>
  );
}

export default App;
