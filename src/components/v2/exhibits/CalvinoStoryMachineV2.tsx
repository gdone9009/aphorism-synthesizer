import React, { useState, useEffect } from 'react';
import { generateCalvinoVerbs, generateCalvinoNextSentence, generateCalvinoOverturn } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { RefreshCw, Zap } from 'lucide-react';

export const CalvinoStoryMachineV2: React.FC = () => {
  const [storyHistory, setStoryHistory] = useState<string[]>([
    '어느 가을날, 늙은 기사는 숲의 입구에서 타로 카드처럼 배열된 동사들을 보았다.'
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
    setActionText(`동사 [${verb}] 연결 중...`);
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
    setActionText('뒤집기 (The Overturn / 유령 개입 중)...');
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
    setStoryHistory(['어느 가을날, 늙은 기사는 숲의 입구에서 타로 카드처럼 배열된 동사들을 보았다.']);
  };

  return (
    <div className="space-y-6">
      {/* Story Board */}
      <div className="bg-stone-50 border border-stone-200 p-6 rounded-sm space-y-4 min-h-[220px]">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3 font-mono text-xs">
          <span className="font-bold text-stone-900 uppercase">
            STORY_SEQUENCE (이야기 연쇄)
          </span>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-900 flex items-center gap-1 uppercase"
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
                className={`p-3 rounded-sm border ${
                  isOverturn
                    ? 'bg-black text-white font-bold border-l-8 border-red-600'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                {isOverturn ? sentence.replace('>>> ', '') : sentence}
              </p>
            );
          })}

          {loading && (
            <div className="p-3 text-center text-xs font-mono text-stone-400 italic animate-pulse">
              {actionText || '조합론 기계 연산 중...'}
            </div>
          )}
        </div>
      </div>

      {/* Action Verbs Tarot Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-mono font-bold uppercase text-stone-700">
          핵심 동사 선택 (SELECT VERB ACTION CARD)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {verbs.map((verb, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSelectVerb(verb)}
              className="bg-white border border-stone-300 hover:border-black p-4 rounded-sm text-center transition-all shadow-sm hover:shadow-md disabled:opacity-30 group"
            >
              <span className="block font-mono text-[9px] text-stone-400 mb-1">VERB_CARD_#0{idx + 1}</span>
              <span className="block font-serif text-base font-bold text-stone-900 group-hover:text-red-700">
                {verb}
              </span>
            </button>
          ))}
        </div>

        {/* Overturn Button matching exact reference UI */}
        <button
          onClick={handleOverturn}
          disabled={loading}
          className="w-full py-4 bg-red-700 hover:bg-black text-white font-mono font-bold uppercase tracking-widest text-xs rounded-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          뒤집기 (THE OVERTURN / GHOST INVERSION)
        </button>
      </div>
    </div>
  );
};
