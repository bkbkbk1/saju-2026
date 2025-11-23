export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🔮 2026년 병오년 운세
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            정통 사주명리로 보는 당신의 2026년
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              생년월일시와 성별을 입력하면<br />
              ChatGPT가 2026년 병오년 운세를 해석해드립니다
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold text-gray-800">재물운</h3>
                <p className="text-gray-600 text-sm">2026년 재테크 방향성</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-semibold text-gray-800">직업운</h3>
                <p className="text-gray-600 text-sm">커리어 전환 타이밍</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💚</span>
              <div>
                <h3 className="font-semibold text-gray-800">건강운</h3>
                <p className="text-gray-600 text-sm">주의해야 할 건강 포인트</p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-3">
              지금 바로 운세를 확인하세요
            </p>
            <a
              href="/fortune"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              운세 보러 가기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
