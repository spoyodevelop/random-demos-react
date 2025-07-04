# 🎲 Random Demos React

우아한테크코스 테코톡 "랜덤" 발표를 위한 인터랙티브 데모 모음집입니다.

## 📋 프로젝트 개요

이 프로젝트는 우테코 테코톡에서 "랜덤"에 대한 다양한 오해와 흥미로운 사실들을 시각적으로 설명하기 위한 발표용 데모들의 총집합본입니다. React + TypeScript + Vite로 구축된 웹 애플리케이션으로, 3가지 인터랙티브 데모를 제공합니다:

### 🎯 수능 정답 분포 분석

**"정답은 정말 랜덤할까?"**

- 2014-2023년 실제 수능 정답 분포를 인포그래픽으로 시각화

### 🎰 잘못된 랜덤 셔플 알고리즘 데모

**"`Array.sort(() => Math.random() - 0.5)`는 왜 잘못된 셔플일까?"**

- 잘못된 셔플 알고리즘과 올바른 Fisher-Yates 셔플의 편향성 비교
- 대량 시뮬레이션을 통한 편향성 시각화 및 실시간 통계
- 개발자들이 흔히 하는 실수를 인터랙티브하게 체험

### 🔀 /dev/urandom 뷰어

**"진정한 랜덤은 어떻게 생겼을까?"**

- Unix/Linux의 `/dev/urandom` 장치 파일 동작 원리 시각화
- `xxd` 명령어 스타일의 실시간 hex dump 출력
- 운영체제 레벨의 랜덤 데이터 생성 과정 체험

## 🎤 테코톡 발표 컨텍스트

이 데모들은 다음과 같은 발표 흐름에 맞춰 설계되었습니다:

1. **일상의 랜덤 오해** - 수능 정답 분포로 "진짜 랜덤"에 대한 편견 깨기
2. **개발자의 랜덤 실수** - 잘못된 셔플 알고리즘의 함정 체험하기
3. **컴퓨터의 진짜 랜덤** - 시스템 레벨에서의 랜덤 데이터 생성 과정 이해하기

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🛠 기술 스택

- **Frontend**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.6.2
- **Charts**: Chart.js 4.5.0 + react-chartjs-2 5.3.0
- **Styling**: CSS3 (커스텀 스타일링)
- **Linting**: ESLint 9.25.0

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── SuneungAnalysis.tsx      # 수능 정답 분포 분석
│   ├── ShuffleBiasComparison.tsx # 셔플 편향성 비교
│   └── UrandomViewer.tsx        # /dev/urandom 뷰어
├── App.tsx                      # 메인 앱 컴포넌트 (라우팅)
├── App.css                      # 스타일시트
├── main.tsx                     # 앱 진입점
└── index.css                    # 글로벌 스타일
```

## 🎮 데모 사용법

### 🎯 수능 정답 분포

- 차트에서 각 보기별 빈도와 비율 확인
- 연도별 트렌드 변화 관찰
- 정답 분포가 균등하지 않다는 것을 시각적으로 체험

### 🎰 셔플 편향성 비교

- 범위와 추첨 개수 설정 후 테스트 실행
- 단일 테스트 vs 대량 테스트 비교
- 잘못된 셔플과 올바른 셔플의 분포 차이 관찰

### 🔀 /dev/urandom 뷰어

- 스페이스바로 시작/정지 토글
- C키로 화면 클리어
- 실시간으로 변화하는 랜덤 바이트 데이터 관찰

## 📚 교육적 가치

각 데모는 다음과 같은 개념을 학습할 수 있습니다:

- **확률과 통계**: 실제 데이터를 통한 확률 분포 이해
- **알고리즘**: 올바른 셔플 알고리즘의 중요성
- **시스템 프로그래밍**: 운영체제의 랜덤 데이터 생성 메커니즘

## 🎯 발표 활용 팁

1. **수능 정답 분포**: 청중의 직관과 실제 데이터의 차이점 강조
2. **셔플 편향성**: 라이브 코딩으로 잘못된 셔플의 문제점 시연
3. **urandom 뷰어**: 터미널과 비교하여 시각적 임팩트 극대화

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
