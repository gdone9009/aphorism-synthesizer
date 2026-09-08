import React, { useState } from 'react';
import { 
  APHORISM_MATERIALS, 
  type AphorismMaterial 
} from '../data/aphorisms';
import { 
  generateSynthesis, 
  TOP_10_SYNTHESES, 
  type SynthesisResult 
} from '../services/aphorismSynthesizerService';
import { 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Award, 
  Check, 
  Copy, 
  Search, 
  ChevronRight, 
  Key,
  Flame
} from 'lucide-react';
import { getStoredApiKey } from '../services/geminiService';

interface AphorismSynthesizerAppProps {
  onOpenApiKeyModal: () => void;
}

export const AphorismSynthesizerApp: React.FC<AphorismSynthesizerAppProps> = ({
  onOpenApiKeyModal
}) => {
  // Navigation tabs: 'SYNTHESIZER' | 'TOP10' | 'MATERIALS'
  const [activeTab, setActiveTab] = useState<'SYNTHESIZER' | 'TOP10' | 'MATERIALS'>('SYNTHESIZER');

  // Selected Slots for Synthesis
  const [selectedSlotA, setSelectedSlotA] = useState<AphorismMaterial>(APHORISM_MATERIALS[64]); // Q065 베이컨 default
  const [selectedSlotB, setSelectedSlotB] = useState<AphorismMaterial>(APHORISM_MATERIALS[129]); // Q130 소로 default

  // Material selection modal/picker state
  const [pickerTarget, setPickerTarget] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // Synthesis loading and result
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<SynthesisResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Selected Top 10 item modal
  const [selectedTopItem, setSelectedTopItem] = useState<typeof TOP_10_SYNTHESES[0] | null>(null);

  // Recommended preset pairs
  const PRESET_PAIRS = [
    { name: '도구 vs 삶의 시간', idA: 'Q065', idB: 'Q130' },
    { name: '앎의 성찰 vs 스토아적 방파제', idA: 'Q035', idB: 'Q060' },
    { name: '언어의 한계 vs 득의망언', idA: 'Q150', idB: 'Q011' },
    { name: '자본의 가격 vs 존엄', idA: 'Q084', idB: 'Q124' },
    { name: '괴물과의 싸움 vs 무류성 비판', idA: 'Q145', idB: 'Q091' },
    { name: '자기신뢰 vs 어리석은 일관성', idA: 'Q137', idB: 'Q138' },
  ];

  const hasApiKey = !!getStoredApiKey();

  // Handle Random Pick
  const handleRandomPick = () => {
    const idxA = Math.floor(Math.random() * APHORISM_MATERIALS.length);
    let idxB = Math.floor(Math.random() * APHORISM_MATERIALS.length);
    while (idxB === idxA) {
      idxB = Math.floor(Math.random() * APHORISM_MATERIALS.length);
    }
    setSelectedSlotA(APHORISM_MATERIALS[idxA]);
    setSelectedSlotB(APHORISM_MATERIALS[idxB]);
  };

  // Select Preset Pair
  const handleSelectPreset = (idA: string, idB: string) => {
    const itemA = APHORISM_MATERIALS.find(m => m.id === idA);
    const itemB = APHORISM_MATERIALS.find(m => m.id === idB);
    if (itemA && itemB) {
      setSelectedSlotA(itemA);
      setSelectedSlotB(itemB);
    }
  };

  // Run Synthesis
  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentResult(null);
    try {
      const res = await generateSynthesis(selectedSlotA, selectedSlotB);
      setCurrentResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Result Markdown
  const handleCopyResult = (res: SynthesisResult) => {
    const text = `[합성 명언]
${res.syntheticAphorism}
${res.sourceInfo}

① ${res.step1Author}: "${res.step1Quote}"
- 관계: ${res.step1Relation}
- 상황: ${res.step1Story}

② ${res.step2Author}: "${res.step2Quote}"
- 관계: ${res.step2Relation}
- 상황: ${res.step2Story}

③ 상황끼리의 충돌:
${res.step3Conflict}

④ 합성 및 새 은유: ‘${res.step4MetaphorTitle}’
- 전개: ${res.step4Development}
- 교훈: ${res.step4Lesson}

⑤ 사유의 확장: ${res.step5ExpansionTitle}
${res.step5ExpansionQuestion}

[평가지표 총점: ${res.scores.totalScore}/100점]`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter materials
  const filteredMaterials = APHORISM_MATERIALS.filter(item => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.author.includes(searchQuery) ||
      item.quote.includes(searchQuery) ||
      item.source.includes(searchQuery) ||
      item.topic.includes(searchQuery) ||
      item.tags.some(t => t.includes(searchQuery)) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['전체', '동아시아 고전', '그리스·로마 철학', '근대 사상', '문학의 문장', '에세이와 비평'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-serif">

      {/* Top Banner / Hero Header */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-6 md:p-8 mb-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono rounded-full mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aphorism Synthesizer v2.0</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-amber-100">
              합성 명언 생성기
            </h1>
            <p className="text-stone-400 text-xs md:text-sm mt-2 font-serif leading-relaxed max-w-2xl">
              고전 명명구 160선 원재료의 대립과 융합으로 새로운 사유와 은유를 도출하고, 5단계 체계적 평가지표로 점수화합니다.
            </p>
          </div>

          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold transition-all shadow-md ${
              hasApiKey 
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-700 hover:bg-emerald-900' 
                : 'bg-amber-500 text-stone-950 font-bold hover:bg-amber-400'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{hasApiKey ? 'Google API Key 설정됨' : 'Google API Key 입력하기'}</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('SYNTHESIZER')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold font-mono transition-all ${
              activeTab === 'SYNTHESIZER'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🧪 명언 합성기</span>
          </button>

          <button
            onClick={() => setActiveTab('TOP10')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold font-mono transition-all ${
              activeTab === 'TOP10'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>🏆 최고 명언 TOP 10</span>
          </button>

          <button
            onClick={() => setActiveTab('MATERIALS')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold font-mono transition-all ${
              activeTab === 'MATERIALS'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 원재료 160선 도서관</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SYNTHESIZER */}
      {activeTab === 'SYNTHESIZER' && (
        <div className="space-y-8">
          {/* Preset Recommendation Row */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-amber-900 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 추천 대립 사상 조합 (Quick Presets)
              </span>
              <button
                onClick={handleRandomPick}
                className="flex items-center gap-1 text-xs font-mono font-bold text-stone-700 hover:text-stone-950 bg-white px-3 py-1 rounded border border-stone-300 shadow-sm"
              >
                <RefreshCw className="w-3 h-3" /> 무작위 2개 뽑기
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PAIRS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset.idA, preset.idB)}
                  className="text-xs bg-white hover:bg-amber-100 text-stone-800 border border-stone-300 px-3 py-1.5 rounded font-mono transition-colors shadow-xs"
                >
                  {preset.name} <span className="text-stone-400 font-normal">({preset.idA}+{preset.idB})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slot Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot A */}
            <div className="bg-white border-2 border-stone-800 rounded-lg p-6 shadow-md relative flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">A</span>
                  첫 번째 원재료 (Material A)
                </span>
                <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                  {selectedSlotA.id}
                </span>
              </div>

              <div className="space-y-3 my-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-900">{selectedSlotA.author}</span>
                  <span className="text-xs font-mono text-stone-500">[{selectedSlotA.source}]</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-auto">
                    {selectedSlotA.category}
                  </span>
                </div>
                <blockquote className="text-sm italic font-serif text-stone-800 bg-stone-50 border-l-3 border-amber-500 p-3 rounded">
                  “{selectedSlotA.quote}”
                </blockquote>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedSlotA.context}
                </p>
              </div>

              <button
                onClick={() => setPickerTarget('A')}
                className="mt-4 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded border border-stone-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" /> 원재료 A 변경하기 (160선 검색)
              </button>
            </div>

            {/* Slot B */}
            <div className="bg-white border-2 border-stone-800 rounded-lg p-6 shadow-md relative flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">B</span>
                  두 번째 원재료 (Material B)
                </span>
                <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                  {selectedSlotB.id}
                </span>
              </div>

              <div className="space-y-3 my-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-900">{selectedSlotB.author}</span>
                  <span className="text-xs font-mono text-stone-500">[{selectedSlotB.source}]</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-auto">
                    {selectedSlotB.category}
                  </span>
                </div>
                <blockquote className="text-sm italic font-serif text-stone-800 bg-stone-50 border-l-3 border-amber-500 p-3 rounded">
                  “{selectedSlotB.quote}”
                </blockquote>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedSlotB.context}
                </p>
              </div>

              <button
                onClick={() => setPickerTarget('B')}
                className="mt-4 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded border border-stone-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" /> 원재료 B 변경하기 (160선 검색)
              </button>
            </div>
          </div>

          {/* Action Synthesis Button */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 hover:bg-red-950 text-white font-mono font-bold text-base uppercase tracking-wider rounded-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>사유 합성 및 은유 생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>합성 명언 생성하기 ({selectedSlotA.id} + {selectedSlotB.id})</span>
                </>
              )}
            </button>
            {!hasApiKey && (
              <p className="text-xs font-mono text-amber-700 mt-2">
                * API Key 미입력 시 고도화된 시뮬레이션 모델로 생성됩니다.
              </p>
            )}
          </div>

          {/* Synthesis Result Output Display */}
          {currentResult && (
            <div className="bg-stone-900 text-stone-100 rounded-lg border-2 border-amber-500/50 p-6 md:p-8 shadow-2xl space-y-8 animate-fade-in">
              {/* Synthetic Aphorism Hero Display */}
              <div className="text-center border-b border-stone-800 pb-6 space-y-3">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                  [ 도출된 합성 명언 ]
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 leading-snug font-serif">
                  {currentResult.syntheticAphorism}
                </h2>
                <p className="text-xs text-stone-400 font-mono italic">
                  {currentResult.sourceInfo}
                </p>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => handleCopyResult(currentResult)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono text-xs rounded border border-stone-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사되었습니다!' : '전체 마크다운 복사'}</span>
                  </button>
                </div>
              </div>

              {/* Evaluation Metrics Score Panel */}
              <div className="bg-stone-950 p-5 rounded-lg border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-mono font-bold text-stone-400 uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> 평가지표 점수판 (Evaluation Score)
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    총점: {currentResult.scores.totalScore} / 100점
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-stone-900 p-3 rounded border border-stone-800">
                    <div className="text-stone-400 mb-1">1. 대립 충돌 선명성</div>
                    <div className="text-base font-bold text-amber-200">{currentResult.scores.conflictClarity} / 25점</div>
                  </div>
                  <div className="bg-stone-900 p-3 rounded border border-stone-800">
                    <div className="text-stone-400 mb-1">2. 은유 신선함</div>
                    <div className="text-base font-bold text-amber-200">{currentResult.scores.metaphorFreshness} / 25점</div>
                  </div>
                  <div className="bg-stone-900 p-3 rounded border border-stone-800">
                    <div className="text-stone-400 mb-1">3. 서사 적합성</div>
                    <div className="text-base font-bold text-amber-200">{currentResult.scores.narrativeRelevance} / 25점</div>
                  </div>
                  <div className="bg-stone-900 p-3 rounded border border-stone-800">
                    <div className="text-stone-400 mb-1">4. 사유 확장성</div>
                    <div className="text-base font-bold text-amber-200">{currentResult.scores.thoughtExpansion} / 25점</div>
                  </div>
                </div>
              </div>

              {/* 5-Step Detailed Explanation */}
              <div className="space-y-6 text-sm font-serif leading-relaxed text-stone-200">
                <h3 className="text-base font-bold font-mono text-amber-300 border-b border-stone-800 pb-2">
                  📖 합성 이유 및 5단계 사유 도출 과정
                </h3>

                {/* Step 1 */}
                <div className="bg-stone-950/80 p-4 rounded border-l-4 border-amber-500 space-y-2">
                  <div className="font-bold font-mono text-amber-400 text-xs">
                    ① {currentResult.step1Author} 사상의 재료 추출
                  </div>
                  <blockquote className="italic text-stone-300 text-xs bg-stone-900 p-2 rounded">
                    “{currentResult.step1Quote}”
                  </blockquote>
                  <p className="text-xs"><strong className="text-stone-400">합성에 가져온 관계:</strong> {currentResult.step1Relation}</p>
                  <p className="text-xs"><strong className="text-stone-400">스토리텔링 상황:</strong> {currentResult.step1Story}</p>
                </div>

                {/* Step 2 */}
                <div className="bg-stone-950/80 p-4 rounded border-l-4 border-amber-500 space-y-2">
                  <div className="font-bold font-mono text-amber-400 text-xs">
                    ② {currentResult.step2Author} 사상의 재료 추출
                  </div>
                  <blockquote className="italic text-stone-300 text-xs bg-stone-900 p-2 rounded">
                    “{currentResult.step2Quote}”
                  </blockquote>
                  <p className="text-xs"><strong className="text-stone-400">합성에 가져온 관계:</strong> {currentResult.step2Relation}</p>
                  <p className="text-xs"><strong className="text-stone-400">스토리텔링 상황:</strong> {currentResult.step2Story}</p>
                </div>

                {/* Step 3 */}
                <div className="bg-stone-950/80 p-4 rounded border-l-4 border-red-500 space-y-2">
                  <div className="font-bold font-mono text-red-400 text-xs">
                    ③ 두 상황과 사상 간의 정면 충돌 (Conflict)
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {currentResult.step3Conflict}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-stone-950/80 p-4 rounded border-l-4 border-emerald-500 space-y-2">
                  <div className="font-bold font-mono text-emerald-400 text-xs">
                    ④ 합성 및 새로운 은유: ‘{currentResult.step4MetaphorTitle}’
                  </div>
                  <p className="text-xs"><strong className="text-stone-400">전개 과정:</strong> {currentResult.step4Development}</p>
                  <p className="text-xs"><strong className="text-stone-400">제시 교훈:</strong> {currentResult.step4Lesson}</p>
                </div>

                {/* Step 5 */}
                <div className="bg-stone-950/80 p-4 rounded border-l-4 border-blue-500 space-y-2">
                  <div className="font-bold font-mono text-blue-400 text-xs">
                    ⑤ 사유의 확장: {currentResult.step5ExpansionTitle}
                  </div>
                  <p className="text-xs text-stone-200 italic leading-relaxed">
                    {currentResult.step5ExpansionQuestion}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TOP 10 GALLERY */}
      {activeTab === 'TOP10' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              최고로 적합한 합성 명언 TOP 10 갤러리
            </h2>
            <p className="text-xs text-amber-900 mt-1">
              대립성, 은유의 신선함, 서사 적합성, 사유 확장성 4대 지표(100점 만점)에서 엄선된 10개의 명작 명언입니다. 각 항목을 클릭하면 5단계 사유와 평가지표를 상세히 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOP_10_SYNTHESES.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedTopItem(item)}
                className="bg-white border-2 border-stone-800 rounded-lg p-5 hover:border-amber-600 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                      TOP {index + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800">
                      총점 {item.scores.totalScore}점
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug font-serif">
                    {item.syntheticAphorism}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-1">
                    {item.sourceInfo}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 font-mono">
                  <span>은유: {item.step4MetaphorTitle}</span>
                  <span className="text-amber-800 font-bold flex items-center gap-0.5">
                    상세보기 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MATERIALS CATALOG */}
      {activeTab === 'MATERIALS' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border-2 border-stone-800 p-4 rounded-lg space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="저자, 출전, 명언 내용, 태그(예: 앎, 도구) 검색..."
                  className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded text-xs font-serif text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs font-mono text-stone-500">
              총 {filteredMaterials.length}개의 원재료 검색됨
            </div>
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map(item => (
              <div key={item.id} className="bg-white border border-stone-300 rounded-lg p-4 space-y-3 hover:border-stone-800 transition-colors shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-stone-900 text-white px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="font-bold text-sm text-stone-900">{item.author}</span>
                    <span className="text-xs text-stone-500 font-mono">[{item.source}]</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <blockquote className="text-xs italic font-serif text-stone-800 bg-stone-50 p-2.5 rounded border-l-2 border-amber-400">
                  “{item.quote}”
                </blockquote>

                <p className="text-xs text-stone-600 font-serif leading-relaxed">
                  {item.context}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedSlotA(item);
                        setActiveTab('SYNTHESIZER');
                      }}
                      className="text-[10px] font-mono font-bold bg-stone-800 hover:bg-stone-950 text-white px-2 py-1 rounded"
                    >
                      Slot A로 선택
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSlotB(item);
                        setActiveTab('SYNTHESIZER');
                      }}
                      className="text-[10px] font-mono font-bold bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded"
                    >
                      Slot B로 선택
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Picker Modal for Slot A or B */}
      {pickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#fbfaf5] border-2 border-stone-900 rounded-lg max-w-3xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-4">
              <h3 className="font-bold text-base text-stone-900 font-mono">
                원재료 Slot {pickerTarget} 선택하기 (Q001 ~ Q160)
              </h3>
              <button
                onClick={() => setPickerTarget(null)}
                className="text-xs font-mono font-bold text-stone-500 hover:text-stone-900"
              >
                닫기 ✕
              </button>
            </div>

            {/* Filter */}
            <div className="mb-3 space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어..."
                className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMaterials.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (pickerTarget === 'A') setSelectedSlotA(item);
                    if (pickerTarget === 'B') setSelectedSlotB(item);
                    setPickerTarget(null);
                  }}
                  className="p-3 bg-white border border-stone-200 rounded hover:border-amber-600 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-stone-800 text-white px-1.5 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{item.author}</span>
                      <span className="text-[10px] text-stone-500">[{item.source}]</span>
                    </div>
                    <p className="text-xs font-serif text-stone-700 italic">“{item.quote}”</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Detail Modal */}
      {selectedTopItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 text-stone-100 border-2 border-amber-500 rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400">
                [TOP 10 상세 분석] {selectedTopItem.id}
              </span>
              <button
                onClick={() => setSelectedTopItem(null)}
                className="text-xs font-mono text-stone-400 hover:text-white"
              >
                닫기 ✕
              </button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-amber-100 font-serif">
                {selectedTopItem.syntheticAphorism}
              </h2>
              <p className="text-xs font-mono text-stone-400">
                {selectedTopItem.sourceInfo}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded border border-stone-800 flex justify-around text-xs font-mono">
              <div>총점: <strong className="text-amber-400">{selectedTopItem.scores.totalScore}점</strong></div>
              <div>대립: {selectedTopItem.scores.conflictClarity}점</div>
              <div>신선함: {selectedTopItem.scores.metaphorFreshness}점</div>
              <div>서사: {selectedTopItem.scores.narrativeRelevance}점</div>
              <div>확장: {selectedTopItem.scores.thoughtExpansion}점</div>
            </div>

            <div className="space-y-4 text-xs font-serif text-stone-300">
              <div className="bg-stone-950 p-3 rounded border-l-2 border-amber-500">
                <strong>① {selectedTopItem.step1Author}:</strong> "{selectedTopItem.step1Quote}"<br />
                <span className="text-stone-400 mt-1 block">관계: {selectedTopItem.step1Relation}</span>
                <span className="text-stone-400 block">상황: {selectedTopItem.step1Story}</span>
              </div>

              <div className="bg-stone-950 p-3 rounded border-l-2 border-amber-500">
                <strong>② {selectedTopItem.step2Author}:</strong> "{selectedTopItem.step2Quote}"<br />
                <span className="text-stone-400 mt-1 block">관계: {selectedTopItem.step2Relation}</span>
                <span className="text-stone-400 block">상황: {selectedTopItem.step2Story}</span>
              </div>

              <div className="bg-stone-950 p-3 rounded border-l-2 border-red-500">
                <strong className="text-red-400">③ 상황끼리의 충돌:</strong><br />
                <span className="mt-1 block leading-relaxed">{selectedTopItem.step3Conflict}</span>
              </div>

              <div className="bg-stone-950 p-3 rounded border-l-2 border-emerald-500">
                <strong className="text-emerald-400">④ 은유 및 전개 (‘{selectedTopItem.step4MetaphorTitle}’):</strong><br />
                <span className="mt-1 block">전개: {selectedTopItem.step4Development}</span>
                <span className="block font-bold text-emerald-200 mt-1">교훈: {selectedTopItem.step4Lesson}</span>
              </div>

              <div className="bg-stone-950 p-3 rounded border-l-2 border-blue-500">
                <strong className="text-blue-400">⑤ 사유의 확장 ({selectedTopItem.step5ExpansionTitle}):</strong><br />
                <span className="mt-1 block italic">{selectedTopItem.step5ExpansionQuestion}</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => handleCopyResult(selectedTopItem)}
                className="px-4 py-2 bg-amber-500 text-stone-950 font-mono font-bold text-xs rounded hover:bg-amber-400"
              >
                전체 마크다운 복사
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
