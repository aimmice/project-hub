---
version: 1.0
name: VenuePick Glass
description: 베뉴픽(VenuePick)의 다크·라이트 하이브리드 글래스모피즘 디자인 시스템. 반투명 카드가 배경 위에 부유하는 소프트 UI로, B2B 데이터 서비스에 맞는 "정제된 대시보드 톤"을 지향한다. 홈/리스트는 라이트 베이스, 시설 상세의 AI 요약·대시보드 영역은 다크 네이비 글래스로 전환된다.

colors:
  primary: "#3E6BFF"
  primary-soft: "#4F8CFF"
  primary-tint: "#8AB4FF"
  on-primary: "#FFFFFF"
  ink: "#10192B"
  ink-strong: "#0B1526"
  body: "#6B7A99"
  mute: "#9AA5BD"
  hairline: "rgba(16, 25, 43, 0.10)"
  hairline-dark: "rgba(255, 255, 255, 0.12)"
  base-bg: "#F4F6FA"
  deep-bg: "#0B1526"
  glass-light: "rgba(255, 255, 255, 0.55)"
  glass-dark: "rgba(20, 35, 60, 0.55)"
  glass-border-light: "rgba(255, 255, 255, 0.6)"
  glass-border-dark: "rgba(255, 255, 255, 0.12)"
  warning: "#E8A33D"
  on-dark-ink: "#F4F6FA"
  on-dark-body: "#AEB9D1"

typography:
  display-xl:
    fontFamily: Pretendard, Space Grotesk, system-ui, sans-serif
    fontSize: 48px
    fontWeight: 700
    lineHeight: 56px
    letterSpacing: -0.8px
  display-lg:
    fontFamily: Pretendard, Space Grotesk, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: -0.5px
  display-md:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 22px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.3px
  display-sm:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
  body-lg:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 22px
  body-sm:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  caption:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label-eyebrow:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.4px
  data-numeric:
    fontFamily: JetBrains Mono, SFMono-Regular, Menlo, monospace
    fontSize: 28px
    fontWeight: 700
    lineHeight: 32px
  data-numeric-sm:
    fontFamily: JetBrains Mono, SFMono-Regular, Menlo, monospace
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-md:
    fontFamily: Pretendard, Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 22px

rounded:
  none: 0px
  sm: 8px
  md: 16px
  lg: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px

elevation:
  glass-default: "0 8px 32px rgba(16, 25, 43, 0.08)"
  glass-hover: "0 16px 40px rgba(16, 25, 43, 0.14)"
  glass-dark-default: "0 8px 32px rgba(0, 0, 0, 0.35)"
  glass-dark-hover: "0 16px 40px rgba(0, 0, 0, 0.45)"
  modal: "0 24px 64px rgba(11, 21, 38, 0.35)"

motion:
  card-enter: "fade + translateY(8px→0), 200ms ease-out"
  card-hover: "translateY(-2px) + shadow glass-hover, 150ms ease-out"
  skeleton-pulse: "opacity 0.6↔1, 1200ms ease-in-out infinite"

