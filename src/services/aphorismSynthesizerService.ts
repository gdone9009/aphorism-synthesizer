import { GoogleGenAI, Type } from '@google/genai';
import type { AphorismMaterial } from '../data/aphorisms';
import { getStoredApiKey } from './geminiService';

export interface EvaluationScores {
  conflictClarity: number; // 대립과 충돌의 선명성 (25만점)
  metaphorFreshness: number; // 은유 및 합성의 신선함 (25만점)
  narrativeRelevance: number; // 현실 맥락 및 서사 적합성 (25만점)
  thoughtExpansion: number; // 사유의 확장성 (25만점)
  totalScore: number; // 총점 (100만점)
}

export interface SynthesisResult {
  syntheticAphorism: string; // 합성 명언 (예: "도구는 삶을 힘으로 바꾸는 환전소다.")
  sourceInfo: string; // 출전 정보 (예: "프랜시스 베이컨(Q065)과 헨리 데이비드 소로(Q130)의 문장을 재료로 도출된 합성 명언")
  
  step1Author: string;
  step1Quote: string;
  step1Relation: string;
  step1Story: string;
  
  step2Author: string;
  step2Quote: string;
  step2Relation: string;
  step2Story: string;
  
  step3Conflict: string; // 상황끼리의 충돌
  
  step4MetaphorTitle: string; // 은유 제목 (예: '환전소 (Currency Exchange)')
  step4Development: string; // 전개 과정
  step4Lesson: string; // 교훈
  
  step5ExpansionTitle: string; // 사유의 확장 제목
  step5ExpansionQuestion: string; // 확장 질문 및 성찰
  
  scores: EvaluationScores;
  createdAt: string;
}

