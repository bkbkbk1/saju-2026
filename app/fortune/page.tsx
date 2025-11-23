'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function FortunePage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransactionAsync } = useSendTransaction();

  const [step, setStep] = useState<number | 'payment'>(1);
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [gender, setGender] = useState<'남성' | '여성'>('남성');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [tempResult, setTempResult] = useState<any>(null);

  const handleCalculate = async () => {
    if (!birthDate || birthDate.length !== 8) {
      alert('생년월일을 8자리로 입력해주세요 (예: 19901225)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/calculate-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthHour: parseInt(birthHour),
          gender
        })
      });

      const data = await response.json();
      setTempResult(data);
      setStep('payment'); // 결제 단계
    } catch (error) {
      console.error('Error:', error);
      alert('운세 계산 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Current step:', step, 'Type:', typeof step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Step 1: 생년월일 입력 */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🔮 2026년 운세</h1>
            <p className="text-xl text-gray-600 mb-8">생년월일을 입력하세요</p>

            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="예: 19901225"
              className="w-full max-w-md px-6 py-4 text-xl text-center border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-600 mb-6"
              maxLength={8}
            />

            <p className="text-sm text-gray-500 mb-8">YYYYMMDD 형식 (8자리)</p>

            <button
              onClick={() => setStep(2)}
              disabled={birthDate.length !== 8}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-12 py-4 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2: 출생시간 선택 */}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">출생시간 선택</h2>
            <p className="text-gray-600 mb-8">대략적인 시간대를 선택하세요</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setBirthHour('0')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  birthHour === '0'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-xl font-semibold">자시</div>
                <div className="text-sm text-gray-600">23:00 - 01:00</div>
              </button>

              <button
                onClick={() => setBirthHour('9')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  birthHour === '9'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-xl font-semibold">오전</div>
                <div className="text-sm text-gray-600">06:00 - 12:00</div>
              </button>

              <button
                onClick={() => setBirthHour('15')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  birthHour === '15'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-xl font-semibold">오후</div>
                <div className="text-sm text-gray-600">12:00 - 18:00</div>
              </button>

              <button
                onClick={() => setBirthHour('21')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  birthHour === '21'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-xl font-semibold">저녁</div>
                <div className="text-sm text-gray-600">18:00 - 23:00</div>
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 border-2 border-gray-300 rounded-full hover:border-purple-400 transition-all"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-12 py-3 rounded-full hover:shadow-lg transition-all"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 성별 선택 */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">성별 선택</h2>
            <p className="text-gray-600 mb-8">대운 계산을 위해 필요합니다</p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <button
                onClick={() => setGender('남성')}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  gender === '남성'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-5xl mb-2">👨</div>
                <div className="text-xl font-semibold">남성</div>
              </button>

              <button
                onClick={() => setGender('여성')}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  gender === '여성'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-5xl mb-2">👩</div>
                <div className="text-xl font-semibold">여성</div>
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 border-2 border-gray-300 rounded-full hover:border-purple-400 transition-all"
              >
                이전
              </button>
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-12 py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? '계산 중...' : '다음'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3.5: NFT 민팅/결제 */}
        {step === 'payment' && tempResult && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎁 운세 NFT 발급</h2>
            <p className="text-gray-600 mb-8">
              당신의 2026년 운세를 NFT로 소장하세요
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8 mb-8">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                2026년 병오년 운세 NFT
              </h3>
              <p className="text-gray-600 mb-6">
                사주팔자와 ChatGPT 상세 해석 포함
              </p>
              <div className="text-4xl font-bold text-purple-700">
                0.001 ETH
              </div>
              <p className="text-sm text-gray-500 mt-2">약 $3 USD</p>
            </div>

            <div className="space-y-3 text-left bg-white border-2 border-purple-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">사주팔자 (년/월/일/시)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">2026년 상세 운세 해석</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">재물/직업/건강운 분석</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">NFT 영구 소장 가능</span>
              </div>
            </div>

            {!isConnected ? (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-full hover:shadow-2xl transition-all"
              >
                지갑 연결하기
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 text-center">
                  연결된 지갑: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      // 0.001 ETH를 개발자 주소로 전송
                      const hash = await sendTransactionAsync({
                        to: '0x777BEF71B74F71a97925e6D2AF3786EC08A23923', // 개발자 주소
                        value: parseEther('0.001'),
                      });

                      console.log('Transaction hash:', hash);

                      // 트랜잭션 완료 후 결과 표시
                      setPaid(true);
                      setResult(tempResult);
                      setStep(4);
                      alert('NFT 발급 완료! 운세 결과를 확인하세요.');
                    } catch (error) {
                      console.error('Transaction error:', error);
                      alert('트랜잭션이 취소되었거나 실패했습니다.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-full hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {loading ? '트랜잭션 진행 중...' : 'NFT 발급하고 운세 보기 →'}
                </button>
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              className="mt-4 text-gray-500 hover:text-gray-700 transition-all"
            >
              ← 이전으로
            </button>
          </div>
        )}

        {/* Step 4: 결과 */}
        {step === 4 && result && paid && (
          <div>
            {/* DEBUG */}
            {console.log('Step:', step, 'Result:', !!result, 'Paid:', paid)}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🔮 2026년 병오년 운세</h2>

            {/* 사주팔자 */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">사주팔자</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">년주</div>
                  <div className="text-2xl font-bold text-purple-700">{result.pillars.year}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">월주</div>
                  <div className="text-2xl font-bold text-purple-700">{result.pillars.month}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">일주</div>
                  <div className="text-2xl font-bold text-purple-700">{result.pillars.day}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">시주</div>
                  <div className="text-2xl font-bold text-purple-700">{result.pillars.hour}</div>
                </div>
              </div>
            </div>

            {/* 운세 */}
            <div className="space-y-4 mb-8">
              <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <h4 className="text-lg font-semibold text-gray-800">전체운</h4>
                </div>
                <p className="text-gray-700">{result.fortune.overall}</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💰</span>
                  <h4 className="text-lg font-semibold text-gray-800">재물운</h4>
                </div>
                <p className="text-gray-700">{result.fortune.wealth}</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <h4 className="text-lg font-semibold text-gray-800">직업운</h4>
                </div>
                <p className="text-gray-700">{result.fortune.career}</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💚</span>
                  <h4 className="text-lg font-semibold text-gray-800">건강운</h4>
                </div>
                <p className="text-gray-700">{result.fortune.health}</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <h4 className="text-lg font-semibold text-gray-800">조언</h4>
                </div>
                <p className="text-gray-700 font-medium">{result.fortune.advice}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setBirthDate('');
                setResult(null);
                setPaid(false);
                setTempResult(null);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-full hover:shadow-lg transition-all"
            >
              다시 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
