import React from 'react';
import type { ExhibitItem, EpochCategory } from '../types';
import { MachineId } from '../types';
import { Sparkles, Cpu, Mic, Compass, Radio, BookOpen, Layers, Wind, Grid } from 'lucide-react';

interface TimelineMainHallProps {
  onSelectMachine: (id: MachineId) => void;
  selectedCategory: EpochCategory | 'MAIN';
}

export const EXHIBITS_DATA: ExhibitItem[] = [
  {
    id: MachineId.MARKOV,
    name: '마르코프, 확률적 텍스트',
    creator: '안드레이 마르코프 (Andrey Markov)',
    year: '1913',
    description: '언어를 통계적 사슬로 환원합니다. 푸시킨의 예브게니 오네긴 분석에서 시작된 연쇄의 미학입니다.',
    historicalContext: '안드레이 마르코프는 문학을 자음과 모음의 확률적 전이 과정으로 보았습니다. 이는 기계가 언어를 이해하는 첫 번째 문법이 되었습니다.',
    category: 'REDUCTION',
  },
  {
    id: MachineId.MAX_BENSE,
    name: '막스 벤제 & 테오 루츠, 인공시',
    creator: 'Max Bense & Theo Lutz',
    year: '1959',
    description: '의미의 상실을 통해 미학적 이득을 취합니다. 언어를 인간의 주관성에서 해방시킨 순수 언어 유희입니다.',
    historicalContext: '1959년 스투트가르트 학파는 카프카의 성(城)을 코퍼스로 삼아 확률 행렬과 논리 연산자에 따른 인공시를 탄생시켰습니다.',
    category: 'REDUCTION',
  },
  {
    id: MachineId.DAHL_PEDAL,
    name: '로알드 달, 위대한 자동 문법 교정기',
    creator: '로알드 달 (Roald Dahl)',
    year: '1953',
    description: '열정 페달을 통해 감정을 계량화하고, 평범함(Mediocrity)을 목표로 시장을 점령하는 기계입니다.',
    historicalContext: '1953년 로알드 달이 상상한 이 기계는 작가의 저자성을 브랜드로 치환하고, 조작 노브와 이중 페달로 소설을 양산합니다.',
    category: 'AUTOMATION',
  },
  {
    id: MachineId.CALVINO_MACHINE,
    name: '이탈로 칼비노, 이야기 공작 기계',
    creator: '이탈로 칼비노 (Italo Calvino)',
    year: '1967',
    description: '이야기를 동사(Verb)들의 조합으로 환원하고, 유령 버튼으로 세계를 뒤집습니다.',
    historicalContext: '칼비노는 사이버네틱스와 유령에서 문학 과정을 조합적 메커니즘으로 보았으며, 기계적 질서 속의 오차를 문학의 본질로 꼽았습니다.',
    category: 'AUTOMATION',
  },
  {
    id: MachineId.BORGES_LIBRARY,
    name: '보르헤스, 바벨의 도서관',
    creator: '호르헤 루이스 보르헤스 (J.L. Borges)',
    year: '1941',
    description: '존재할 수 있는 모든 텍스트 조합이 이미 잠재되어 있는 무한한 좌표의 공간입니다.',
    historicalContext: '모든 가능한 책이 이미 존재하는 도서관에서 저자는 탐험가가 되어 대괄호 핵심 단어를 통해 의미의 미궁을 항해합니다.',
    category: 'DISCOVERY_RESISTANCE',
  },
  {
    id: MachineId.EXPRESSION_SCRIBER,
    name: '아미리 바라카, 표현 전사기',
    creator: '아미리 바라카 (Amiri Baraka)',
    year: '1960s',
    description: '손가락 끝이 아닌 비명, 숨소리, 웹캠 비디오 스캔 등 신체의 노이즈를 텍스트 중심으로 호출합니다.',
    historicalContext: '서구 이성 중심주의가 절단한 신체성을 복원하려는 전복적 상상의 퀴어링 기계입니다.',
    category: 'DISCOVERY_RESISTANCE',
  },
  {
    id: MachineId.PARRISH_SYNTHESIZER,
    name: '앨리슨 패리시, 문학 신디사이저',
    creator: '앨리슨 패리시 (Allison Parrish)',
    year: '2010s',
    description: '언어를 벡터 공간의 연속적 신호로 변환하여 의미를 보간하고 신조어를 믹싱합니다.',
    historicalContext: '텍스트 사이의 의미론적 중간 지점을 탐색하며 언어의 이산성을 연속성으로 전복합니다.',
    category: 'DISCOVERY_RESISTANCE',
  },
  {
    id: MachineId.KINETIC_BREATH,
    name: '마리네티와 캄푸스의 표현, 키네틱 브레스',
    creator: 'F.T. Marinetti & Haroldo de Campos',
    year: '20세기',
    description: '마이크 숨결이 텍스트를 연기처럼 흩날리게 하고, 침묵은 단어들을 0의 구조로 응집시킵니다.',
    historicalContext: '미래파의 소음/속도와 구체시의 구조적 긴장 사이를 오가는 청각-시각 캔버스 물리 실험입니다.',
    category: 'DISCOVERY_RESISTANCE',
  },
  {
    id: MachineId.SENTENCE_GO,
    name: '오영진, 문장 바둑 & 시적 부싯돌',
    creator: '오영진 (Youngjin Oh)',
    year: '2020s',
    description: '기계의 전형성에 저항하며 인간과 AI가 한 수씩 문장을 주고받아 낯선 긴장을 유지하는 변증법적 창작 실험입니다.',
    historicalContext: '확률적 안정성으로 도망치려는 기계를 인간의 아이러니한 문장으로 자극하여 부싯돌처럼 불을 얻는 과정입니다.',
    category: 'DISCOVERY_RESISTANCE',
  },
];

