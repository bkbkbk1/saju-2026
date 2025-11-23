import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju-calculator';
import { interpretSaju } from '@/lib/chatgpt-interpreter';

// Frame 메타데이터 HTML 생성
function getFrameHtml(imageUrl: string, buttons: any[], postUrl?: string, inputText?: string) {
  const buttonTags = buttons
    .map((btn, idx) => `<meta property="fc:frame:button:${idx + 1}" content="${btn.label}" />`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    ${inputText ? `<meta property="fc:frame:input:text" content="${inputText}" />` : ''}
    ${buttonTags}
    <meta property="fc:frame:post_url" content="${postUrl || process.env.NEXT_PUBLIC_URL + '/api/frame'}" />
  </head>
  <body>2026년 운세 보기</body>
</html>`;
}

// GET: 초기 Frame 메타데이터
export async function GET() {
  const imageUrl = `${process.env.NEXT_PUBLIC_URL}/api/welcome-image`;
  const initialState = JSON.stringify({ step: 1 });

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:button:1" content="운세 보기 시작" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
    <meta property="fc:frame:state" content="${initialState}" />
  </head>
  <body>2026년 운세 보기</body>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

// POST: Frame 인터랙션 처리
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;

    // state로 현재 단계 추적 (기본값: 1)
    const currentState = untrustedData.state ? JSON.parse(untrustedData.state) : { step: 1 };
    const step = currentState.step || 1;

    // Step 1: 생년월일 입력
    if (step === 1) {
      const imageUrl = `${process.env.NEXT_PUBLIC_URL}/api/step-image?step=1`;
      const newState = JSON.stringify({ step: 2 });

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:input:text" content="생년월일 8자리 (예: 19901225)" />
    <meta property="fc:frame:button:1" content="다음" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
    <meta property="fc:frame:state" content="${newState}" />
  </head>
  <body>생년월일 입력</body>
</html>`;

      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Step 2: 출생시간 선택
    if (step === 2) {
      const birthDate = untrustedData.inputText || currentState.birthDate;

      if (!birthDate || birthDate.length !== 8) {
        const errorImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/step-image?step=error`;
        return new NextResponse(
          getFrameHtml(errorImageUrl, [{ label: '다시 시도' }]),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_URL}/api/step-image?step=2`;
      const newState = JSON.stringify({ step: 3, birthDate });

      // 시간대 버튼 (0-23시를 4개 그룹으로)
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:button:1" content="자시(23-01시)" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?hour=0" />
    <meta property="fc:frame:button:2" content="오전(06-12시)" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?hour=9" />
    <meta property="fc:frame:button:3" content="오후(12-18시)" />
    <meta property="fc:frame:button:3:action" content="post" />
    <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?hour=15" />
    <meta property="fc:frame:button:4" content="저녁(18-23시)" />
    <meta property="fc:frame:button:4:action" content="post" />
    <meta property="fc:frame:button:4:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?hour=21" />
    <meta property="fc:frame:state" content="${newState}" />
  </head>
  <body>출생시간 선택</body>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Step 3: 성별 선택
    if (step === 3) {
      const { searchParams } = new URL(req.url);
      const hour = searchParams.get('hour') || '12';
      const birthDate = currentState.birthDate;

      const imageUrl = `${process.env.NEXT_PUBLIC_URL}/api/step-image?step=3`;
      const newState = JSON.stringify({ step: 4, birthDate, hour });

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:button:1" content="남성 👨" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?gender=male" />
    <meta property="fc:frame:button:2" content="여성 👩" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame?gender=female" />
    <meta property="fc:frame:state" content="${newState}" />
  </head>
  <body>성별 선택</body>
</html>`;

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Step 4: 결과 계산 및 표시
    if (step === 4) {
      const { searchParams } = new URL(req.url);
      const genderParam = searchParams.get('gender');
      const gender = genderParam === 'male' ? '남성' : '여성';
      const birthDate = currentState.birthDate;
      const hour = parseInt(currentState.hour || '12');

      // 생년월일 파싱
      const year = parseInt(birthDate.substring(0, 4));
      const month = parseInt(birthDate.substring(4, 6));
      const day = parseInt(birthDate.substring(6, 8));

      // 사주 계산
      const pillars = calculateSaju(year, month, day, hour);

      // ChatGPT로 운세 해석
      const fortune = await interpretSaju(pillars, gender);

      // TODO: Satori로 이미지 생성 (임시로 텍스트 URL 사용)
      const resultImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/og?pillars=${encodeURIComponent(JSON.stringify(pillars))}&fortune=${encodeURIComponent(JSON.stringify(fortune))}`;

      const html = getFrameHtml(
        resultImageUrl,
        [{ label: '다시 보기' }],
        `${process.env.NEXT_PUBLIC_URL}/api/frame`
      );

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // 기본 응답
    return new NextResponse('Invalid step', { status: 400 });
  } catch (error) {
    console.error('Frame error:', error);
    const errorImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/step-image?step=error`;
    return new NextResponse(
      getFrameHtml(errorImageUrl, [{ label: '다시 시도' }]),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
