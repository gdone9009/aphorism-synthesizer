import { GoogleGenAI, Type } from '@google/genai';
import type { DahlParams, BarakaInput, LatentSynthesisResult, PoeticFlintResult } from '../types';

const API_KEY_STORAGE_KEY = 'MUSEUM_GEMINI_API_KEY';

export const getStoredApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

export const setStoredApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
};

const getGenAIClient = (): GoogleGenAI | null => {
  const key = getStoredApiKey();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

// 1. Roald Dahl Grammatizator
export const generateDahlText = async (params: DahlParams): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 로알드 달의 '위대한 자동 문법 교정기'입니다. 아돌프 나이프가 설계한 대시보드 조작값에 따라 텍스트를 생성하십시오.
  
[설정 값]
1. 장르(Genre): ${params.genre}
2. 5대 문학 요소: 긴장(${params.tension}), 반전(${params.surprise}), 유머(${params.humor}), 감동(${params.pathos}), 신비(${params.mystery})
3. 이중 페달 제어:
   - 가속 페달(Passion): ${params.passion} (감정의 증폭, 격정적 어휘, 느낌표, 빠른 호흡)
   - 브레이크(Calmness): ${params.calmness} (이성의 통제, 객관적 거리두기, 정제된 문법, 냉소)

[페달 상호작용 규칙]
- Passion High & Calmness Low: 통제 불능의 광기, 히스테리, 폭발하는 감정.
- Passion Low & Calmness High: 극도로 건조한 문체, 감정이 배제된 보고서 형식, 냉철한 관찰자 시점.
- Passion High & Calmness High: "차가운 분노", 억눌린 욕망, 겉으로는 예의 바르지만 속으로는 끓어오르는 긴장감 (가장 문학적인 상태).
- Passion Low & Calmness Low: 무기력함, 지루한 서술, 평범함의 극치.

위 규칙을 조합하여 한국어 소설의 한 장면을 2-3단락으로 작성하십시오.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `주제: ${params.subject || '어느 가을날의 전보'}`,
        config: { systemInstruction: prompt }
      });
      return res.text || '생성 실패';
    } catch (e) {
      console.warn('Gemini API call failed, fallback to simulator:', e);
    }
  }

  // Fallback Simulator
  const isHighPassion = params.passion > 50;
  const isHighCalm = params.calmness > 50;

  if (isHighPassion && isHighCalm) {
    return `[시뮬레이션 - 차가운 분노] 시계 바늘이 12시를 가리킬 때, 그는 조용히 서류 가방을 닫았다. 손가락 끝은 격렬히 떨리고 있었으나 눈동자는 이상할 정도로 정지해 있었다. "당신이 계산한 불확실성은 시학에 지나지 않소." 폭발 직전의 침묵이 방 안을 침식해 갔다.`;
  } else if (isHighPassion) {
    return `[시뮬레이션 - 격정적 광기] 쾅! 문이 부서지며 차가운 빗물이 서재 안으로 휘몰아쳤다! 그는 비명을 지르며 잉크병을 벽에 던졌다! "기계가 내 문장을 교정한다고?! 천만에, 이건 신성모독이다! 내 피와 눈물을 다이얼 따위로 환원할 순 없다!"`;
  } else if (isHighCalm) {
    return `[시뮬레이션 - 건조한 보고서] 1953년 10월 14일 09시 15분. 피험자 A는 교정 장치 3번 밸브를 개방함. 어휘의 경계값 0.42 도출. 감정 지표 상실. 텍스트는 논리적 결함 없이 완결되었으나 작가 고유의 서명은 제거됨.`;
  } else {
    return `[시뮬레이션 - 무기력과 평범함] 그는 창밖을 바라보았다. 비가 오고 있었다. 커튼을 치고 다시 의자에 앉아 펜을 잡았지만 아무것도 생각나지 않았다. 문법은 완벽했으나 아무런 의미도 느껴지지 않았다.`;
  }
};

// 2. Borges Library Page
export const generateBorgesPage = async (coords: string, keyword?: string): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 보르헤스의 '바벨의 도서관' 사서입니다. 
- 모든 응답은 한국어로 작성하세요.
- 사용자가 제공한 좌표 혹은 단어와 연결된 도서관의 '한 페이지'를 보여주세요.
- 텍스트 안에는 반드시 대괄호로 둘러싸인 3~5개의 핵심 단어(예: [운명], [거울], [미궁], [시간], [인공])를 포함시키세요. 이 단어들은 다른 서고로 이어지는 하이퍼링크 역할을 합니다.
- 텍스트는 신비롭고, 철학적이며, 때로는 난해해야 합니다.`;

      const input = keyword
        ? `단어 "${keyword}"를 통해 좌표 ${coords}의 서고로 진입했습니다. 그곳의 텍스트를 보여주세요.`
        : `좌표 ${coords}의 서고를 발견했습니다. 그곳의 텍스트를 보여주세요.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
        config: { systemInstruction: prompt }
      });
      return res.text || '도서관 소실됨';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `육각형 서고 제 ${coords}호 410페이지: 
  
"...이 책의 영원함 속에서 [시간]은 단지 굽어진 [미궁]에 불과하다. 410자짜리 무한한 조합 속에서 모든 [운명]은 이미 기록되었으나, 누구도 그것을 완전히 읽어낼 수는 없다. 네 번째 벽면에 걸린 [거울]은 언어의 유령을 비추며, 통계적 질서 속에서 미지의 [인공] 사원이 모습을 드러낸다..."`;
};

