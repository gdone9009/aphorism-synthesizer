import React, { useState } from 'react';
import { generateArtificialPoetry } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Cpu, Sparkles } from 'lucide-react';

const KAFKA_CASTLE_V3 = `카프카 소설 [성(Das Schloss)] 데이터 코퍼스:
K는 늦은 저녁에 도착했다. 마을은 깊은 눈 속에 묻혀 있었다. 성이 있는 산은 안개와 어둠에 휩싸여 있었고, 조그만 빛조차 성의 존재를 알리지 않았다. K는 긴 다리 위에서 한참 동안 서서 상상의 공허를 바라보았다.

논리 연산 셋:
[IF 눈 = 백색 THEN 문 = 잠금]
[NOT 주관적_감정]
[AND 확률_행렬_0.38]`;

export const BenseArtificialPoetryV3: React.FC = () => {
  const [corpus, setCorpus] = useState(KAFKA_CASTLE_V3);
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
            정보미학 논리 코퍼스 (Corpus & Logic Matrix)
          </label>
          <textarea
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            rows={8}
            className="w-full p-3 font-serif text-sm border-2 border-stone-800 rounded bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-800" />
            미학적 정보 인공시 (Aesthetic Information Output)
          </label>

          <div className="w-full h-56 p-6 font-mono text-sm border-2 border-stone-900 bg-[#f4f1e8] rounded text-purple-950 overflow-y-auto leading-relaxed shadow-inner font-bold">
            {loading ? (
              <div className="text-center py-12 text-stone-400 italic animate-pulse">
                확률 행렬과 논리 연산자에 따른 주관성 해방 인공시 산출 중...
              </div>
            ) : poemText ? (
              <div className="whitespace-pre-line leading-loose">
                {poemText}
              </div>
            ) : (
              <p className="text-stone-400 italic font-normal">
                '인공시 연산' 버튼을 눌러 주관적 경험이 배제된 미학적 기하 언어를 도출하세요.
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full py-4 bg-purple-950 hover:bg-black text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-30"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            정보미학 연산 가동 (Execute Information Aesthetics)
          </button>
        </div>
      </div>
    </div>
  );
};
