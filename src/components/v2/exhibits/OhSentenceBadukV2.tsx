import React, { useState } from 'react';
import { generateSentenceBadukResponse, generatePoeticFlint } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import type { PoeticFlintResult } from '../../../types';
import { Flame, MessageSquare, Send } from 'lucide-react';

export const OhSentenceBadukV2: React.FC = () => {
  const [mode, setMode] = useState<'baduk' | 'flint'>('baduk');

  // Baduk state
  const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'user', content: '어느 날, 온 몸이 황금빛인 고양이를 보았다.' },
    { role: 'model', content: '고양이는 조용히 눈을 감으며 "나는 당신의 미래가 삼켜버린 정적이다"라고 중얼거렸다.' }
  ]);
  const [userSentence, setUserSentence] = useState('');
  const [loadingBaduk, setLoadingBaduk] = useState(false);

  // Flint state
  const [words, setWords] = useState({ w1: '거울', w2: '회로', w3: '기억' });
  const [flintResult, setFlintResult] = useState<PoeticFlintResult | null>(null);
  const [loadingFlint, setLoadingFlint] = useState(false);

  const handleSendBaduk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim() || loadingBaduk) return;

    audioSynth.playClick();
    const newHistory = [...history, { role: 'user' as const, content: userSentence }];
    setHistory(newHistory);
    setUserSentence('');
    setLoadingBaduk(true);

    try {
      const resp = await generateSentenceBadukResponse(newHistory);
      setHistory([...newHistory, { role: 'model' as const, content: resp }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBaduk(false);
    }
  };

  const handleStrikeFlint = async () => {
    audioSynth.playLever();
    setLoadingFlint(true);
    try {
      const res = await generatePoeticFlint(words.w1, words.w2, words.w3);
      setFlintResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFlint(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher matching exact reference UI */}
      <div className="flex gap-3 border-b border-stone-200 pb-3">
        <button
          onClick={() => { audioSynth.playClick(); setMode('baduk'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded-sm uppercase ${
            mode === 'baduk' ? 'bg-black text-white shadow' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Sentence Baduk (문장 바둑)
        </button>

        <button
          onClick={() => { audioSynth.playClick(); setMode('flint'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded-sm uppercase ${
            mode === 'flint' ? 'bg-black text-white shadow' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Flame className="w-4 h-4" /> Poetic Flint (시적 부싯돌)
        </button>
      </div>

      {mode === 'baduk' ? (
        /* Sentence Baduk Mode matching reference styling */
        <div className="space-y-4">
          <div className="bg-stone-100 border border-stone-200 p-6 rounded-sm min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-4 rounded-sm ${
                    msg.role === 'user'
                      ? 'ml-auto bg-stone-200 border border-stone-300 text-stone-800 font-serif'
                      : 'mr-auto bg-black text-white font-bold border-l-8 border-red-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              ))}

              {loadingBaduk && (
                <div className="text-center py-2 text-stone-400 font-mono text-xs italic animate-pulse">
                  기계가 수의 응수를 계산 중...
                </div>
              )}
            </div>

            <form onSubmit={handleSendBaduk} className="flex gap-3 pt-4 border-t border-stone-200">
              <input
                type="text"
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder="다음 착수의 문장을 놓으십시오..."
                className="flex-1 p-3 font-serif text-sm border border-stone-300 rounded-sm bg-white"
              />
              <button
                type="submit"
                disabled={loadingBaduk || !userSentence.trim()}
                className="px-6 py-3 bg-black hover:bg-red-800 text-white font-mono text-xs font-bold uppercase rounded-sm shadow flex items-center gap-1.5 disabled:opacity-30"
              >
                <Send className="w-4 h-4" /> 착수
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Poetic Flint Mode */
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {(['w1', 'w2', 'w3'] as const).map((key, idx) => (
              <div key={key}>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 mb-1">
                  시어 #{idx + 1}
                </label>
                <input
                  type="text"
                  value={words[key]}
                  onChange={(e) => setWords({ ...words, [key]: e.target.value })}
                  className="w-full p-2.5 font-serif text-sm border border-stone-300 rounded-sm bg-white text-center font-bold"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStrikeFlint}
            disabled={loadingFlint}
            className="w-full py-4 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            {loadingFlint ? '시적 마찰열 감지 중...' : 'Poetic Flint Strike (시적 부싯돌 치기)'}
          </button>

          {flintResult && (
            <div className="bg-white border-2 border-stone-900 p-6 rounded-sm shadow-xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="font-mono text-xs font-bold text-stone-500 uppercase">
                  [SPARK_WORD] 4번째 발견 시어:
                </span>
                <span className="font-mono font-black text-lg text-red-700 bg-stone-100 px-3 py-0.5 border border-stone-300">
                  "{flintResult.sparkWord}"
                </span>
              </div>
              <div className="font-serif text-base text-stone-900 leading-relaxed whitespace-pre-line p-2 font-semibold">
                {flintResult.poem}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
