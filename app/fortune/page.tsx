'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function FortunePage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction } = useSendTransaction();

  const [step, setStep] = useState<number | 'payment'>(1);
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12'); // 기본값: 12시 (오시)
  const [gender, setGender] = useState<'남성' | '여성'>('남성');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [tempResult, setTempResult] = useState<any>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (error) {
        console.error('SDK initialization error:', error);
        setIsSDKLoaded(true); // Continue anyway for browser testing
      }
    };

    initSDK();
  }, []);

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

      console.log('API response:', data);
      console.log('Response status:', response.status);

      if (!response.ok || data.error) {
        alert(`오류: ${data.error || data.details || '알 수 없는 오류'}`);
        return;
      }

      setTempResult(data);
      setStep('payment'); // 결제 단계
    } catch (error) {
      console.error('Error:', error);
      alert('운세 계산 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : ''));
    } finally {
      setLoading(false);
    }
  };

  // 미니앱 환경 감지
  const isMiniApp = typeof window !== 'undefined' && (
    window.location !== window.parent.location || // iframe 안에서 실행
    /warpcast|farcaster/i.test(navigator.userAgent) // Warpcast User Agent
  );

  console.log('=== RENDER STATE ===');
  console.log('step:', step, 'typeof:', typeof step);
  console.log('result:', result ? 'exists' : 'null');
  console.log('paid:', paid);
  console.log('tempResult:', tempResult ? 'exists' : 'null');
  console.log('isConnected:', isConnected);
  console.log('isMiniApp:', isMiniApp);
  console.log('connectors.length:', connectors.length);
  console.log('==================');

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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">출생시간 입력</h2>
            <p className="text-gray-600 mb-8">정확한 시간을 선택해주세요 (시간만)</p>

            <div className="max-w-md mx-auto mb-8">
              <label className="block text-left text-gray-700 font-medium mb-3">
                출생 시간 (0~23시)
              </label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="0">00시 (자시 23:00~01:00)</option>
                <option value="1">01시 (축시 01:00~03:00)</option>
                <option value="2">02시 (축시)</option>
                <option value="3">03시 (인시 03:00~05:00)</option>
                <option value="4">04시 (인시)</option>
                <option value="5">05시 (묘시 05:00~07:00)</option>
                <option value="6">06시 (묘시)</option>
                <option value="7">07시 (진시 07:00~09:00)</option>
                <option value="8">08시 (진시)</option>
                <option value="9">09시 (사시 09:00~11:00)</option>
                <option value="10">10시 (사시)</option>
                <option value="11">11시 (오시 11:00~13:00)</option>
                <option value="12">12시 (오시)</option>
                <option value="13">13시 (미시 13:00~15:00)</option>
                <option value="14">14시 (미시)</option>
                <option value="15">15시 (신시 15:00~17:00)</option>
                <option value="16">16시 (신시)</option>
                <option value="17">17시 (유시 17:00~19:00)</option>
                <option value="18">18시 (유시)</option>
                <option value="19">19시 (술시 19:00~21:00)</option>
                <option value="20">20시 (술시)</option>
                <option value="21">21시 (해시 21:00~23:00)</option>
                <option value="22">22시 (해시)</option>
                <option value="23">23시 (자시 23:00~01:00)</option>
              </select>
              <p className="text-sm text-gray-500 mt-3">
                ※ 모르시면 대략적인 시간대를 선택하세요
              </p>
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
                0.0001 ETH
              </div>
              <p className="text-sm text-gray-500 mt-2">약 $0.30 USD</p>
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
              <div className="space-y-4">
                <div className="text-xs bg-yellow-100 p-3 rounded mb-4">
                  <div>환경: {isMiniApp ? '✅ 미니앱' : '❌ 브라우저'}</div>
                  <div>Connectors: {connectors.length}개</div>
                  <div>연결 상태: {isConnected ? '연결됨' : '미연결'}</div>
                </div>
                <button
                  onClick={() => {
                    console.log('Connecting... connectors:', connectors);
                    if (connectors[0]) {
                      connect({ connector: connectors[0] });
                    } else {
                      alert('Warpcast 앱에서 열어주세요.');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-full hover:shadow-2xl transition-all"
                >
                  지갑 연결하기
                </button>
                {!isMiniApp && (
                  <div className="text-sm text-red-600 text-center">
                    ⚠️ 브라우저에서는 지갑 연결이 작동하지 않습니다.<br/>
                    Warpcast 앱에서 캐스트로 열어주세요.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 text-center">
                  연결된 지갑: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={() => {
                    setLoading(true);
                    sendTransaction(
                      {
                        to: '0x777BEF71B74F71a97925e6D2AF3786EC08A23923',
                        value: parseEther('0.0001'),
                      },
                      {
                        onSuccess: (hash) => {
                          console.log('Transaction hash:', hash);
                          setPaid(true);
                          setResult(tempResult);
                          setStep(4);
                          setLoading(false);
                          alert('NFT 발급 완료! 운세 결과를 확인하세요.');
                        },
                        onError: (error) => {
                          console.error('Transaction error:', error);
                          alert('트랜잭션이 취소되었거나 실패했습니다.');
                          setLoading(false);
                        }
                      }
                    );
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
