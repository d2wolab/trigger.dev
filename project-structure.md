# Trigger.dev 프로젝트 구조 분석

## 개요
Trigger.dev는 백그라운드 작업, 워크플로우 및 예약된 작업을 관리하기 위한 개발자 도구 플랫폼입니다. 이 문서는 모노레포 구조로 구성된 프로젝트의 각 구성요소와 기술 스택을 설명합니다.

## 앱(apps)

### 1. coordinator
- **용도**: 플랫폼과 작업 사이의 중간 계층으로, 통신과 체크포인팅을 담당
- **기술 스택**:
  - TypeScript, Node.js
  - socket.io (실시간 통신)
  - prom-client (메트릭 모니터링)
  - tinyexec (프로세스 실행)
- **주요 역할**: 작업 실행 상태 추적, 체크포인트 관리, 중단/재개 논리 처리

### 2. docker-provider
- **용도**: Docker 환경에서 작업 실행을 추상화하는 계층
- **기술 스택**:
  - TypeScript, Node.js
  - Docker API
  - execa (프로세스 실행)
- **주요 역할**: 플랫폼 명령어를 Docker 컨테이너 작업으로 변환, 인프라 독립성 제공

### 3. supervisor
- **용도**: 백그라운드 작업 실행 관리 및 조정
- **기술 스택**:
  - TypeScript, Node.js
  - dockerode (Docker API)
  - socket.io (실시간 통신)
  - zod (데이터 검증)
- **주요 역할**: 작업 그룹 관리, 리소스 모니터링, 작업자 연결 관리

### 4. webapp
- **용도**: 메인 웹 인터페이스 및 API 엔드포인트
- **기술 스택**:
  - TypeScript, React
  - Remix (서버 사이드 렌더링)
  - Tailwind CSS (스타일링)
  - Prisma (ORM)
  - PostgreSQL (데이터베이스)
  - Redis (캐싱, 큐)
  - Socket.IO (실시간 통신)
- **주요 역할**: 사용자 인터페이스, API, 인증, 작업 관리, 모니터링 대시보드 제공

## 패키지(packages)

### 1. trigger.dev (cli-v3)
- **용도**: 개발자용 CLI 도구
- **기술 스택**:
  - TypeScript, Node.js
  - commander (CLI 구조)
  - socket.io-client
- **주요 역할**: 프로젝트 초기화, 개발 환경 설정, 배포, 인증 관리

### 2. @trigger.dev/core
- **용도**: SDK와 플랫폼 전체에서 공유되는 핵심 코드
- **기술 스택**:
  - TypeScript
  - zod (스키마 검증)
  - OpenTelemetry (분산 추적)
- **주요 역할**: 타입 정의, 스키마, API 클라이언트, 유틸리티 함수 제공

### 3. @trigger.dev/sdk
- **용도**: 개발자용 Node.js SDK
- **기술 스택**:
  - TypeScript
  - zod (스키마 검증)
  - WebSocket
- **주요 역할**: 작업 정의, 트리거, 스케줄링, 대기열 관리, AI 통합 API

### 4. @trigger.dev/react-hooks
- **용도**: React 앱 통합용 훅
- **기술 스택**: TypeScript, React
- **주요 역할**: React 애플리케이션과 Trigger.dev 통합

### 5. @trigger.dev/redis-worker
- **용도**: Redis 기반 작업자 구현
- **기술 스택**: TypeScript, Redis
- **주요 역할**: Redis를 사용한 작업 큐 및 작업자 관리

## 내부 패키지(internal-packages)

### 1. @trigger.dev/database
- **용도**: 내부 데이터베이스 접근 계층
- **기술 스택**: TypeScript, PostgreSQL, Prisma
- **주요 역할**: 데이터베이스 스키마 정의, 마이그레이션, Prisma 클라이언트 제공

### 2. @internal/run-engine
- **용도**: 작업 실행 엔진
- **기술 스택**: TypeScript, Redis
- **주요 역할**: 작업 실행, 재시도 로직, 체크포인트, 큐 관리, 동시성 제어

### 3. @internal/emails
- **용도**: 이메일 템플릿 및 발송 시스템
- **기술 스택**: TypeScript, React
- **주요 역할**: 알림, 초대, 인증 이메일 관리

### 4. @internal/redis
- **용도**: Redis 통합 라이브러리
- **기술 스택**: TypeScript, Redis
- **주요 역할**: Redis 연결 및 기능 추상화

### 5. @internal/zod-worker
- **용도**: 데이터 검증이 통합된 작업자
- **기술 스택**: TypeScript, Zod
- **주요 역할**: 스키마 검증이 내장된 작업자 구현

## 아키텍처 특징

- **분산 시스템**: coordinator, supervisor, docker-provider가 분리된 서비스로 구성
- **타입 안전성**: TypeScript와 Zod를 통한 엄격한 타입 시스템
- **실시간 통신**: Socket.IO를 통한 서비스 간 통신
- **확장성**: Docker 컨테이너를 통한 작업 격리와 스케일링
- **모니터링**: OpenTelemetry와 prometheus 통합으로 추적 및 메트릭 수집

## 경량화 방안

### 핵심 기능 분리
1. **미니멀 코어 패키지 구성**
   - 필수 기능만 포함하는 core 패키지 구성
   - 이벤트 처리, 작업 실행, 기본 API만 유지

2. **옵션 기능 모듈화**
   - 모니터링(OpenTelemetry) 선택적 활성화
   - UI 컴포넌트 지연 로딩 구현
   - 분석 도구(posthog) 선택적 로드

### 인프라 경량화
1. **Docker 최적화**
   - 더 가벼운 alpine 기반 이미지로 통일
   - 다단계 빌드 최적화 (불필요한 개발 의존성 제거)
   - 바이너리 의존성 축소 (crictl, docker.io 등)

2. **서비스 통합**
   - Coordinator + Supervisor 통합 가능성 검토
   - 단일 컨테이너 배포 옵션 제공

### 의존성 최적화
1. **UI 라이브러리 경량화**
   - 불필요한 UI 컴포넌트 제거
   - 중복 UI 라이브러리(@headlessui, @radix-ui) 통합
   - 애니메이션 관련 라이브러리(framer-motion) 선택적 로드

2. **빌드 시스템 개선**
   - 트리 쉐이킹 강화
   - 코드 분할 최적화
   - 불필요한 devDependencies 제거