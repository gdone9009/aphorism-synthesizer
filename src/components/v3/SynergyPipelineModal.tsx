import React, { useState } from 'react';
import { Network, Play, X, ArrowRight, Sparkles } from 'lucide-react';
import { EXHIBITS_DATA } from '../TimelineMainHall';
import { generateDahlText, generateCalvinoNextSentence, generateInterpolatedText } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';

interface SynergyPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SynergyPipelineModal: React.FC<SynergyPipelineModalProps> = ({ isOpen, onClose }) => {
  const [sourceId, setSourceId] = useState('MARKOV');
  const [processId, setProcessId] = useState('DAHL_PEDAL');
  const [filterId, setFilterId] = useState('PARRISH_SYNTHESIZER');
  
  const [pipelineOutput, setPipelineOutput] = useState<{ step1: string; step2: string; final: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunPipeline = async () => {
    audioSynth.playLever();
    setLoading(true);
    setPipelineOutput(null);

    try {
      // Step 1: Source Seed
      const step1Text = "어느 밤, 410자의 무한한 도서관 서고 속에서 정적과 회로가 교차했다.";

      // Step 2: Process Machine (Dahl or Calvino)
      let step2Text = "";
      if (processId === 'DAHL_PEDAL') {
        step2Text = await generateDahlText({
          subject: step1Text,
          genre: 'Sci-Fi Pulp',
          tension: 80,
          surprise: 90,
          humor: 20,
          pathos: 50,
          mystery: 95,
          passion: 75,
          calmness: 45
        });
      } else {
        step2Text = await generateCalvinoNextSentence(step1Text, '뒤집다');
      }

      // Step 3: Filter (Parrish Interpolation)
      const finalResult = await generateInterpolatedText(step1Text, step2Text, 0.65);

      setPipelineOutput({
        step1: step1Text,
        step2: step2Text,
        final: finalResult
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#fbfaf5] border-2 border-stone-900 rounded-sm shadow-2xl max-w-3xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-stone-900">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b-2 border-stone-900 pb-4 mb-6">
          <Network className="w-7 h-7 text-indigo-900" />
          <div>
            <h2 className="text-2xl font-black text-stone-950 uppercase tracking-tight">
              기계 교차 결합 파이프라인 (Cross-Machine Synergy Engine)
            </h2>
            <p className="text-xs text-stone-600 font-serif">
              서로 다른 시대의 문학 기계 3개를 직렬 파이프라인으로 연결하여 연쇄적 텍스트 융합을 일으킵니다.
            </p>
          </div>
        </div>

        {/* Pipeline Builder Selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Machine 1 */}
          <div className="bg-stone-100 p-4 border border-stone-300 rounded-sm space-y-2">
            <span className="mono text-[10px] font-bold text-indigo-900 uppercase block">[STAGE 1: SOURCE]</span>
            <label className="block text-xs font-bold text-stone-800">시작 코퍼스 기계</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full p-2 font-mono text-xs border border-stone-400 rounded bg-white"
            >
              {EXHIBITS_DATA.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Machine 2 */}
          <div className="bg-stone-100 p-4 border border-stone-300 rounded-sm space-y-2">
            <span className="mono text-[10px] font-bold text-indigo-900 uppercase block">[STAGE 2: PROCESS]</span>
            <label className="block text-xs font-bold text-stone-800">서사 가공 기계</label>
            <select
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              className="w-full p-2 font-mono text-xs border border-stone-400 rounded bg-white"
            >
              {EXHIBITS_DATA.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Machine 3 */}
          <div className="bg-stone-100 p-4 border border-stone-300 rounded-sm space-y-2">
            <span className="mono text-[10px] font-bold text-indigo-900 uppercase block">[STAGE 3: FILTER]</span>
            <label className="block text-xs font-bold text-stone-800">벡터/음운 믹서 기계</label>
            <select
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              className="w-full p-2 font-mono text-xs border border-stone-400 rounded bg-white"
            >
              {EXHIBITS_DATA.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunPipeline}
          disabled={loading}
          className="w-full py-4 bg-indigo-950 hover:bg-black text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30 mb-6"
        >
          <Play className="w-4 h-4 text-amber-400" />
          {loading ? '기계 교차 가동 중... 연쇄 텍스트 결합 파이프라인 가동...' : '파이프라인 연속 실행 (RUN SYNERGY PIPELINE)'}
        </button>

        {/* Pipeline Visual Results */}
        {pipelineOutput && (
          <div className="bg-white border-2 border-indigo-900 p-6 rounded-sm space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-2 border-b border-indigo-200 pb-2 text-xs font-mono font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-700" /> [SYNERGY_RESULT] 교차 융합된 사이버네틱 문학
            </div>

            <div className="space-y-3 font-serif text-sm">
              <div className="p-3 bg-stone-100 rounded border border-stone-300">
                <span className="block font-mono text-[10px] font-bold text-stone-500 mb-1">STAGE 1 SOURCE SEED:</span>
                "{pipelineOutput.step1}"
              </div>
              
              <div className="flex justify-center text-stone-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="p-3 bg-stone-100 rounded border border-stone-300">
                <span className="block font-mono text-[10px] font-bold text-stone-500 mb-1">STAGE 2 NARRATIVE PROCESS:</span>
                "{pipelineOutput.step2}"
              </div>

              <div className="flex justify-center text-stone-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="p-4 bg-indigo-950 text-stone-100 rounded-sm font-bold text-base border border-indigo-900 shadow">
                <span className="block font-mono text-[10px] text-amber-300 mb-1">FINAL SYNTHESIZED ARTIFACT:</span>
                "{pipelineOutput.final}"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
