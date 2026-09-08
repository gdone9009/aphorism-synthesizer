import React, { useState } from 'react';
import { generateArtificialPoetry } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Cpu, Sparkles } from 'lucide-react';

const KAFKA_CASTLE_CORPUS_V2 = `카프카 소설 [성(Das Schloss)] 코퍼스:
K는 늦은 저녁에 도착했다. 마을은 깊은 눈 속에 묻혀 있었다. 성이 있는 산은 안개와 어둠에 휩싸여 있었고, 조그만 빛조차 성의 존재를 알리지 않았다. K는 긴 다리 위에서 한참 동안 서서 상상의 공허를 바라보았다.

논리 연산 규칙:
[IF 눈 = 백색 THEN 문 = 잠금]
[NOT 주관적_감정]
[AND 확률_행렬_0.38]`;

export const BenseArtificialPoetryV2: React.FC = () => {
  const [corpus, setCorpus] = useState(KAFKA_CASTLE_CORPUS_V2);
  const [poemText, setPoemText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    audioSynth.playLever();
    setLoading(true);
    try {
      const result = await generateArtificialPoetry(corpus);
      setPoemText(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            CORPUS_INPUT (정보미학 코퍼스)
          </label>
          <textarea
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            rows={8}
            className="w-full p-3 font-serif text-sm border border-stone-300 rounded-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-stone-700" />
            GENERATED_ARTIFICIAL_POETRY (생성된 인공시)
          </label>

          <div className="w-full h-56 p-6 font-mono text-sm border border-stone-300 bg-stone-50 rounded-sm text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {loading ? (
              <div className="text-center py-12 text-stone-400 italic animate-pulse">
                의미를 제거하고 미학적 정보(Aesthetic Information) 연산 중...
              </div>
            ) : poemText ? (
              <div className="whitespace-pre-line font-bold text-stone-900">
                {poemText}
              </div>
            ) : (
              <p className="text-stone-400 italic">
                '인공시 연산' 버튼을 클릭하여 감정이 배제된 정제된 언어 구조를 확인하세요.
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full py-4 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Execute Information Aesthetics (인공시 연산 가동)
          </button>
        </div>
      </div>
    </div>
  );
};
