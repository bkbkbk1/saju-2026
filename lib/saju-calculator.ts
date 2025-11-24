import { Solar } from 'lunar-typescript';

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
  dayMaster: string;
}

// 시주 계산을 위한 오자일주표 (일간별 자시 천간)
const hourGanTable: Record<string, string[]> = {
  '甲': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '己': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '乙': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '庚': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '丙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '辛': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '丁': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '壬': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '戊': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  '癸': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
};

function getHourPillar(dayGan: string, hour: number): string {
  const hourBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 시간을 지지로 변환 (23-1시: 子, 1-3시: 丑, ...)
  const branchIndex = Math.floor(((hour + 1) % 24) / 2);
  const hourBranch = hourBranches[branchIndex];

  // 일간에 따른 시간 천간
  const ganArray = hourGanTable[dayGan] || hourGanTable['甲'];
  const hourGan = ganArray[branchIndex];

  return hourGan + hourBranch;
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number
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

    console.log('Calculating saju for:', { year, month, day, hour });

    const solar = Solar.fromYmd(year, month, day);

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

    if (!yearPillar || !monthPillar || !dayPillar) {
      throw new Error('사주 계산 실패: 기둥 정보를 가져올 수 없습니다.');
    }

    const dayGan = dayPillar.charAt(0); // 일간 추출
    const hourPillar = getHourPillar(dayGan, hour);

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
