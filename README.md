<div align="center">
<h1>내 프로젝트</h1>

### 백그라운드 작업 처리 플랫폼

</div>

## 이 프로젝트에 대하여

이 프로젝트는 Trigger.dev 플랫폼을 기반으로 한 맞춤형 작업 처리 시스템입니다. 애플리케이션에서 장시간 실행되는 백그라운드 작업을 생성하고 관리할 수 있습니다.

### 주요 기능:

- JavaScript 및 TypeScript SDK
- 백그라운드 작업에 타임아웃 없음
- 지수 백오프를 통한 자동 재시도
- 대기열 및 동시성 제어
- 예약된 작업 및 크론 지원
- 로그 및 추적 뷰를 통한 완전한 관찰 가능성
- 프론트엔드 애플리케이션을 위한 React 통합
- 데이터 스트리밍을 위한 실시간 API
- 작업 상태 및 메타데이터 추적
- 맞춤형 알림
- 탄력적 확장
- 현대적인 기술 스택과 호환

## 사용법

코드베이스에서 직접 백그라운드 작업을 생성하여 더 나은 구성과 버전 관리를 할 수 있습니다.

```ts
import { task } from "@trigger.dev/sdk/v3";

// 작업 정의 및 내보내기
export const processData = task({
  // 각 작업에 고유 ID 사용
  id: "process-data",
  // 주요 작업 함수
  run: async (payload: { data: any }) => {
    // 타임아웃 없이 장시간 실행 코드 작성
    const result = await processLargeDataset(payload.data);
    return result;
  },
});
```

## 환경 지원

시스템은 여러 환경을 지원합니다:
- `개발(Development)` - 로컬 테스트용
- `스테이징(Staging)` - 프로덕션 전 검증용
- `프로덕션(Production)` - 실제 워크로드용

## 작업 모니터링

디버깅 및 성능 분석에 도움이 되는 상세 로그 및 추적 뷰로 모든 작업을 모니터링할 수 있습니다.

## 시작하기

이 프로젝트를 시작하는 방법은 다음과 같습니다:

1. 저장소 복제
   ```
   git clone https://github.com/yourusername/trigger.dev.git
   cd trigger.dev
   ```

2. 의존성 설치
   ```
   pnpm install
   ```

3. 환경 변수 설정
   기본 `.env` 파일을 생성하거나 예제를 복사:
   ```
   cp .env.example .env
   ```
   필요한 설정:
   - SESSION_SECRET, MAGIC_LINK_SECRET, ENCRYPTION_KEY
   - DATABASE_URL (실행 방법에 따라 자동 설정됨)

4. 프로젝트 실행 방법

   **방법 1: Docker 사용 (추천)**
   ```
   # 인프라 서비스만 Docker로 시작 (PostgreSQL, Redis, RedisInsight)
   pnpm run docker

   # Docker 환경 로그 확인
   pnpm run docker:logs

   # Docker 환경 중지
   pnpm run docker:stop
   ```

   **방법 2: Docker 인프라 + 로컬 앱 실행 (개발 권장)**
   ```
   # 1. 먼저 인프라 서비스 시작
   pnpm run docker
   
   # 2. 데이터베이스 마이그레이션
   pnpm run db:migrate
   
   # 3. 데이터베이스 시드 데이터 추가
   pnpm run db:seed
   
   # 4. 필요한 파일 생성
   pnpm run generate
   
   # 5. 웹앱 빌드
   pnpm run build --filter webapp
   
   # 6. 전체 개발 서버 시작
   pnpm run dev
   
   # 또는 웹앱만 실행 
   pnpm run dev --filter webapp
   ```

5. 웹 인터페이스 접속
   - 기본 URL: http://localhost:3030

## 개발

프로젝트 구조:
- `/apps` - 애플리케이션 서비스
- `/packages` - 공유 라이브러리 및 SDK
- `/docker` - 배포를 위한 Docker 구성

## 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.