# 인트로 화면 구현 및 메인 화면 전환 가이드

다른 AI가 이 프로젝트나 비슷한 앱에서 인트로 화면 이후 메인(입력) 화면으로 넘어가는 구조를 파악할 수 있도록 작성된 가이드 문서입니다.

## 기본 원리 (전역 상태 기반 렌더링)

앱의 메인 진입점(`App.tsx`)에서 라우터(Router) 모듈을 쓰지 않고, 전역 상태(Zustand 등 `useAppStore`)와 `AnimatePresence`(framer-motion)를 조합해 현재 단계(stage)에 맞는 화면 컴포넌트를 렌더링하는 방식입니다.

---

## 1. App.tsx : 상태에 따른 화면 분기 처리

스토어에서 `isIntro`나 `stage` 값을 가져와서 삼항 연산자로 화면을 갈아끼우는 구조를 취합니다.

```tsx
// App.tsx 의 핵심 화면 전환부
export default function App() {
  // 스토어에서 현재 인트로를 봐야 하는지, 아니면 어느 stage인지 상태를 가져옴
  const { isIntro, stage } = useAppStore();

  return (
    <div className="app-container">
      {/* mode="wait"를 통해 이전 컴포넌트의 exit 애니메이션이 끝난 후 다음 컴포넌트 렌더링 */}
      <AnimatePresence mode="wait">
        {isIntro ? (
          // 1. 처음 앱 진입 시 보이는 인트로 화면
          <IntroStage />
        ) : stage === 'input' ? (
          // 2. 인트로가 끝난 뒤 이름을 입력하는 메인 화면
          <InputStage onShowResult={handleShowResult} />
        ) : (
          // 3. 입력이 끝난 뒤 점수와 판정을 보여주는 결과 화면
          <ResultStage />
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 2. IntroStage : 메인 화면으로의 전환 (트리거)

인트로 화면에서는 유저가 "시작하기" 버튼 같은 동작을 취할 때, 스토어에 정의된 함수(`startApp`)를 실행해 상태를 업데이트합니다.

```tsx
// IntroStage 컴포넌트 내부
function IntroStage() {
  // Zustand 스토어에서 인트로를 종료하고 메인 단계('input')로 설정해주는 함수를 꺼냄
  const startApp = useAppStore((s) => s.startApp);

  return (
    <motion.div key="intro" exit={{ opacity: 0 }}>
      {/* ... 로고 및 설명 텍스트 등의 UI ... */}
      
      <div className="intro-bottom">
        <motion.button
          className="submit-button"
          onClick={startApp} // 이 버튼을 누르면 상태가 바뀌면서 App 컴포넌트가 재렌더링 됨 -> InputStage로 전환
        >
          시작하기
        </motion.button>
      </div>
    </motion.div>
  );
}
```

---

## 💡 유사한 앱 개발 시 AI 참고용 체크리스트
1. **페이지 이동(Routing) 없음**: 별도의 `/main` 과 같은 URL 이동이 아니라 상태 플래그(`isIntro`, `stage`)로 UI만 교체합니다.
2. **트랜지션 애니메이션 필수**: 갑자기 화면이 빡 바뀌면 어색하니까, framer-motion의 `<AnimatePresence>`와 `motion.div`를 각각의 스테이지마다 가장 바깥에 둘러주어야 합니다. (`key` 속성 부여 필수)
3. **스토어 분리**: `startApp` 같은 화면 전환 핸들러는 단순 컴포넌트 내부 state보다는 전역 store 공간에 선언해서 어디서든 쉽게 단계를 초기화하거나 바꿀 수 있게 설계하는 편이 유리합니다.
