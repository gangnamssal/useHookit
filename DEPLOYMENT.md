# 배포 파이프라인 가이드

## 개요

이 프로젝트는 GitHub Actions를 사용한 자동화된 CI/CD 파이프라인을 제공합니다.

## 파이프라인 구성

### 1. 테스트 (Test)

- 모든 PR과 main 브랜치 푸시에서 실행
- Vitest를 사용한 단위 테스트 실행
- 테스트 실패 시 빌드 및 배포 중단

### 2. 빌드 (Build)

- 테스트 통과 후 실행
- 라이브러리 빌드 및 타입 정의 생성
- 빌드 아티팩트 저장

### 3. 배포 (Deploy)

- 태그 푸시 시에만 실행 (`v*` 형식)
- NPM 패키지 배포
- Storybook Vercel 배포

## 배포 방법

### 자동 배포 (권장)

1. **패치 버전 배포** (버그 수정, 문서 업데이트)

   ```bash
   pnpm release:patch
   ```

2. **마이너 버전 배포** (새 기능 추가)

   ```bash
   pnpm release:minor
   ```

3. **메이저 버전 배포** (호환성 변경)
   ```bash
   pnpm release:major
   ```

### 수동 배포

```bash
# 전체 배포 프로세스 (테스트 → 빌드 → 배포)
pnpm deploy

# 또는 단계별 실행
pnpm test
pnpm build
pnpm publish:lib
```

## GitHub Secrets 설정

GitHub 저장소 설정에서 다음 Secrets를 추가해야 합니다:

### NPM 배포용

- `NPM_TOKEN`: NPM 계정의 액세스 토큰

### Vercel 배포용

- `VERCEL_TOKEN`: Vercel 계정의 액세스 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

## Secrets 설정 방법

### NPM Token

1. [NPM 웹사이트](https://www.npmjs.com/)에 로그인
2. 프로필 → Access Tokens → Generate New Token
3. Token Type: `Automation`
4. GitHub Secrets에 `NPM_TOKEN`으로 저장

### Vercel Token

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. Settings → Tokens → Create Token
3. GitHub Secrets에 `VERCEL_TOKEN`으로 저장
4. 프로젝트 설정에서 `VERCEL_ORG_ID`와 `VERCEL_PROJECT_ID` 확인

## 워크플로우 트리거

- **PR 생성/업데이트**: 테스트만 실행
- **main 브랜치 푸시**: 테스트 및 빌드 실행
- **태그 푸시** (`v*`): 전체 파이프라인 실행 (테스트 → 빌드 → 배포)

## 모니터링

GitHub Actions 탭에서 파이프라인 실행 상태를 확인할 수 있습니다:

- https://github.com/gangnamssal/useHookit/actions

## 문제 해결

### 빌드 실패

- Node.js 버전 확인 (18.x 사용)
- 의존성 설치 확인
- TypeScript 컴파일 오류 확인

### 배포 실패

- NPM 토큰 유효성 확인
- 패키지 이름 중복 확인
- 버전 번호 확인

### Storybook 배포 실패

- Vercel 토큰 유효성 확인
- 프로젝트 ID 확인
- 빌드 로그 확인
