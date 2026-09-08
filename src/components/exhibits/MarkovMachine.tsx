import React, { useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

const DEFAULT_CORPUS = `Мой дядя самых честных правил,
Когда не в шутку занемог,
Он уважать себя заставил
И лучше выдумать не мог.
Его пример другим наука;
Но, боже мой, какая скука
С больным сидеть и день и ночь,
Не отходя шага прочь!

어느 날 온 몸이 황금빛인 고양이를 보았다.
고양이는 창문틀 위에서 햇살을 받으며 조용히 눈을 감고 있었다.
그것은 단순한 동물이 아니라 시간을 자르는 정교한 사슬이었다.`;

export const MarkovMachine: React.FC = () => {
  const [corpus, setCorpus] = useState(DEFAULT_CORPUS);
  const [generatedText, setGeneratedText] = useState('');
  const [transitionMatrix, setTransitionMatrix] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [nGram, setNGram] = useState<number>(2);

  const buildMatrix = () => {
    audioSynth.playLever();
    const words = corpus.trim().split(/\s+/);
    const matrix: { [key: string]: { [key: string]: number } } = {};

    for (let i = 0; i < words.length - nGram; i++) {
      const key = words.slice(i, i + nGram).join(' ');
      const nextWord = words[i + nGram];

      if (!matrix[key]) matrix[key] = {};
      matrix[key][nextWord] = (matrix[key][nextWord] || 0) + 1;
    }

    setTransitionMatrix(matrix);

    // Generate sample text
    const keys = Object.keys(matrix);
    if (keys.length === 0) return;

    let current = keys[Math.floor(Math.random() * keys.length)];
    const result = [current];

    for (let i = 0; i < 25; i++) {
      const nextOptions = matrix[current];
      if (!nextOptions) break;

      const possibleNexts = Object.keys(nextOptions);
      const chosenNext = possibleNexts[Math.floor(Math.random() * possibleNexts.length)];
      result.push(chosenNext);

      // Slide n-gram window
      const windowWords = result.slice(-nGram);
      current = windowWords.join(' ');
    }

    setGeneratedText(result.join(' '));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Corpus */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            1. 입력 코퍼스 (Corpus Source)
          </label>
          <textarea
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            rows={8}
            className="w-full p-3 font-serif text-sm border-2 border-stone-400 rounded bg-white text-stone-900 focus:outline-none focus:border-stone-900"
          />
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs font-mono text-stone-600 font-bold">N-Gram 크기:</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { audioSynth.playClick(); setNGram(n); }}
                className={`px-3 py-1 text-xs font-mono font-bold border rounded ${
                  nGram === n ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {n}-Gram
              </button>
            ))}
          </div>
        </div>

        {/* Generated Stochastic Output */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            2. 마르코프 연쇄 생성 결과 (Stochastic Chain)
          </label>
          <div className="w-full h-48 p-4 font-serif text-base border-2 border-stone-800 bg-[#f4f1e8] rounded text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {generatedText ? (
              <p className="animate-fade-in">{generatedText}</p>
            ) : (
              <p className="text-stone-400 italic text-sm">
                '생성 버튼'을 눌러 코퍼스의 통계적 확률 사슬로 만든 문장을 확인하세요.
              </p>
            )}
          </div>

          <button
            onClick={buildMatrix}
            className="mt-4 w-full py-3 bg-red-900 hover:bg-red-800 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Play className="w-4 h-4" />
            마르코프 사슬 생성 (Generate Stochastic Chain)
          </button>
        </div>
      </div>

      {/* Transition Matrix Sample Display */}
      {Object.keys(transitionMatrix).length > 0 && (
        <div className="mt-6 border-t border-stone-300 pt-4">
          <h4 className="text-xs font-mono font-bold uppercase text-stone-700 mb-2 flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-stone-600" />
            전이 확률 행렬 샘플 (Transition Probability Matrix Sample)
          </h4>
          <div className="bg-stone-900 text-emerald-400 p-4 rounded font-mono text-xs overflow-x-auto max-h-40">
            {Object.entries(transitionMatrix).slice(0, 8).map(([state, nexts]) => (
              <div key={state} className="py-0.5">
                <span className="text-amber-300">"{state}"</span> → {JSON.stringify(nexts)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
