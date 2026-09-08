import React, { useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { audioSynth } from '../../../services/audioSynth';

const DEFAULT_CORPUS_V2 = `Мой дядя самых честных правил,
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

export const MarkovMachineV2: React.FC = () => {
  const [corpus, setCorpus] = useState(DEFAULT_CORPUS_V2);
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

      const windowWords = result.slice(-nGram);
      current = windowWords.join(' ');
    }

    setGeneratedText(result.join(' '));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            CORPUS_SOURCE (코퍼스 소스)
          </label>
          <textarea
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            rows={8}
            className="w-full p-3 font-serif text-sm border border-stone-300 rounded-sm bg-white"
          />
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-mono text-stone-500 font-bold">N-GRAM:</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { audioSynth.playClick(); setNGram(n); }}
                className={`px-3 py-1 font-mono text-xs font-bold rounded-sm border ${
                  nGram === n ? 'bg-black text-white border-black' : 'bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {n}-Gram
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            STOCHASTIC_GENERATED_CHAIN (마르코프 사슬 생성)
          </label>
          <div className="w-full h-48 p-4 font-serif text-base border border-stone-300 bg-stone-50 rounded-sm text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {generatedText ? (
              <p className="animate-fade-in">{generatedText}</p>
            ) : (
              <p className="text-stone-400 italic text-sm">
                '마르코프 사슬 연산' 버튼을 클릭하여 확률적 전이 텍스트를 확인하십시오.
              </p>
            )}
          </div>

          <button
            onClick={buildMatrix}
            className="mt-4 w-full py-4 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Generate Stochastic Chain (마르코프 사슬 연산)
          </button>
        </div>
      </div>

      {Object.keys(transitionMatrix).length > 0 && (
        <div className="border-t border-stone-200 pt-4">
          <h4 className="text-xs font-mono font-bold uppercase text-stone-700 mb-2 flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-stone-500" />
            Transition Probability Matrix (전이 확률 행렬)
          </h4>
          <div className="bg-black text-emerald-400 p-4 rounded-sm font-mono text-xs overflow-x-auto max-h-40">
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
