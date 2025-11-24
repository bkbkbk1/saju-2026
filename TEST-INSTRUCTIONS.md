# 🧪 Farcaster 미니앱 테스트 방법

## ⚠️ 중요: 브라우저에서는 지갑 연결이 작동하지 않습니다!

Farcaster 미니앱은 **Warpcast 앱 내에서만** 지갑 연결이 가능합니다.

## 올바른 테스트 방법

### 1️⃣ Warpcast 앱 설치
- iOS: App Store에서 "Warpcast" 검색
- Android: Google Play에서 "Warpcast" 검색

### 2️⃣ 캐스트 작성
1. Warpcast 앱 열기
2. 새 캐스트(게시물) 작성
3. 링크 입력: `https://saju-2026.vercel.app/fortune`
4. 캐스트 발행

### 3️⃣ 미니앱 실행
1. 발행한 캐스트 열기
2. 링크 카드 탭
3. 미니앱이 앱 내에서 열림
4. **이때 지갑 연결 가능!**

## 테스트 플로우

```
생년월일 입력 (예: 19901225)
  ↓
출생시간 선택 (자시/오전/오후/저녁)
  ↓
성별 선택 (남성/여성)
  ↓
🎁 NFT 발급 화면
  ↓
지갑 연결하기 버튼 ← Warpcast 앱에서만 작동!
  ↓
0.001 ETH 결제
  ↓
운세 결과 표시
```

## ❌ 작동 안 하는 환경
- Chrome 브라우저
- Safari 브라우저
- 일반 웹 환경
- 시크릿/프라이빗 모드

## ✅ 작동하는 환경
- Warpcast 모바일 앱 (iOS/Android)
- Base 앱
- 기타 Farcaster 클라이언트

## 디버깅

브라우저 콘솔에서:
- `connectors: Array(8)` - 8개 connector 존재
- `isConnected: false` - 연결 안 됨 (정상)
- Warpcast 앱에서는 자동으로 `isConnected: true`가 되어야 함

## API 에러 해결

만약 500 에러가 계속되면:
1. Vercel 대시보드 접속
2. saju-2026 프로젝트 → Logs 탭
3. 에러 메시지 확인
4. OpenAI API 키 확인: Settings → Environment Variables
