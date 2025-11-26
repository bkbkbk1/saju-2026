import OpenAI from 'openai';
import { SajuPillars } from './saju-calculator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export interface FortuneResult {
  overall: string;
  wealth: string;
  career: string;
  health: string;
  advice: string;
}

export async function interpretSaju(
  pillars: SajuPillars,
  gender: '남성' | '여성'
): Promise<FortuneResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 30년 경력의 한국 사주명리학 전문가입니다. 정통 사주 이론을 바탕으로 2026년 병오년(丙午年, 火의 해) 운세를 해석합니다.`
        },
        {
          role: 'user',
          content: `다음 사주팔자를 2026년 병오년 기준으로 해석해주세요:

**사주팔자:**
- 년주(年柱): ${pillars.year}
- 월주(月柱): ${pillars.month}
- 일주(日柱): ${pillars.day}
- 시주(時柱): ${pillars.hour}
- 일간(日干): ${pillars.dayMaster}
- 성별: ${gender}

**출력 형식 (JSON):**
{
  "overall": "2026년 전체 운세 상세 분석 (250-300자, 오행 분석 포함)",
  "wealth": "재물운 상세 해석 (200-250자, 월별 흐름, 투자 시기, 구체적 조언)",
  "career": "직업운/사업운 상세 (200-250자, 승진/이직 타이밍, 실천 전략)",
  "health": "건강운 상세 (150-200자, 주의할 시기, 예방법)",
  "advice": "2026년 핵심 조언 (200-250자, 분기별 실천 사항)"
}

**요구사항:**
1. 2026년 병오년이 사주의 오행과 어떻게 상호작용하는지 깊이 있게 분석
2. 월별/분기별 흐름을 구체적으로 제시
3. 투자 시기, 이직 타이밍 등 실용적 조언
4. 긍정적이되 위험 요소도 명확히 경고
5. 각 항목마다 최소 150자 이상 상세하게 작성`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('ChatGPT 응답이 비어있습니다.');
    }

    console.log('ChatGPT raw response:', result);

    const parsed = JSON.parse(result) as FortuneResult;
    console.log('Parsed fortune result:', parsed);

    return parsed;
  } catch (error) {
    console.error('Error interpreting Saju:', error);
    if (error instanceof SyntaxError) {
      console.error('JSON parse error. Raw content might be truncated.');
    }
    throw new Error('운세 해석 중 오류가 발생했습니다.');
  }
}
