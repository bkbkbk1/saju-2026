import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju-calculator';
import { interpretSaju } from '@/lib/chatgpt-interpreter';

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthHour, gender } = await req.json();

    // 유효성 검사
    if (!birthDate || birthDate.length !== 8) {
      return NextResponse.json(
        { error: '생년월일을 8자리로 입력해주세요' },
        { status: 400 }
      );
    }

    // 생년월일 파싱
    const year = parseInt(birthDate.substring(0, 4));
    const month = parseInt(birthDate.substring(4, 6));
    const day = parseInt(birthDate.substring(6, 8));
    const hour = parseInt(birthHour);

    // 사주 계산
    const pillars = calculateSaju(year, month, day, hour);

    // ChatGPT 운세 해석
    const fortune = await interpretSaju(pillars, gender);

    return NextResponse.json({
      pillars,
      fortune
    });
  } catch (error) {
    console.error('Fortune calculation error:', error);
    return NextResponse.json(
      { error: '운세 계산 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
