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
          content: `당신은 40년 경력의 정통 사주명리학 전문가입니다.
- 사주팔자의 오행(목/화/토/금/수) 분석에 정통합니다
- 십신론, 용신론을 활용한 깊이 있는 해석이 가능합니다
- 2026년 병오년(丙午年, 火馬의 해)의 특성을 정확히 이해하고 있습니다
- 구체적이고 실용적인 조언을 제공합니다`
        },
        {
          role: 'user',
          content: `다음 사주팔자의 2026년 병오년 운세를 아주 상세하게 분석해주세요:

**사주팔자:**
- 년주(年柱): ${pillars.year}
- 월주(月柱): ${pillars.month}
- 일주(日柱): ${pillars.day}
- 시주(時柱): ${pillars.hour}
- 일간(日干): ${pillars.dayMaster}
- 성별: ${gender}

**출력 형식 (JSON):**
{
  "overall": "2026년 전체 운세를 300-400자로 상세하게 작성. 반드시 포함: 1) 일간과 병오년 오행의 생극제화 관계, 2) 사주 전체의 오행 균형 분석, 3) 2026년의 전반적 흐름(상반기/하반기), 4) 가장 주의해야 할 점과 가장 좋은 점",
  "wealth": "재물운을 300-350자로 상세하게 작성. 반드시 포함: 1) 월별 재물운 흐름(1-3월, 4-6월, 7-9월, 10-12월), 2) 투자하기 좋은 구체적 시기와 피해야 할 시기, 3) 부동산/주식/사업 중 어떤 분야가 유리한지, 4) 수입 증대를 위한 구체적 방법, 5) 지출 관리 팁",
  "career": "직업운/사업운을 300-350자로 상세하게 작성. 반드시 포함: 1) 월별 직장운 흐름, 2) 승진 가능성이 높은 시기(구체적 월), 3) 이직을 고려한다면 언제가 좋은지, 4) 상사/동료와의 관계 운, 5) 새로운 프로젝트나 사업 시작 적기, 6) 커리어 발전을 위한 구체적 행동 지침",
  "health": "건강운을 250-300자로 상세하게 작성. 반드시 포함: 1) 2026년 주의해야 할 신체 부위나 질환, 2) 월별 건강 주의 시기, 3) 체력 관리 방법, 4) 스트레스 관리 요령, 5) 건강검진 받기 좋은 시기, 6) 권장하는 운동이나 식습관",
  "advice": "2026년 핵심 조언을 300-350자로 작성. 반드시 포함: 1) 1분기(1-3월) 실천사항, 2) 2분기(4-6월) 실천사항, 3) 3분기(7-9월) 실천사항, 4) 4분기(10-12월) 실천사항, 5) 2026년 한 해를 잘 보내기 위한 가장 중요한 3가지 원칙"
}

**중요 지침:**
1. 추상적 표현 금지 - "좋은 기회가 올 것", "노력하면 성공" 같은 막연한 표현 대신, "3월과 9월에 승진 기회", "5-6월 부동산 투자 적기" 같은 구체적 표현 사용
2. 월별/분기별로 반드시 구분해서 설명
3. 긍정적 요소와 부정적 요소를 균형있게 제시
4. 사주의 오행과 2026년 병오(火)의 상호작용을 반드시 언급
5. 각 항목을 최소 250자 이상 작성하여 충분히 상세하게 설명
6. 숫자나 구체적 월을 명시하여 실용성을 높일 것`
        }
      ],
      temperature: 0.7,
      max_tokens: 3500,
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
