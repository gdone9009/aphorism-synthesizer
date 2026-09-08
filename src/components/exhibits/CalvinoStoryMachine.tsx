import React, { useState, useEffect } from 'react';
import { generateCalvinoVerbs, generateCalvinoNextSentence, generateCalvinoOverturn } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import { Layers, RefreshCw, Zap } from 'lucide-react';

export const CalvinoStoryMachine: React.FC = () => {
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
    setActionText(`동사 카드 [${verb}] 선택 중...`);
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
    setActionText('유령(Ghost)의 파국적 반전 개입 중...');
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
      <div className="bg-[#f4f1e8] border-2 border-stone-800 p-6 rounded shadow-inner space-y-4 min-h-[220px]">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <span className="font-mono text-xs font-bold text-stone-700 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-700" />
            진행 중인 서사 (Story Sequence)
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-mono text-stone-500 hover:text-stone-900 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 처음으로
          </button>
        </div>

        <div className="space-y-3 font-serif text-base text-stone-900 leading-relaxed max-h-72 overflow-y-auto pr-2">
          {storyHistory.map((sentence, idx) => {
            const isOverturn = sentence.startsWith('>>>');
            return (
              <p
                key={idx}
                className={`p-3 rounded border ${
                  isOverturn
                    ? 'bg-red-900 text-stone-100 font-bold border-red-950 border-l-8'
                    : 'bg-white border-stone-200 text-stone-900'
                }`}
              >
                {sentence}
              </p>
            );
          })}

          {loading && (
            <div className="p-3 text-center text-xs font-mono text-stone-500 italic animate-pulse">
              {actionText || '칼비노 조합론 기계 가동 중...'}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls: Tarot Verbs & Ghost Button */}
      <div className="space-y-4">
        <label className="block text-xs font-mono font-bold uppercase text-stone-700">
          다음 행동 동사 카드 선택 (Select Next Action Verb Tarot)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {verbs.map((verb, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSelectVerb(verb)}
              className="bg-[#fbfaf5] border-2 border-stone-800 hover:border-amber-800 hover:bg-amber-50 p-4 rounded text-center transition-all shadow hover:shadow-lg disabled:opacity-50 active:scale-95 group"
            >
              <span className="block font-mono text-[10px] text-stone-400 mb-1">CARD_#0{idx + 1}</span>
              <span className="block font-serif text-base font-bold text-stone-900 group-hover:text-amber-900">
                {verb}
              </span>
            </button>
          ))}
        </div>

        {/* The Overturn Button */}
        <button
          onClick={handleOverturn}
          disabled={loading}
          className="w-full py-4 bg-red-950 hover:bg-red-900 text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          유령 버튼: 서사 뒤집기 (Trigger The Overturn / Ghost Inversion)
        </button>
      </div>
    </div>
  );
};
