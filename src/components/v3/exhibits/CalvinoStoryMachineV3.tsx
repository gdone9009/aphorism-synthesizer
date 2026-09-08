import React, { useState, useEffect } from 'react';
import { generateCalvinoVerbs, generateCalvinoNextSentence, generateCalvinoOverturn } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Layers, RefreshCw, Zap, TrendingUp } from 'lucide-react';

export const CalvinoStoryMachineV3: React.FC = () => {
  const [storyHistory, setStoryHistory] = useState<string[]>([
    '밤이 깊어지자 도서관의 마지막 사서는 열쇠를 쥔 채 서고 중앙의 고풍스러운 기계 앞에 섰다.'
  ]);
  const [verbs, setVerbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionText, setActionText] = useState('');

  const fullStory = storyHistory.join(' ');

  const fetchVerbs = async () => {
    setLoading(true);
    try {
      const v = await generateCalvinoVerbs(fullStory);
      setVerbs(v);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerbs();
  }, [storyHistory]);

  const handleSelectVerb = async (verb: string) => {
    audioSynth.playClick();
    setLoading(true);
    setActionText(`동사 타로 [${verb}] 카드를 뒤집는 중...`);
    try {
      const next = await generateCalvinoNextSentence(fullStory, verb);
      setStoryHistory(prev => [...prev, next]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setActionText('');
    }
  };

  const handleOverturn = async () => {
    audioSynth.playLever();
    setLoading(true);
    setActionText('유령(Ghost)의 메타픽션적 파국 반전 개입 중...');
    try {
      const overturn = await generateCalvinoOverturn(fullStory);
      setStoryHistory(prev => [...prev, `>>> ${overturn}`]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setActionText('');
    }
  };

  const handleReset = () => {
    audioSynth.playClick();
    setStoryHistory(['밤이 깊어지자 도서관의 마지막 사서는 열쇠를 쥔 채 서고 중앙의 고풍스러운 기계 앞에 섰다.']);
  };

  return (
    <div className="space-y-8">
      {/* Story Board */}
      <div className="bg-[#f5f2e9] border-2 border-stone-900 p-6 rounded shadow-inner space-y-4 min-h-[220px]">
        <div className="flex justify-between items-center border-b border-stone-300 pb-2">
          <span className="font-mono text-xs font-bold text-stone-800 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-800" />
            NARRATIVE_SEQUENCE_TOPOLOGY (서사 위상 궤적)
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-mono text-stone-500 hover:text-stone-900 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 리셋
          </button>
        </div>

        <div className="space-y-3 font-serif text-base text-stone-900 leading-relaxed max-h-72 overflow-y-auto pr-2">
          {storyHistory.map((sentence, idx) => {
            const isOverturn = sentence.startsWith('>>>');
            return (
              <p
                key={idx}
                className={`p-3.5 rounded border ${
                  isOverturn
                    ? 'bg-red-950 text-amber-200 font-bold border-red-900 border-l-8 shadow'
                    : 'bg-white border-stone-300 text-stone-900'
                }`}
              >
                {sentence}
              </p>
            );
          })}

          {loading && (
            <div className="p-3 text-center text-xs font-mono text-stone-500 italic animate-pulse">
              {actionText || '칼비노 조합론 기계 연산 중...'}
            </div>
          )}
        </div>
      </div>

      {/* Narrative Topology Tension Curve */}
      <div className="bg-stone-900 text-stone-100 p-4 rounded border border-stone-800 font-mono text-xs space-y-2">
        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> NARRATIVE_TENSION_GRAPH (서사 긴장도 곡선)
          </span>
          <span>STEPS: {storyHistory.length}</span>
        </div>
        <div className="flex items-end gap-2 h-16 pt-2">
          {storyHistory.map((s, i) => {
            const isOverturn = s.startsWith('>>>');
            const h = isOverturn ? 100 : Math.min(90, (i + 1) * 20);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full transition-all duration-300 ${isOverturn ? 'bg-red-600 animate-pulse' : 'bg-amber-500'}`}
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-stone-400">#{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Tarot Cards Deck */}
      <div className="space-y-4">
        <label className="block text-xs font-mono font-bold uppercase text-stone-800">
          행동 동사 타로 덱 (SELECT VERB TAROT CARD)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {verbs.map((verb, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSelectVerb(verb)}
              className="bg-[#fbfaf5] border-2 border-stone-900 hover:border-red-900 hover:bg-amber-50 p-4 rounded text-center transition-all shadow-md hover:shadow-xl disabled:opacity-40 active:scale-95 group relative overflow-hidden"
            >
              <span className="block font-mono text-[9px] text-stone-400 mb-1">TAROT_#0{idx + 1}</span>
              <span className="block font-serif text-lg font-bold text-stone-900 group-hover:text-red-900">
                {verb}
              </span>
            </button>
          ))}
        </div>

        {/* Ghost Overturn Button */}
        <button
          onClick={handleOverturn}
          disabled={loading}
          className="w-full py-4 bg-red-950 hover:bg-black text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        >
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          유령 버튼: 서사 뒤집기 (TRIGGER OVERTURN / GHOST INVERSION)
        </button>
      </div>
    </div>
  );
};