const getMachineIcon = (id: MachineId) => {
  switch (id) {
    case MachineId.MARKOV: return <Grid className="w-5 h-5 text-indigo-700" />;
    case MachineId.MAX_BENSE: return <Cpu className="w-5 h-5 text-purple-700" />;
    case MachineId.DAHL_PEDAL: return <Radio className="w-5 h-5 text-red-700" />;
    case MachineId.CALVINO_MACHINE: return <Layers className="w-5 h-5 text-amber-700" />;
    case MachineId.BORGES_LIBRARY: return <BookOpen className="w-5 h-5 text-emerald-700" />;
    case MachineId.EXPRESSION_SCRIBER: return <Mic className="w-5 h-5 text-rose-700" />;
    case MachineId.PARRISH_SYNTHESIZER: return <Compass className="w-5 h-5 text-blue-700" />;
    case MachineId.KINETIC_BREATH: return <Wind className="w-5 h-5 text-cyan-700" />;
    case MachineId.SENTENCE_GO: return <Sparkles className="w-5 h-5 text-yellow-700" />;
  }
};

export const TimelineMainHall: React.FC<TimelineMainHallProps> = ({
  onSelectMachine,
  selectedCategory,
}) => {
  const filteredExhibits = selectedCategory === 'MAIN'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter(e => e.category === selectedCategory);

  return (
    <section className="max-w-6xl mx-auto py-8 px-4">
      {/* Intro Banner */}
      <div className="bg-[#f2efe4] border-2 border-stone-800 p-6 md:p-8 rounded-sm shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-stone-300 pointer-events-none select-none font-serif text-9xl opacity-20">
          ⚙️
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-3 tracking-tight">
          기계 문학의 계보도 (Genealogy of Machine Literature)
        </h2>
        <p className="text-stone-700 text-sm md:text-base leading-relaxed max-w-4xl font-serif">
          언어는 언제부터 기계의 대상이 되었는가? 1913년 안드레이 마르코프가 자음과 모음을 확률 행렬로 분해한 순간부터, 로알드 달의 감정 제어 페달, 칼비노의 타로 동사 카드, 그리고 보르헤스의 바벨의 도서관을 거쳐 현대 LLM(Gemini)에 이르기까지—인간과 기계가 교차해 온 9가지 혁신적 창작 기계를 직접 조작해 보세요.
        </p>
      </div>

      {/* Grid of Exhibits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibits.map((exhibit) => (
          <div
            key={exhibit.id}
            onClick={() => onSelectMachine(exhibit.id)}
            className="group relative bg-[#fbfaf5] border-2 border-stone-800 p-6 rounded-sm hover:border-red-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  {getMachineIcon(exhibit.id)}
                  <span className="mono text-xs font-bold text-stone-500 uppercase tracking-widest">
                    [{exhibit.year}]
                  </span>
                </div>
                <span className={`text-[10px] mono font-bold px-2 py-0.5 rounded border uppercase ${
                  exhibit.category === 'REDUCTION'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : exhibit.category === 'AUTOMATION'
                    ? 'bg-red-100 text-red-900 border-red-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}>
                  {exhibit.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 group-hover:text-red-800 transition-colors mb-1">
                {exhibit.name}
              </h3>
              <p className="text-xs italic text-stone-600 mb-3 font-serif">
                {exhibit.creator}
              </p>
              <p className="text-xs text-stone-700 leading-relaxed font-serif mb-4">
                {exhibit.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] mono font-bold text-stone-600 group-hover:text-red-900 group-hover:underline">
                기계 시동하기 →
              </span>
              <span className="text-xs opacity-40 font-mono">EXHIBIT_#0{filteredExhibits.indexOf(exhibit) + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
