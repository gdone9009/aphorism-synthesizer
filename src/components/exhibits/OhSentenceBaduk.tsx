import React, { useState } from 'react';
import { generateSentenceBadukResponse, generatePoeticFlint } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import type { PoeticFlintResult } from '../../types';
import { MessageSquare, Flame, Send } from 'lucide-react';

export const OhSentenceBaduk: React.FC = () => {
  const [tab, setTab] = useState<'baduk' | 'flint'>('baduk');

  // Sentence Baduk State
  const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'user', content: '어느 날, 온 몸이 황금빛인 고양이를 보았다.' },
    { role: 'model', content: '고양이는 조용히 눈을 감으며 말하길, "나는 당신이 잃어버린 미래의 서술어다."' }
  ]);
  const [userSentence, setUserSentence] = useState('');
  const [loadingBaduk, setLoadingBaduk] = useState(false);

  // Poetic Flint State
  const [words, setWords] = useState({ w1: '거울', w2: '회로', w3: '기억' });
  const [flintResult, setFlintResult] = useState<PoeticFlintResult | null>(null);
  const [loadingFlint, setLoadingFlint] = useState(false);

  // Send Sentence Baduk Turn
  const handleSendBaduk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim() || loadingBaduk) return;

    audioSynth.playClick();
    const newHistory = [...history, { role: 'user' as const, content: userSentence }];
    setHistory(newHistory);
    setUserSentence('');
    setLoadingBaduk(true);

    try {
      const modelResp = await generateSentenceBadukResponse(newHistory);
      setHistory([...newHistory, { role: 'model' as const, content: modelResp }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBaduk(false);
    }
  };

  // Trigger Poetic Flint
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
      {/* Mode Switcher */}
      <div className="flex gap-2 border-b border-stone-300 pb-3">
        <button
          onClick={() => { audioSynth.playClick(); setTab('baduk'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            tab === 'baduk'
              ? 'bg-amber-900 text-white shadow'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          문장 바둑 (Sentence Baduk)
        </button>

        <button
          onClick={() => { audioSynth.playClick(); setTab('flint'); }}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded uppercase ${
            tab === 'flint'
              ? 'bg-amber-900 text-white shadow'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <Flame className="w-4 h-4" />
          시적 부싯돌 (Poetic Flint)
        </button>
      </div>

      {tab === 'baduk' ? (
        /* Sentence Baduk Mode */
        <div className="space-y-4">
          <p className="text-xs text-stone-600 italic">
            인간과 AI가 한 수씩 문장을 주고받습니다. 기계의 전형성을 무너뜨리는 낯선 문장으로 긴장감을 높이세요.
          </p>

          {/* Baduk Sentence Board */}
          <div className="bg-[#f4f1e8] border-2 border-stone-800 p-6 rounded shadow-inner max-h-80 overflow-y-auto space-y-4 paper-texture">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-sm border max-w-[85%] ${
                  msg.role === 'user'
                    ? 'ml-auto bg-stone-100 border-stone-300 text-stone-900 font-serif'
                    : 'mr-auto bg-stone-900 border-stone-950 text-white font-bold border-l-8 border-red-700'
                }`}
              >
                <div className="text-[10px] font-mono text-stone-400 mb-1">
                  {msg.role === 'user' ? '인간의 수 (Human Move)' : '기계의 응수 (Machine Move)'}
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}

            {loadingBaduk && (
              <div className="text-stone-500 font-mono text-xs italic text-center py-2 animate-pulse">
                기계가 판을 읽고 낯선 응수 문장을 놓는 중...
              </div>
            )}
          </div>

          {/* User Move Input */}
          <form onSubmit={handleSendBaduk} className="flex gap-3">
            <input
              type="text"
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder="다음 문장의 수를 놓으십시오 (예: 침묵 속에서 기계가 스스로 기침했다)..."
              className="flex-1 p-3 font-serif text-sm border-2 border-stone-400 rounded bg-white"
            />
            <button
              type="submit"
              disabled={loadingBaduk || !userSentence.trim()}
              className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-stone-100 font-mono text-xs font-bold uppercase rounded shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> 착수
            </button>
          </form>
        </div>
      ) : (
        /* Poetic Flint Mode */
        <div className="space-y-6">
          <p className="text-xs text-stone-600 italic">
            3개의 시어 사이의 마찰열을 감지하여 4번째 '숨겨진 시어(Spark Word)'를 발견하고 시를 불꽃처럼 피워냅니다.
          </p>

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
                  className="w-full p-2.5 font-serif text-sm border border-stone-400 rounded bg-white text-center font-bold text-stone-900"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStrikeFlint}
            disabled={loadingFlint}
            className="w-full py-4 bg-amber-950 hover:bg-amber-900 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            부싯돌 치기 (Strike Poetic Flint)
          </button>

          {flintResult && (
            <div className="bg-white border-2 border-amber-900 p-6 rounded shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-mono text-xs font-bold text-amber-900 uppercase">
                  [SPARK WORD] 발견된 4번째 숨겨진 시어:
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