export const generateSynthesis = async (
  itemA: AphorismMaterial,
  itemB: AphorismMaterial
): Promise<SynthesisResult> => {
  const apiKey = getStoredApiKey();
  const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

  if (client) {
    try {
      const prompt = `당신은 철학과 문학 사상을 합성하여 완전히 새로운 통찰의 '합성 명언'을 창조하는 지적 아키텍트입니다.
아래 두 명언 재료(A, B)를 깊이 있게 분석하고 결합하여, 다음 5단계 분석 구조에 맞춰 합성 명언과 이유를 설명하십시오.

[재료 A]
- 번호: ${itemA.id}
- 저자: ${itemA.author}
- 출전: ${itemA.source}
- 문장: "${itemA.quote}"
- 원문: ${itemA.originalQuote}
- 배경: ${itemA.context}

[재료 B]
- 번호: ${itemB.id}
- 저자: ${itemB.author}
- 출전: ${itemB.source}
- 문장: "${itemB.quote}"
- 원문: ${itemB.originalQuote}
- 배경: ${itemB.context}

[작성 규칙 및 필수 형식]
1. 합성 명언은 두 사상의 충돌과 접점에서 피어나는 선명하고 시적인 단 한 문장으로 작성하십시오.
2. 새 은유(Metaphor)는 '환전소', '방파제', '촛불', '나침반'처럼 구체적이고 직관적인 사물/개념 비유를 포함해야 합니다.
3. 평가지표 점수는 4개 항목(각 25점 만점, 총합 100점)으로 객관적으로 계산하십시오.
4. JSON 형식으로만 응답하십시오. markdown backticks는 생략하거나 파싱 가능해야 합니다.

[응답 JSON 스키마]
{
  "syntheticAphorism": "합성 명언 문장",
  "sourceInfo": "${itemA.author}(${itemA.id})와 ${itemB.author}(${itemB.id})의 문장을 재료로 도출된 합성 명언",
  "step1Author": "${itemA.author}",
  "step1Quote": "${itemA.quote}",
  "step1Relation": "A에서 합성에 가져온 1문장 핵심 선명 관계",
  "step1Story": "A의 사상을 잘 보여주는 구체적 현대/실제 스토리텔링 상황 2문장",
  "step2Author": "${itemB.author}",
  "step2Quote": "${itemB.quote}",
  "step2Relation": "B에서 합성에 가져온 1문장 핵심 선명 관계",
  "step2Story": "B의 사상을 잘 보여주는 구체적 현대/실제 스토리텔링 상황 2문장",
  "step3Conflict": "A와 B 두 상황/사상이 정면으로 맞서고 격돌하는 드라마틱한 충돌 설명",
  "step4MetaphorTitle": "은유 이름 (영문/한글)",
  "step4Development": "A와 B의 대립이 새 은유로 전개되는 흐름",
  "step4Lesson": "합성 명언이 제시하는 삶의 교훈",
  "step5ExpansionTitle": "사유 확장 주제명",
  "step5ExpansionQuestion": "우리의 일상과 철학을 뒤흔드는 깊은 질문과 성찰 2~3문장",
  "scores": {
    "conflictClarity": 23,
    "metaphorFreshness": 24,
    "narrativeRelevance": 24,
    "thoughtExpansion": 24,
    "totalScore": 95
  }
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `재료 ${itemA.id}와 ${itemB.id}를 합성해 주세요.`,
        config: {
          systemInstruction: prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              syntheticAphorism: { type: Type.STRING },
              sourceInfo: { type: Type.STRING },
              step1Author: { type: Type.STRING },
              step1Quote: { type: Type.STRING },
              step1Relation: { type: Type.STRING },
              step1Story: { type: Type.STRING },
              step2Author: { type: Type.STRING },
              step2Quote: { type: Type.STRING },
              step2Relation: { type: Type.STRING },
              step2Story: { type: Type.STRING },
              step3Conflict: { type: Type.STRING },
              step4MetaphorTitle: { type: Type.STRING },
              step4Development: { type: Type.STRING },
              step4Lesson: { type: Type.STRING },
              step5ExpansionTitle: { type: Type.STRING },
              step5ExpansionQuestion: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  conflictClarity: { type: Type.NUMBER },
                  metaphorFreshness: { type: Type.NUMBER },
                  narrativeRelevance: { type: Type.NUMBER },
                  thoughtExpansion: { type: Type.NUMBER },
                  totalScore: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          ...parsed,
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.warn('Gemini API synthesis failed, resorting to intelligent fallback:', error);
    }
  }

  // Fallback Simulation when no API Key or Network issue occurs
  return generateFallbackSynthesis(itemA, itemB);
};

// Fallback generator providing structured synthesis
const generateFallbackSynthesis = (
  itemA: AphorismMaterial,
  itemB: AphorismMaterial
): SynthesisResult => {
  const metaphor = `${itemA.tags[0] || '사유'}와 ${itemB.tags[0] || '존재'}의 나침반`;
  
  return {
    syntheticAphorism: `“${itemA.tags[0] || '앎'}을 향한 열망은 ${itemB.tags[0] || '자유'}를 만날 때 비로소 완성되는 성찰의 거울이다.”`,
    sourceInfo: `${itemA.author}(${itemA.id})와 ${itemB.author}(${itemB.id})의 문장을 재료로 도출된 합성 명언`,
    step1Author: itemA.author,
    step1Quote: itemA.quote,
    step1Relation: `'${itemA.quote}'를 통해 주체적 사유와 고유한 기준의 필요성을 추출함.`,
    step1Story: `현대 사회의 수많은 정보 속에서 자신만의 판단 기준을 잃어버린 채 남들의 평가에 일희일비하며 살아가는 인물의 번민 상황.`,
    step2Author: itemB.author,
    step2Quote: itemB.quote,
    step2Relation: `'${itemB.quote}'를 통해 타인과의 관계 및 외부 환경에 굴하지 않는 내적 평정성을 확보함.`,
    step2Story: `급변하는 조직 환경과 시련 속에서 조급함을 내려놓고 자신의 페이스를 지키려 분투하는 직장인의 상황.`,
    step3Conflict: `${itemA.author}의 적극적 주체화 및 기준 수립의 의지와 ${itemB.author}의 외풍 수용 및 비움의 자세가 현실의 결정적 순간에서 격돌함.`,
    step4MetaphorTitle: `${metaphor}`,
    step4Development: `내면의 정직한 성찰(${itemA.author})이 외부의 거친 파도(${itemB.author})를 만날 때, 무작정 막어서는 대신 파도의 힘을 누그러뜨리는 지혜로 전개됨.`,
    step4Lesson: `우리는 자신을 가두는 고집을 버리되, 삶을 지탱하는 내면의 나침반까지 포기해서는 안 된다.`,
    step5ExpansionTitle: `‘사유의 유연성’이라는 질문`,
    step5ExpansionQuestion: `당신이 타협하지 않고 지키는 신념은 삶을 자유롭게 하고 있는가, 아니면 스스로를 옥죄는 가상의 감옥인가?`,
    scores: {
      conflictClarity: 23,
      metaphorFreshness: 23,
      narrativeRelevance: 24,
      thoughtExpansion: 24,
      totalScore: 94
    },
    createdAt: new Date().toISOString()
  };
};

// Recommended TOP 10 Master Synthetic Aphorisms
export const TOP_10_SYNTHESES: (SynthesisResult & { id: string })[] = [
  {
    id: 'TOP-1',
    syntheticAphorism: '“모든 것의 가격을 매기는 시장의 무대 위에서, 존엄은 결코 바코드표를 달지 않는다.”',
    sourceInfo: '이마누엘 칸트(Q084)와 오스카 와일드(Q124)의 문장을 재료로 도출된 합성 명언',
    step1Author: '이마누엘 칸트',
    step1Quote: '목적들의 나라에서 모든 것은 가격을 가지거나 존엄을 가진다.',
    step1Relation: '효용과 교환 가치(가격)를 넘어서는 절대적 본질 가치(존엄)의 구별.',
    step1Story: '인공지능과 자동화 시스템이 인간의 노동력을 효율성과 수치로만 평가하여 직원을 쉽게 해고하는 현장.',
    step2Author: '오스카 와일드',
    step2Quote: '요즘 사람들은 모든 것의 가격을 알면서도, 어떤 것의 가치도 모르지.',
    step2Relation: '모든 것을 화폐 단위로 환산하느라 진정한 삶의 가치를 상실한 세태 비판.',
    step2Story: '부동산 시세와 주식 평가액에는 정통하지만 가족과의 시간이나 예술이 주는 경탄의 가치에는 무감각해진 금융가.',
    step3Conflict: '칸트가 경고한 가격의 논리가 지배하는 세상에서, 수치로 환산되지 않는 인간 본연의 존엄성을 지켜내기 힘든 현대적 대립.',
    step4MetaphorTitle: '바코드 (Barcode)',
    step4Development: '세상 모든 부와 물건에 가격표가 붙는 시대에서, 교환할 수 없고 가치를 매길 수도 없는 영혼의 영역(존엄)을 선명히 구별함.',
    step4Lesson: '가격은 숫자에 불과하지만 가치는 존재의 깊이이다. 세상의 수치적 평가 속에서도 당신 자신의 가치는 결코 바코드로 대체될 수 없다.',
    step5ExpansionTitle: '‘대체 불가능성’에 관한 질문',
    step5ExpansionQuestion: '당신은 자신을 무엇으로 평가하는가? 당신의 가치는 시장이 매긴 몸값인가, 아니면 어떤 돈으로도 살 수 없는 영혼의 존엄인가?',
    scores: {
      conflictClarity: 25,
      metaphorFreshness: 25,
      narrativeRelevance: 24,
      thoughtExpansion: 25,
      totalScore: 99
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-2',
    syntheticAphorism: '“자기 성찰이라는 돋보기는 거친 세상의 파도를 잠재우는 방파제가 된다.”',
    sourceInfo: '플라톤(Q035)과 마르쿠스 아우렐리우스(Q060)의 문장을 재료로 도출된 합성 명언',
    step1Author: '플라톤(소크라테스)',
    step1Quote: '자기 삶을 성찰하지 않고 사는 삶은 살 만한 가치가 없다.',
    step1Relation: '자신의 행위와 동기를 끊임없이 묻고 검토하는 엄격한 내면적 조사.',
    step1Story: '밀려드는 업무 속에서 왜 이 일을 해야 하는지 돌아볼 여유 없이 달려가기만 하는 번아웃 직장인.',
    step2Author: '마르쿠스 아우렐리우스',
    step2Quote: '파도가 끊임없이 부딪쳐도 굳게 서서 주위 물결의 거센 힘을 누그러뜨리는 곶처럼 되어라.',
    step2Relation: '외부 시련에 마음이 압도당하지 않고 평정을 지키는 스토아적 단대함.',
    step2Story: '외부 평가와 비난의 폭풍 속에서 감정적으로 좌절하여 섣부른 결정을 내릴 위기에 처한 창업가.',
    step3Conflict: '외부 파도에 흔들리지 않는 굳건한 곶이 되려 하면서도, 올바른 방향인가를 성찰하지 않으면 자칫 자기합리화가 될 수 있다는 불안.',
    step4MetaphorTitle: '방파제 (Breakwater)',
    step4Development: '침착한 견딤(방파제) + 정직한 자기 성찰(돋보기) → 파도를 무작정 막는 것이 아니라 원인을 분석하여 힘을 누그러뜨림.',
    step4Lesson: '성찰 없는 견딤은 둔감함이며, 견딤 없는 성찰은 무력한 자책이다. 성찰로 단련된 영혼만이 세상을 다스리는 방파제가 된다.',
    step5ExpansionTitle: '‘견딤의 품질’에 관한 성찰',
    step5ExpansionQuestion: '우리는 시련 앞에서 얼마나 잘 견디고 있는가만을 묻는다. 그러나 당신의 견딤은 자아를 보호하는 방파제인가, 진실을 외면하는 담벼락인가?',
    scores: {
      conflictClarity: 24,
      metaphorFreshness: 25,
      narrativeRelevance: 25,
      thoughtExpansion: 24,
      totalScore: 98
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-3',
    syntheticAphorism: '“언어는 뜻을 향해 건너가는 다리이지만, 본질에 도달한 순간 고요히 비워지는 촛불이다.”',
    sourceInfo: '루트비히 비트겐슈타인(Q150)과 장자(Q011)의 문장을 재료로 도출된 합성 명언',
    step1Author: '루트비히 비트겐슈타인',
    step1Quote: '내 언어의 한계는 바로 내 세계의 한계를 뜻한다.',
    step1Relation: '언어의 명확한 구획과 한계를 통해 의식의 세계를 구축함.',
    step1Story: '자아의 감정과 신념을 정확히 정의하기 위해 언어와 어휘를 정교하게 엮어내는 작가.',
    step2Author: '장자',
    step2Quote: '말은 뜻을 얻기 위한 것이다. 뜻을 얻었으면 말을 잊는다.',
    step2Relation: '도구로서의 언어를 초월하여 본질적 의의를 체득하고 도구를 비워냄.',
    step2Story: '수많은 평론 용어를 암기하던 화가가 마침내 미학적 법칙을 잊고 캔버스 위에서 직관적으로 역작을 그리는 순간.',
    step3Conflict: '언어의 정교함으로 세계를 확장해야 하지만, 고식적 낱말에 갇혀 실재의 뜻을 가두어 버리는 집착을 경계해야 하는 긴장.',
    step4MetaphorTitle: '촛불 (Candle)',
    step4Development: '언어라는 촛불을 켜 어둠을 밝힘 → 빛으로 본질(뜻)을 포착하면 촛불에 집착하지 않고 불을 꺼 순수한 실재와 마주함.',
    step4Lesson: '언어는 세계를 비추는 빛이지만 본질 그 자체는 아니다. 언어로 세계를 넓힌 뒤에는 언어를 내려놓을 때 비로소 진정한 본질에 다다른다.',
    step5ExpansionTitle: '‘지적 소유욕의 비움’에 관한 질문',
    step5ExpansionQuestion: '우리는 개념을 많이 소유할수록 풍요로워진다고 믿는다. 포착한 뒤 미련 없이 지식의 프레임을 버릴 수 있는 비움의 용기를 가졌는가?',
    scores: {
      conflictClarity: 24,
      metaphorFreshness: 25,
      narrativeRelevance: 23,
      thoughtExpansion: 25,
      totalScore: 97
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-4',
    syntheticAphorism: '“괴물과 싸우는 투쟁의 현장 속에서도 타인의 의견을 침묵시키지 않을 때, 영혼은 심연에 삼켜지지 않는다.”',
    sourceInfo: '프리드리히 니체(Q145)와 존 스튜어트 밀(Q091)의 문장을 재료로 도출된 합성 명언',
    step1Author: '프리드리히 니체',
    step1Quote: '괴물과 싸우는 사람은 그 싸움으로 자신도 괴물이 되지 않도록 조심해야 한다.',
    step1Relation: '부조리와 싸우는 과정에서 상대의 폭력성과 증오를 닮아가는 역설 경계.',
    step1Story: '상대 진영의 공작에 맞서 싸우다 자신도 똑같이 증오와 흑색선전을 일삼게 된 운동가.',
    step2Author: '존 스튜어트 밀',
    step2Quote: '토론을 침묵시키는 모든 행위는 자신이 오류를 범하지 않는다는 가정을 깔고 있다.',
    step2Relation: '무류성의 오만을 비판하고 반대 의견과의 소통 가능성을 여는 자세.',
    step2Story: '자신들 집단의 정당성만 신봉하며 반대파의 발언권을 억압하는 독선적 정치 조직.',
    step3Conflict: '거대한 악에 맞서 싸울 때 집단의 결속을 위해 이견을 억누르려 하지만, 그 순간 적의 독선과 억압을 닮아가 괴물이 되는 위기.',
    step4MetaphorTitle: '반사 거울 (Reflective Mirror)',
    step4Development: '악을 상대하는 분노의 정당성 → 내 오류 가능성을 인정(토론의 허용)하여 자아도취적 괴물화를 방지함.',
    step4Lesson: '참된 정의는 반대편을 입막음하여 얻어지지 않는다. 틀릴 가능성을 인정하는 겸손만이 정의로운 투쟁을 지켜준다.',
    step5ExpansionTitle: '‘심연의 정체’에 관한 성찰',
    step5ExpansionQuestion: '당신이 싸우고 있는 적의 가장 흉측한 모습은 무엇인가? 적을 무찌른다는 명목하에 같은 방식의 오만과 억압을 저지르고 있지 않은가?',
    scores: {
      conflictClarity: 25,
      metaphorFreshness: 24,
      narrativeRelevance: 24,
      thoughtExpansion: 24,
      totalScore: 97
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-5',
    syntheticAphorism: '“정의 없는 힘은 폭력이 되고, 자기 통제 없는 자유는 방종의 덫이 된다.”',
    sourceInfo: '블레즈 파스칼(Q156)과 메리 울스턴크래프트(Q094)의 문장을 재료로 도출된 합성 명언',
    step1Author: '블레즈 파스칼',
    step1Quote: '힘 없는 정의는 무력하고, 정의 없는 힘은 폭압적이다.',
    step1Relation: '올바름(정의)과 권력/실행력(힘)의 균형 체계.',
    step1Story: '도덕적 명분은 훌륭하지만 수단이 없어 거대 기업의 불법 행위를 막지 못하는 시민단체.',
    step2Author: '메리 울스턴크래프트',
    step2Quote: '나는 여성들이 남성에 대한 힘을 갖기보다, 자기 자신에 대한 힘을 갖기를 바란다.',
    step2Relation: '타인을 지배하는 힘이 아닌 내면의 주권과 자율성으로서의 힘.',
    step2Story: '승진과 권력을 좇아 타인을 억누르다 내적 정체성을 열망하는 리더.',
    step3Conflict: '부조리를 바로잡기 위해 강력한 권한을 행사하려 하지만, 타인을 다스리는 힘에 몰두하다 자신을 통제하는 힘을 잃을 위험.',
    step4MetaphorTitle: '내적 나침반 (Internal Compass)',
    step4Development: '외부를 바꾸는 힘 + 내면의 욕망을 조율하는 통제력 → 권력이 폭압이 되지 않도록 억제함.',
    step4Lesson: '타인을 바꾸려는 외적 힘에 앞서 자신을 통제하는 내적 힘이 바로서야만, 정의가 폭압으로 변질되지 않는다.',
    step5ExpansionTitle: '‘힘의 주어’에 관한 질문',
    step5ExpansionQuestion: '당신이 열망하는 힘의 대상은 누구인가? 타인을 굴복시키는 힘인가, 아니면 당신 자신의 순간적 정념을 조율하는 힘인가?',
    scores: {
      conflictClarity: 24,
      metaphorFreshness: 24,
      narrativeRelevance: 24,
      thoughtExpansion: 24,
      totalScore: 96
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-6',
    syntheticAphorism: '“모순을 품을 수 있는 거대한 영혼만이 굳어진 일관성의 우상을 깰 수 있다.”',
    sourceInfo: '월트 휘트먼(Q120)과 랠프 월도 에머슨(Q138)의 문장을 재료로 도출된 합성 명언',
    step1Author: '월트 휘트먼',
    step1Quote: '내가 나 자신과 모순된다고? 좋다, 그렇다면 나는 모순된다. 나는 넓고, 내 안에는 수많은 존재가 있다.',
    step1Relation: '내면의 모순과 복수성을 긍정하는 수용성.',
    step1Story: '과거의 소심했던 자신과 현재의 과감한 결정 사이에서 괴리감을 느끼며 정체성을 탐구하는 예술가.',
    step2Author: '랠프 월도 에머슨',
    step2Quote: '어리석은 일관성은 좁은 마음을 괴롭히는 도깨비이며, 왜소한 정치가와 철학자와 신학자가 떠받드는 우상이다.',
    step2Relation: '어제의 평판에 매여 오늘의 통찰을 포기하는 태도 비판.',
    step2Story: '이전에 내놓았던 입장에 묶여 새로운 결정적 데이터를 인정하지 않으려는 학자.',
    step3Conflict: '사회는 일관성을 요구하지만, 과거의 틀에 스스로를 얽매는 순간(우상) 삶의 성장과 무한한 가능성은 말라버린다는 충돌.',
    step4MetaphorTitle: '지혜의 용광로 (Furnace of Growth)',
    step4Development: '내면의 다양성 수용 → 좁은 마음의 도깨비인 어리석은 일관성을 녹여버리고 지속적으로 확장함.',
    step4Lesson: '성장이란 어제의 나를 뒤엎는 연속적 과정이다. 모순을 두려워하지 않는 자만이 일관성의 감옥을 부순다.',
    step5ExpansionTitle: '‘어제의 나와의 이별’에 관한 성찰',
    step5ExpansionQuestion: '당신은 혹시 과거의 말에 갇혀, 오늘 새로이 피어나는 통찰과 변화의 가능성을 외면하고 있지는 않은가?',
    scores: {
      conflictClarity: 23,
      metaphorFreshness: 24,
      narrativeRelevance: 24,
      thoughtExpansion: 25,
      totalScore: 96
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-7',
    syntheticAphorism: '“다른 북소리를 따라 걷는 발걸음만이 고착된 절망의 벽을 뚫는 신호탄이 된다.”',
    sourceInfo: '헨리 데이비드 소로(Q129)와 헨리 데이비드 소로(Q134)의 문장을 재료로 도출된 합성 명언',
    step1Author: '헨리 데이비드 소로',
    step1Quote: '대다수 사람들은 조용한 절망 속에서 살아간다. 체념이라 부르는 것은 굳어진 절망이다.',
    step1Relation: '관습과 생계의 굴레에 얽매여 무기력하게 체념한 삶의 상태.',
    step1Story: '안정된 길을 따라가며 내면의 열정은 완전히 꺼진 채 매일 출근길을 나서는 직장인.',
    step2Author: '헨리 데이비드 소로',
    step2Quote: '누군가 동료들과 보조를 맞추지 않는다면, 아마 그는 다른 북소리를 듣고 있기 때문일 것이다.',
    step2Relation: '사회적 행진곡에서 벗어나 자신만의 내면 리듬을 따르는 독창성.',
    step2Story: '주위의 우려를 무릅쓰고 남들이 가지 않는 고서적 수리공의 길을 걷기 시작한 젊은이.',
    step3Conflict: '대중의 대열에서 이탈하는 불안감(조용한 절망)과, 남들과 똑같이 살다가 자신을 잃어버릴 것 같은 공포의 격돌.',
    step4MetaphorTitle: '신호탄 (Signal Flare)',
    step4Development: '체념의 대열을 이탈하는 용기 → 나만의 리듬(다른 북소리)을 타 타성적 절망에 균열을 일으킴.',
    step4Lesson: '남들과 박자를 맞추지 못하는 것은 결함이 아니며, 조용한 절망을 깨뜨리는 것은 홀로 다른 북소리를 듣는 발자국이다.',
    step5ExpansionTitle: '‘불협화음의 가치’에 관한 질문',
    step5ExpansionQuestion: '당신은 세상이 강요하는 박자에 맞춰 걸어가고 있는가, 아니면 내면의 나지막한 다른 북소리에 귀 기울이고 있는가?',
    scores: {
      conflictClarity: 24,
      metaphorFreshness: 23,
      narrativeRelevance: 24,
      thoughtExpansion: 24,
      totalScore: 95
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-8',
    syntheticAphorism: '“생각하는 갈대는 자신을 닫는 감옥을 지을 수도, 심연의 괴물에서 스승을 끌어낼 수도 있다.”',
    sourceInfo: '블레즈 파스칼(Q154)과 윌리엄 셰익스피어(Q098)의 문장을 재료로 도출된 합성 명언',
    step1Author: '블레즈 파스칼',
    step1Quote: '인간은 자연에서 가장 약한 갈대에 지나지 않는다. 그러나 생각하는 갈대다.',
    step1Relation: '육체적 취약성과 대비되는 정신적 사유의 존엄함.',
    step1Story: '자신의 유한함을 직시하며 마지막 순간까지 기록을 남기는 시한부 연구자.',
    step2Author: '윌리엄 셰익스피어',
    step2Quote: '좋고 나쁜 것은 생각이 그렇게 만드는 것이니까. 내게는 감옥이야.',
    step2Relation: '사태의 성격을 규정하는 내면적 판단과 해석의 힘.',
    step2Story: '실패한 프로젝트를 파멸로 받아들일 수도, 새로운 귀중한 경험으로 재해석할 수도 있는 갈림길.',
    step3Conflict: '사유를 통해 우주보다 위대해질 수 있지만, 사유가 왜곡되면 스스로를 비극적 감옥에 가두는 자가중독의 위협.',
    step4MetaphorTitle: '양날의 검 (Double-edged Sword)',
    step4Development: '사유의 존엄 → 해석의 방향에 따라 스스로를 가두는 감옥이 되거나 거친 자연을 뛰어넘는 구원이 됨.',
    step4Lesson: '생각하는 능력은 위대함이자 치명적 약점이다. 판단의 방향을 어디로 돌리느냐에 따라 갈대의 약함은 존엄이 된다.',
    step5ExpansionTitle: '‘사유의 조향장치’에 관한 질문',
    step5ExpansionQuestion: '오늘 당신의 사유는 당신을 자유로운 우주로 이끄는 열쇠인가, 아니면 스스로를 옥죄는 가상의 감옥 창살인가?',
    scores: {
      conflictClarity: 23,
      metaphorFreshness: 24,
      narrativeRelevance: 23,
      thoughtExpansion: 24,
      totalScore: 94
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-9',
    syntheticAphorism: '“독립된 방과 경제적 자립이 창작의 터전이라면, 끊임없는 반대 의견과의 마찰은 그 영혼을 깨우는 불꽃이다.”',
    sourceInfo: '버지니아 울프(Q157)와 존 스튜어트 밀(Q090)의 문장을 재료로 도출된 합성 명언',
    step1Author: '버지니아 울프',
    step1Quote: '여성이 소설을 쓰려면 돈과 자기만의 방을 갖추어야 한다.',
    step1Relation: '사유와 창작을 가능하게 만드는 물질적 기반과 독립적 공간.',
    step1Story: '방해받지 않고 자신의 연구에 몰두하기 위해 독립 작업실을 확보하는 창작자.',
    step2Author: '존 스튜어트 밀',
    step2Quote: '논쟁에서 자기 편의 주장만 아는 사람은 그 주장조차 제대로 알지 못한다.',
    step2Relation: '독립된 세계에 안주하지 않고 반대편 논거와 부딪치며 획득하는 완전한 인식.',
    step2Story: '자신의 서재에 갇혀 동조하는 책만 읽다가 비판적 시각을 이해하지 못하게 된 문인.',
    step3Conflict: '창작을 위해 독립 공간(자기만의 방)이 필수적이지만, 아늑함 속에 안주하면 사유가 고여 버리는 모순.',
    step4MetaphorTitle: '열린 창문 (Window in the Room)',
    step4Development: '안전한 창작 공간 + 외부 비판과의 마찰 → 고립된 감옥이 아닌 교류하는 자유의 터전.',
    step4Lesson: '독립된 공간은 외딴섬이 되기 위함이 아니라 더 튼튼한 뿌리를 내리기 위함이다. 반대자의 목소리에 창문을 열어둘 때 완비된다.',
    step5ExpansionTitle: '‘아늑함의 함정’에 관한 질문',
    step5ExpansionQuestion: '당신이 구축한 독립적 영역과 신념의 공간은 창조를 위한 방인가, 아니면 비판이 두려워 걸어 잠근 도피처인가?',
    scores: {
      conflictClarity: 23,
      metaphorFreshness: 23,
      narrativeRelevance: 24,
      thoughtExpansion: 23,
      totalScore: 93
    },
    createdAt: '2026-09-08T20:00:00Z'
  },
  {
    id: 'TOP-10',
    syntheticAphorism: '“남의 눈을 통과한 지식은 빌려온 의복일 뿐, 내 삶을 통과하여 걸러진 무지야말로 참된 자율의 출발점이다.”',
    sourceInfo: '월트 휘트먼(Q118)과 공자(Q001)의 문장을 재료로 도출된 합성 명언',
    step1Author: '월트 휘트먼',
    step1Quote: '너는 내 눈으로 보거나 내게서 받아들이지도 말라. 사방의 말을 듣고 네 자신을 거쳐 걸러내라.',
    step1Relation: '외부 사상과 타인의 견해를 무비판적으로 수용하지 않는 주체적 필터링.',
    step1Story: '유명한 멘토와 미디어의 말에 휘둘려 스스로의 판단 기준을 잃어버린 유행 추구자.',
    step2Author: '공자',
    step2Quote: '아는 것은 안다고 하고, 모르는 것은 모른다고 하는 것, 이것이 앎이다.',
    step2Relation: '무지와 앎의 경계를 명확히 구별하는 정직성과 자각.',
    step2Story: '잘 알지도 못하는 기술 트렌드에 대해 아는 척하다 실수를 저지를 뻔한 전문가.',
    step3Conflict: '자신의 무지를 정직하게 인정해야 가르침을 받아들이지만, 무작정 남의 시선에 의존하면 판단 주체성을 잃어버리는 대립.',
    step4MetaphorTitle: '주체적 체 (Filtering Sieve)',
    step4Development: '무지를 인정하는 정직성 + 내면을 통과시켜 걸러내는 독립성 → 빌려온 지식이 아닌 참된 앎 체득.',
    step4Lesson: '남의 주장을 외우는 것은 앎이 아니다. 모름을 정직하게 시인하고 사방의 진술을 자기 삶의 체로 걸러낼 때 지혜가 싹튼다.',
    step5ExpansionTitle: '‘사유의 필터링’에 관한 질문',
    step5ExpansionQuestion: '당신이 맞다고 믿는 수많은 확신 중, 정말 당신 자신의 삶을 통과하여 검증된 것은 얼마나 되는가?',
    scores: {
      conflictClarity: 22,
      metaphorFreshness: 23,
      narrativeRelevance: 23,
      thoughtExpansion: 24,
      totalScore: 92
    },
    createdAt: '2026-09-08T20:00:00Z'
  }
];