components:
  nav-bar:
    backgroundColor: "{colors.glass-light}"
    backdropBlur: "16px"
    textColor: "{colors.ink}"
    borderColor: "{colors.glass-border-light}"
    typography: "{typography.body-md}"
    padding: "{spacing.md} {spacing.2xl}"
  nav-link:
    textColor: "{colors.body}"
    activeColor: "{colors.primary}"
    typography: "{typography.body-md}"
  button-primary:
    backgroundColor: "linear-gradient({colors.primary-soft}, {colors.primary})"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.2xl}"
  button-outline:
    backgroundColor: "{colors.glass-light}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.2xl}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.lg}"
  search-input:
    backgroundColor: "{colors.glass-light}"
    backdropBlur: "12px"
    textColor: "{colors.ink}"
    borderColor: "{colors.glass-border-light}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
  filter-select:
    backgroundColor: "{colors.glass-light}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  card-facility:
    description: "홈 리스트의 시설 카드 (썸네일, 이름, 지역, 평균평점, 리뷰수, 키워드 태그)"
    backgroundColor: "{colors.glass-light}"
    backdropBlur: "20px"
    textColor: "{colors.ink}"
    borderColor: "{colors.glass-border-light}"
    shadow: "{elevation.glass-default}"
    shadowHover: "{elevation.glass-hover}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  badge-verified:
    description: "✓ 인증된 이용 후기 뱃지"
    backgroundColor: "linear-gradient({colors.primary-soft}, {colors.primary-tint})"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.md}"
  stat-card:
    description: "대시보드 통계 카드 (평균평점/리뷰수/인증비율) — 다크 글래스"
    backgroundColor: "{colors.glass-dark}"
    backdropBlur: "20px"
    textColor: "{colors.on-dark-ink}"
    borderColor: "{colors.glass-border-dark}"
    shadow: "{elevation.glass-dark-default}"
    numberTypography: "{typography.data-numeric}"
    labelTypography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  chart-card:
    description: "항목별 만족도 도넛차트 컨테이너 — 다크 글래스, 블루 그라데이션 세그먼트"
    backgroundColor: "{colors.glass-dark}"
    backdropBlur: "20px"
    textColor: "{colors.on-dark-ink}"
    borderColor: "{colors.glass-border-dark}"
    chartGradient: "{colors.primary-soft} → {colors.primary-tint}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  wordcloud-card:
    description: "리뷰 워드클라우드 — 다크 글래스, 빈도 높을수록 진한 블루"
    backgroundColor: "{colors.glass-dark}"
    backdropBlur: "20px"
    textColor: "{colors.on-dark-ink}"
    borderColor: "{colors.glass-border-dark}"
    wordColorRange: "{colors.primary-tint} → {colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ai-summary-card:
    description: "AI 요약 카드 — 장점/단점 리스트 + 키워드 태그, 다크 글래스"
    backgroundColor: "{colors.glass-dark}"
    backdropBlur: "20px"
    textColor: "{colors.on-dark-ink}"
    borderColor: "{colors.glass-border-dark}"
    headingTypography: "{typography.display-sm}"
    bodyTypography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.2xl}"
  review-card:
    description: "리뷰 카드 — 카테고리별 평점 breakdown + 텍스트 + 인증뱃지"
    backgroundColor: "{colors.glass-light}"
    backdropBlur: "16px"
    textColor: "{colors.ink}"
    borderColor: "{colors.glass-border-light}"
    shadow: "{elevation.glass-default}"
    ratingTypography: "{typography.data-numeric-sm}"
    bodyTypography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  modal-review-form:
    description: "리뷰 작성 모달/슬라이드패널"
    backgroundColor: "{colors.glass-light}"
    backdropBlur: "24px"
    textColor: "{colors.ink}"
    borderColor: "{colors.glass-border-light}"
    shadow: "{elevation.modal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.2xl}"
  hero-band:
    backgroundColor: "{colors.base-bg}"
    accentGradient: "{colors.primary-soft} → {colors.primary-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.6xl} {spacing.2xl}"
  content-band-light:
    backgroundColor: "{colors.base-bg}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.2xl}"
  content-band-dark:
    description: "시설 상세의 AI요약/대시보드 섹션 — 데이터 인사이트 영역"
    backgroundColor: "{colors.deep-bg}"
    textColor: "{colors.on-dark-ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.2xl}"
  footer:
    backgroundColor: "{colors.deep-bg}"
    textColor: "{colors.on-dark-body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.2xl}"
  empty-state:
    description: "검색 결과 0건 / 리뷰 0건 빈 상태"
    backgroundColor: "{colors.glass-light}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4xl}"
  toast:
    backgroundColor: "{colors.ink-strong}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.xl}"
  skeleton:
    description: "로딩 상태 — glass 카드 형태 그대로 회색 펄스"
    backgroundColor: "{colors.hairline}"
    animation: "{motion.skeleton-pulse}"
    rounded: inherit-from-parent
---

## Overview

VenuePick은 MICE 시설·벤더 리뷰 플랫폼으로, "정제된 대시보드 톤"을 지향하는 글래스모피즘 UI를 쓴다. 라이트 베이스 위에 반투명 블러 카드가 떠 있는 홈/리스트 화면과, 딥 네이비 배경 위에 다크 글래스 카드가 떠 있는 시설 상세의 AI 요약·대시보드 화면, 두 가지 레이어가 공존한다. 유채색은 블루 계열(`{colors.primary}` `#3E6BFF`) 하나로 통일하고 채도·명도 변화로 위계를 표현하며, 경고성 정보에만 예외적으로 앰버(`{colors.warning}` `#E8A33D`)를 소량 쓴다.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` `#3E6BFF`): 모든 주요 CTA, 활성 상태, 인증 뱃지 그라데이션의 기준색.
- **Primary Soft / Tint** (`#4F8CFF` / `#8AB4FF`): 그라데이션의 밝은 쪽 끝 — 버튼 그라데이션, 차트 세그먼트, 워드클라우드 강조 단어.

