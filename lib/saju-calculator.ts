import { Solar } from 'lunar-typescript';

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
  dayMaster: string;
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): SajuPillars {
  try {
    // 입력값 검증
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('유효하지 않은 날짜입니다.');
    }

    if (year < 1900 || year > 2100) {
      throw new Error('년도는 1900-2100 사이여야 합니다.');
    }

    if (month < 1 || month > 12) {
      throw new Error('월은 1-12 사이여야 합니다.');
    }

    if (day < 1 || day > 31) {
      throw new Error('일은 1-31 사이여야 합니다.');
    }

    console.log('Calculating saju for:', { year, month, day, hour, minute });

    // Solar 객체를 시간까지 포함해서 생성
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);

    if (!solar) {
      throw new Error('Solar 객체 생성 실패');
    }

    const lunar = solar.getLunar();

    if (!lunar) {
      throw new Error('Lunar 객체 생성 실패');
    }

    const yearPillar = lunar.getYearInGanZhi();
    const monthPillar = lunar.getMonthInGanZhi();
    const dayPillar = lunar.getDayInGanZhi();
    const hourPillar = lunar.getTimeInGanZhi(); // 라이브러리의 시주 계산 사용

    console.log('Pillars:', { yearPillar, monthPillar, dayPillar, hourPillar });

    if (!yearPillar || !monthPillar || !dayPillar || !hourPillar) {
      throw new Error('사주 계산 실패: 기둥 정보를 가져올 수 없습니다.');
    }

    const dayGan = dayPillar.charAt(0); // 일간 추출

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      dayMaster: dayGan
    };
  } catch (error) {
    console.error('Error calculating Saju:', error);
    console.error('Input values:', { year, month, day, hour });
    throw new Error(error instanceof Error ? error.message : '사주 계산 중 오류가 발생했습니다.');
  }
}

// 천간 이름
export const ganNames: Record<string, string> = {
  '甲': '갑목',
  '乙': '을목',
  '丙': '병화',
  '丁': '정화',
  '戊': '무토',
  '己': '기토',
  '庚': '경금',
  '辛': '신금',
  '壬': '임수',
  '癸': '계수'
};
