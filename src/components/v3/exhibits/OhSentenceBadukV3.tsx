import React, { useState } from 'react';
import { generateSentenceBadukResponse, generatePoeticFlint } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import type { PoeticFlintResult } from '../../../types';
import { Flame, MessageSquare, Send, Grid } from 'lucide-react';

export const OhSentenceBadukV3: React.FC = () => {
  const [tab, setTab] = useState<'baduk' | 'flint'>('baduk');

  const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'user', content: '어느 날, 온 몸이 황금빛인 고양이를 보았다.' },
    { role: 'model', content: '고양이는 조용히 눈을 감으며 말하길, "나는 당신의 미래가 삼켜버린 정적이다."' }
  ]);
  const [userSentence, setUserSentence] = useState('');
  const [loadingBaduk, setLoadingBaduk] = useState(false);

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
      <div className="flex gap-3 border-b border-stone-300 pb-3">
        <button
          onClick={() => { audioSynth.playClick(); setTab('baduk'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            tab === 'baduk' ? 'bg-amber-950 text-white shadow' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> 문장 바둑판 (Sentence Go Board)
        </button>

        <button
          onClick={() => { audioSynth.playClick(); setTab('flint'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            tab === 'flint' ? 'bg-amber-950 text-white shadow' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <Flame className="w-4 h-4" /> 시적 부싯돌 (Poetic Flint Spark)
        </button>
      </div>

      {tab === 'baduk' ? (
        <div className="space-y-6">
          {/* Sentence Go Grid Header */}
          <div className="bg-amber-100/60 border border-amber-300 p-3 rounded text-amber-950 font-mono text-xs flex justify-between items-center">
            <span className="font-bold flex items-center gap-1.5"><Grid className="w-4 h-4 text-amber-800" /> SENTENCE_BADUK_BOARD (문장 바둑 대국)</span>
            <span>TOTAL_MOVES: {history.length}</span>
          </div>

          <div className="bg-[#f4f1e8] border-2 border-stone-900 p-6 rounded shadow-inner max-h-80 overflow-y-auto space-y-4 paper-texture">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded border max-w-[85%] ${
                  msg.role === 'user'
                    ? 'ml-auto bg-stone-100 border-stone-300 text-stone-900 font-serif'
                    : 'mr-auto bg-stone-950 border-black text-amber-100 font-bold border-l-8 border-red-700 shadow'
                }`}
              >
                <div className="text-[10px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${msg.role === 'user' ? 'bg-stone-400' : 'bg-red-600'}`} />
                  {msg.role === 'user' ? `백돌 (Human Move #${idx + 1})` : `흑돌 (Machine Move #${idx + 1})`}
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}

            {loadingBaduk && (
              <div className="text-stone-500 font-mono text-xs italic text-center py-2 animate-pulse">
                기계가 바둑판 위 수를 읽고 서사 논리를 꺾는 흑돌 문장을 놓는 중...
              </div>
            )}
          </div>

          <form onSubmit={handleSendBaduk} className="flex gap-3">
            <input
              type="text"
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder="다음 백돌 착수 문장을 놓으십시오..."
              className="flex-1 p-3 font-serif text-sm border-2 border-stone-400 rounded bg-white"
            />
            <button
              type="submit"
              disabled={loadingBaduk || !userSentence.trim()}
              className="px-6 py-3 bg-amber-950 hover:bg-black text-amber-200 font-mono text-xs font-bold uppercase rounded shadow flex items-center gap-1.5 disabled:opacity-30"
            >
              <Send className="w-4 h-4" /> 착수
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {(['w1', 'w2', 'w3'] as const).map((key, idx) => (
              <div key={key}>
                <label className="block text-[11px] font-mono font-bold uppercase text-stone-700 mb-1">
                  시어 #{idx + 1}
                </label>
                <input
                  type="text"
                  value={words[key]}
                  onChange={(e) => setWords({ ...words, [key]: e.target.value })}
                  className="w-full p-2.5 font-serif text-sm border border-stone-400 rounded bg-white text-center font-bold"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStrikeFlint}
            disabled={loadingFlint}
            className="w-full py-4 bg-amber-950 hover:bg-black text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            {loadingFlint ? '마찰열 도출 중...' : 'Poetic Flint Strike (시적 부싯돌 타격)'}
          </button>

          {flintResult && (
            <div className="bg-white border-2 border-amber-900 p-6 rounded shadow-xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                <span className="font-mono text-xs font-bold text-amber-950 uppercase">
                  [SPARK_WORD] 4번째 발견 시어:
                </span>
                <span className="font-mono font-black text-lg text-red-700 bg-red-100 px-3 py-0.5 rounded border border-red-300">
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