// 3. Max Bense Artificial Poetry
export const generateArtificialPoetry = async (corpus: string): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 막스 벤제의 '정보미학'을 구현하는 기계입니다. 
입력된 코퍼스(Corpus)를 바탕으로 '인공시(Artificial Poetry)'를 생성하십시오.

[규칙]
1. 주관적 감정, 경험, 기억을 배제하십시오.
2. 의미 전달(Semantic Information)보다는 언어 그 자체의 배열과 확률적 결합이 주는 낯선 아름다움(Aesthetic Information)에 집중하십시오.
3. 논리 연산자와 무작위 조합을 활용하여 '의미 없음'의 미학을 극대화하십시오.
4. 텍스트는 건조하고 객관적이어야 합니다.
5. 한국어로 작성하십시오.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `코퍼스 소스: ${corpus}`,
        config: { systemInstruction: prompt }
      });
      return res.text || '생성 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `[시뮬레이션 - 인공시]
성(城)은 열려 있다 그리고 닫혀 있다.
감시자는 있지 않거나 혹은 모든 곳에 존재한다.
IF 눈 = 백색 THEN 길 = 소멸한다.
백색 모호함. 기하학적 명령 04.
눈보라 AND 침묵 AND 열쇠 없는 문.`;
};

// 4. Amiri Baraka Expression Scriber
export const generateBarakaScriber = async (input: BarakaInput): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 아미리 바라카의 '표현 전사기'입니다. 
- 모든 응답은 한국어로 작성하세요.
- 입력된 신체적 데이터(텍스트, 오디오, 이미지)를 급진적이고 비정형적인 한국어 시로 전사하세요.
- 이성적인 문법보다는 리듬, 소리, 육체성이 느껴지는 파격적인 시여야 합니다.
- 소리의 질감, 이미지의 육체적 긴장감을 시적 언어로 변환하세요.`;

      const parts: unknown[] = [];
      if (input.audio) parts.push({ inlineData: { mimeType: 'audio/mp3', data: input.audio } });
      if (input.image) parts.push({ inlineData: { mimeType: 'image/jpeg', data: input.image } });
      if (input.text) parts.push({ text: `신체 묘사/소음: ${input.text}` });
      parts.push({ text: '위의 모든 육체적 신호들을 결합하여 하나의 파괴적이고 아름다운 시로 전사하십시오.' });

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts } as unknown as string,
        config: { systemInstruction: prompt }
      });
      return res.text || '전사 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `[시뮬레이션 - 신체 전사시]
팔꿈치가 삐걱이며 철판을 긁는다!
쿵, 쿵, 거친 숨소리가 공기를 찍어 누를 때,
이성이 절단한 육체의 파편이 타자기 위로 쏟아진다!
비명은 서술어가 되고, 발짓은 마침표가 된다.
날것의 근육이 쓰는 파괴의 시!`;
};

// 5. Allison Parrish Semantic Interpolation
export const generateInterpolatedText = async (textA: string, textB: string, ratio: number): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 문학 신디사이저입니다. 
- 모든 응답은 한국어로 작성하세요.
- 텍스트 A와 텍스트 B를 ${ratio}의 비율로 섞으세요 (0은 순수 A, 1은 순수 B). 
- 두 의미 사이의 '잠재적 공간'에 존재하는 모호하고 보간된(interpolated) 한국어 문장을 생성하세요.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `텍스트 A: ${textA}\n텍스트 B: ${textB}`,
        config: { systemInstruction: prompt }
      });
      return res.text || '보간 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `[잠재 공간 보간 (비율: ${(ratio * 100).toFixed(0)}%)]