### Surface
- **Base BG** (`{colors.base-bg}` `#F4F6FA`): 홈·리스트 라이트 섹션 배경.
- **Deep BG** (`{colors.deep-bg}` `#0B1526`): 시설 상세의 AI요약·대시보드 다크 섹션 배경.
- **Glass Light / Glass Dark**: 반투명 카드 배경. 라이트 섹션엔 `glass-light`(`rgba(255,255,255,0.55)`), 다크 섹션엔 `glass-dark`(`rgba(20,35,60,0.55)`) — 항상 `backdrop-filter: blur()`와 함께 사용.

### Text
- **Ink** (`{colors.ink}` `#10192B`): 라이트 섹션 기본 텍스트.
- **On Dark Ink** (`{colors.on-dark-ink}` `#F4F6FA`): 다크 섹션 기본 텍스트.
- **Body** (`{colors.body}` `#6B7A99`): 보조 텍스트, 캡션.

### Semantic
- **Warning** (`{colors.warning}` `#E8A33D`): 경고·이슈 리포트 등 부정적 정보에만 소량 사용. 그 외 부정/경고 상태에도 파랑 채도 조절로 대응, 별도 red/error 팔레트는 두지 않는다 (PRD 스코프 밖).

## Typography

- **Pretendard**(헤드라인 Bold, 본문 Regular) — 한글 가독성 우선, 영문 병기 시 Space Grotesk(디스플레이) / Inter(본문) 폴백.
- **JetBrains Mono** — 평점, 가격대, 통계 숫자 등 "정확한 정보"임을 강조해야 하는 데이터성 텍스트 전용. 본문/헤드라인에는 쓰지 않는다.

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-xl}` | 48px | 700 | 홈 히어로 헤드라인 |
| `{typography.display-lg}` | 32px | 700 | 섹션 타이틀 |
| `{typography.display-md}` | 22px | 700 | 카드/모달 타이틀 |
| `{typography.display-sm}` | 18px | 600 | 서브 타이틀 (AI요약 카드 헤딩 등) |
| `{typography.body-lg}` | 17px | 400 | 리드 문단 |
| `{typography.body-md}` | 15px | 400 | 기본 본문 |
| `{typography.body-sm}` | 13px | 400 | 보조 텍스트, nav-link |
| `{typography.label-eyebrow}` | 13px | 600 | 필터 라벨, 섹션 이름표 |
| `{typography.data-numeric}` | 28px | 700 (Mono) | 통계 카드 큰 숫자 |
| `{typography.data-numeric-sm}` | 14px | 500 (Mono) | 리뷰 카드 내 평점 숫자 |
| `{typography.button-md}` | 15px | 600 | 버튼 라벨 |

## Layout

- **Spacing**: 4px 베이스 스케일 (`{spacing.xxs}`~`{spacing.6xl}`).
- **Section padding**: 라이트/다크 콘텐츠 밴드 모두 `{spacing.5xl}` 48px 상하.
- **카드 내부 패딩**: `{spacing.xl}`~`{spacing.2xl}` (20~24px).
- **시설 카드 그리드**: 데스크탑 3-up, 태블릿 2-up, 모바일 1-up.
- **라이트/다크 전환 경계**: 시설 상세 페이지 내부에서 기본정보/리뷰 섹션은 라이트, AI요약+대시보드(도넛차트/통계카드/워드클라우드) 섹션만 `content-band-dark`로 전환.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | 그림자 없음 | 풀블리드 배경 밴드 |
| Level 1 — Glass Default | `{elevation.glass-default}` + blur 16~20px + 1px 저투명도 흰 보더 | 카드 기본 상태 (`card-facility`, `review-card`) |
| Level 1D — Glass Dark Default | `{elevation.glass-dark-default}` | 다크 섹션 카드 (`stat-card`, `chart-card`, `ai-summary-card`) |
| Level 2 — Hover Lift | `{elevation.glass-hover}` + `translateY(-2px)` | 카드 호버/탭 |
| Level 3 — Modal | `{elevation.modal}` | `modal-review-form` |

진하고 딱딱한 그림자는 쓰지 않는다 — 항상 낮은 불투명도로 넓게 퍼지는 소프트 섀도우.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | 8px | `filter-select` |
| `{rounded.md}` | 16px | `review-card`, `toast` |
| `{rounded.lg}` | 24px | `card-facility`, `stat-card`, `chart-card`, 모달 |
| `{rounded.pill}` | 9999px | 모든 버튼, `search-input`, `badge-verified` |

## Components

이 프로젝트(3개 페이지 + 리뷰작성 모달)에 실제로 쓰이는 컴포넌트만 정의한다.

### 홈 (라이트)
- `nav-bar` / `nav-link` — 상단 고정 글래스 네비게이션. 로그인/로그아웃, 마이페이지 링크 상시 노출.
- `hero-band` — 핵심 카피 + `search-input`.
- `filter-select` — 지역/유형/수용인원/평점순 필터.
- `card-facility` — 썸네일, 이름, 지역, 평균평점(`data-numeric-sm`), 리뷰수, 키워드 태그.
- `empty-state` — 검색 결과 0건 시.

### 시설 상세 (라이트 → 다크 전환)
- 기본정보 섹션: 라이트, `card-facility` 변형.
- `ai-summary-card` — 장점 3/단점 3/키워드 5, 다크 글래스. 리뷰 5개 미만이면 안내 텍스트만 표시 (카드 자체는 유지, 콘텐츠만 안내문으로 교체).
- `stat-card` × 3 — 평균평점 / 리뷰수 / 인증비율.
- `chart-card` — 항목별(가격/접근성/시설/서비스) 만족도 도넛차트, 블루 그라데이션 세그먼트.
- `wordcloud-card` — 빈도 높은 단어일수록 진한 블루.
- `review-card` — 카테고리별 평점 breakdown, 텍스트, `badge-verified`(첨부파일 있을 때만).
- `button-primary` — "리뷰 작성" CTA.

### 리뷰 작성 모달
- `modal-review-form` — 카테고리별 별점 입력, 텍스트 영역(20자 카운터), 파일 첨부, `button-primary`(제출) / `button-ghost`(취소).
- `toast` — 제출 성공 알림.

### 마이페이지 (라이트)
- `review-card` 목록 (본인 리뷰) + 수정/삭제 액션 — `button-outline` / `button-ghost`.
- `empty-state` — 작성한 리뷰가 없을 때.

### 전역
- `footer` — 다크.
- `skeleton` — 데이터 로딩 중 카드 자리 표시자 (글래스 카드 형태 유지, 내부만 회색 펄스).

## Motion

- 카드 진입: `{motion.card-enter}` — 페이드 + 8px 슬라이드업, 200ms.
- 카드 호버/탭: `{motion.card-hover}` — `translateY(-2px)` + 섀도우 확장, 150ms.
- 로딩: `{motion.skeleton-pulse}` — 회색 펄스, 1200ms 루프. 과한 스켈레톤 애니메이션 지양.

## Do's and Don'ts

### Do
- 유채색은 블루(`{colors.primary}` 계열) 하나로 통일하고, 채도·명도로 위계를 표현한다.
- 모든 카드는 `backdrop-filter: blur()` + 저투명도 흰 보더로 유리질감을 낸다. 그림자는 항상 넓고 옅게.
- 버튼은 예외 없이 pill(`{rounded.pill}`)로 만든다.
- 통계·평점·가격 등 데이터성 숫자는 JetBrains Mono로 구분해 "정확한 정보"라는 인상을 준다.
- 시설 상세의 AI요약·대시보드 섹션만 다크로 전환해 "데이터 인사이트 영역"임을 시각적으로 분리한다.

### Don't
- design.md(Voltagent 레퍼런스)의 그린 포인트 컬러, 헤어라인 전용 카드, 각진 6px 버튼을 이 프로젝트에 가져오지 않는다.
- 경고색 앰버(`{colors.warning}`)를 CTA나 브랜드 포인트로 쓰지 않는다 — 이슈/경고 컨텍스트 전용.
- 진하고 딱딱한 드롭섀도우를 쓰지 않는다 — 항상 블러+저투명도.
- 리뷰 카드/시설 카드가 아닌 곳(테이블, pricing tier 등 design.md의 `ex-*` 컴포넌트)은 이 프로젝트 범위에 없으므로 만들지 않는다.
