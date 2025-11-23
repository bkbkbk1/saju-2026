import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju-calculator';
import { interpretSaju } from '@/lib/chatgpt-interpreter';

export const runtime = 'edge';

// GET: 초기 Frame
export async function GET() {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/welcome-image" />
    <meta property="fc:frame:button:1" content="시작하기" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

// POST: Frame 인터랙션
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;

    // buttonIndex로 단계 판단 (1=시작, 2=생년월일입력완료, 3=시간선택완료, 4=성별선택완료)
    const buttonIndex = untrustedData.buttonIndex || 1;
    const inputText = untrustedData.inputText || '';
    const state = untrustedData.state ? JSON.parse(untrustedData.state) : {};

    console.log('POST received:', { buttonIndex, inputText, state });

    // Step 1: 시작 -> 생년월일 입력 화면
    if (buttonIndex === 1 && !state.birthDate) {
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/step-image?step=1" />
    <meta property="fc:frame:input:text" content="생년월일 8자리 (예: 19901225)" />
    <meta property="fc:frame:button:1" content="다음" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Step 2: 생년월일 입력 완료 -> 시간 선택
    if (inputText && inputText.length === 8 && !state.hour) {
      const newState = JSON.stringify({ birthDate: inputText });

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/step-image?step=2" />
    <meta property="fc:frame:button:1" content="자시(23-01)" />
    <meta property="fc:frame:button:2" content="오전(06-12)" />
    <meta property="fc:frame:button:3" content="오후(12-18)" />
    <meta property="fc:frame:button:4" content="저녁(18-23)" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
    <meta property="fc:frame:state" content='${newState}' />
  </head>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Step 3: 시간 선택 완료 -> 성별 선택
    if (state.birthDate && !state.gender) {
      const hourMap: Record<number, number> = { 1: 0, 2: 9, 3: 15, 4: 21 };
      const hour = hourMap[buttonIndex] || 12;
      const newState = JSON.stringify({ birthDate: state.birthDate, hour });

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/step-image?step=3" />
    <meta property="fc:frame:button:1" content="남성 👨" />
    <meta property="fc:frame:button:2" content="여성 👩" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
    <meta property="fc:frame:state" content='${newState}' />
  </head>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Step 4: 성별 선택 완료 -> 결과 계산
    if (state.birthDate && state.hour !== undefined && !state.gender) {
      const gender = buttonIndex === 1 ? '남성' : '여성';

      // 생년월일 파싱
      const birthDate = state.birthDate;
      const year = parseInt(birthDate.substring(0, 4));
      const month = parseInt(birthDate.substring(4, 6));
      const day = parseInt(birthDate.substring(6, 8));
      const hour = parseInt(state.hour);

      console.log('Calculating saju:', { year, month, day, hour, gender });

      // 사주 계산
      const pillars = calculateSaju(year, month, day, hour);

      // ChatGPT 운세 해석
      const fortune = await interpretSaju(pillars, gender);

      // 결과 이미지
      const resultImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/og?pillars=${encodeURIComponent(JSON.stringify(pillars))}&fortune=${encodeURIComponent(JSON.stringify(fortune))}`;

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${resultImageUrl}" />
    <meta property="fc:frame:button:1" content="다시 보기" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // 오류 처리
    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/step-image?step=error" />
    <meta property="fc:frame:button:1" content="다시 시작" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head>
</html>`;

    return new NextResponse(errorHtml, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('Frame error:', error);

    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/step-image?step=error" />
    <meta property="fc:frame:button:1" content="다시 시작" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head>
</html>`;

    return new NextResponse(errorHtml, { headers: { 'Content-Type': 'text/html' } });
  }
}