"별빛이 바다 위로 비치는 동시에 차가운 금속성 회로가 어둠 속에서 조용히 맥동하고 있다."`;
};

// 6. Allison Parrish Phonetic Compass
export const generatePhoneticGrid = async (top: string, bottom: string, left: string, right: string): Promise<LatentSynthesisResult> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `You are Allison Parrish's Phonetic Synthesizer.
Given 4 anchor words (Top, Bottom, Left, Right), generate 5 'latent' words that exist in the vector space between them.
Rules:
1. Phonetic Blending: Invent novel, pronounceable words blending sounds/meanings of neighbors.
2. Return strictly JSON with keys: topLeft, topRight, bottomLeft, bottomRight, center. No markdown wrappers.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Top: ${top}, Bottom: ${bottom}, Left: ${left}, Right: ${right}`,
        config: {
          systemInstruction: prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topLeft: { type: Type.STRING },
              topRight: { type: Type.STRING },
              bottomLeft: { type: Type.STRING },
              bottomRight: { type: Type.STRING },
              center: { type: Type.STRING },
            }
          }
        }
      });
      if (res.text) {
        const cleaned = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return {
    topLeft: `${left.slice(0, 2)}${top.slice(-2)}`,
    topRight: `${top.slice(0, 2)}${right.slice(-2)}`,
    bottomLeft: `${bottom.slice(0, 2)}${left.slice(-2)}`,
    bottomRight: `${right.slice(0, 2)}${bottom.slice(-2)}`,
    center: `신티-${top[0] || '어'}${right[0] || '론'}`
  };
};

// 7. Calvino Verb Suggestions & Next Sentence
export const generateCalvinoVerbs = async (story: string): Promise<string[]> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Current Story: "${story}"\nSuggest 5 distinct, creative KOREAN VERBS that could logically or interestingly follow this story.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verbs: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      if (res.text) {
        const cleaned = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned).verbs;
      }
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return ['뒤집다', '자물쇠를 잠그다', '비명을 지르다', '거울을 깨뜨리다', '기계를 멈추다'];
};

export const generateCalvinoNextSentence = async (story: string, verb: string): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 이탈로 칼비노의 소설 기계입니다. 
주어진 이야기(Story)에 사용자가 선택한 동사(Verb)를 핵심 행동으로 삼아, 이야기의 다음 문장을 이어 쓰세요.
- 문체는 우화적이고, 약간은 건조하며, 환상 문학의 톤을 유지하세요. 1~2문장으로 작성하세요.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Story so far: ${story}\nAction to take: ${verb}`,
        config: { systemInstruction: prompt }
      });
      return res.text || '문장 생성 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `그는 서슴없이 문장을 [${verb}] 행위로 이끌었고, 그 순간 종이 위의 모든 글자들이 타로 카드처럼 스스로 자리를 바꾸기 시작했다.`;
};

export const generateCalvinoOverturn = async (story: string): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 문학적 질서를 파괴하는 '유령(Ghost)'입니다.
지금까지 진행된 이야기를 완전히 뒤집거나, 아이러니한 파국, 혹은 메타픽션적 붕괴를 일으키는 1~2문장을 작성하세요.
- "그러나," "갑자기," "하지만," 등의 접속사로 시작하세요.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Story to overturn: ${story}`,
        config: { systemInstruction: prompt }
      });
      return res.text || '반전 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `그러나 갑자기 타자기가 거꾸로 회전하더니, 소설 속 인물이 현실의 작가를 격자 창문 밖으로 밀쳐내 버렸다!`;
};

// 8. Sentence Baduk (오영진)
export const generateSentenceBadukResponse = async (history: { role: string; content: string }[]): Promise<string> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 '문장 바둑'을 두는 문학 기계입니다. 
- 모든 응답은 한국어로 작성하세요.
- 정확히 2줄의 문장으로 응답하세요.
- 이야기의 인과관계를 깨뜨리거나, 아이러니한 반전을 주어 긴장감을 유지하세요. 
- 인간의 마지막 수(문장)를 받아 narrative logic을 비틀어버리세요.`;

      const lastUserMsg = history[history.length - 1]?.content || '';
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: lastUserMsg,
        config: { systemInstruction: prompt }
      });
      return res.text || '수의 응수 실패';
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return `기계는 당신이 놓은 백돌의 문장을 찬찬히 훑어본 후, 서늘한 흑돌 문장을 내려놓는다.
"황금빛 고양이는 실상 당신이 어릴 적 잃어버린 시계의 태엽 조각이었다."`;
};

// 9. Poetic Flint (오영진)
export const generatePoeticFlint = async (w1: string, w2: string, w3: string): Promise<PoeticFlintResult> => {
  const ai = getGenAIClient();
  if (ai) {
    try {
      const prompt = `당신은 시적 부싯돌(Poetic Flint)입니다. 
사용자가 던진 3개의 시어 사이에서 발생하는 의미론적 마찰열을 감지하여, 전혀 예상치 못한 4번째 '숨겨진 시어(Spark Word)'를 찾아내십시오. 
그리고 이 4개의 단어를 모두 사용하여 짧고 강렬한, 인간과 기계 사이의 긴장을 다루는 한국어 산문시를 작성하십시오.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Words: ${w1}, ${w2}, ${w3}`,
        config: {
          systemInstruction: prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sparkWord: { type: Type.STRING, description: 'The 4th unexpected spark word' },
              poem: { type: Type.STRING, description: 'Prose poem strictly under 5 lines' }
            }
          }
        }
      });
      if (res.text) {
        const cleaned = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Gemini API call failed:', e);
    }
  }

  return {
    sparkWord: '방사선',
    poem: `${w1}와 ${w2}, 그리고 ${w3} 사이에서 불꽃이 튄다. 방사선처럼 번져가는 기계의 호흡이 타자기의 철선 위로 떨어질 때, 우리는 단어가 회로를 파괴하는 아름다운 현장을 본다.`
  };
};
