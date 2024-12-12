# Pippo 공지사항 프론트 서버 기술 문서

## 1. 개요

Next.js 14와 App Router를 사용하여 Pippo 공지사항 API를 중계하고 음성 파일을 처리하는 프론트 서버 구축 문서입니다.

## 2. 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- FormData API

## 3. API 명세

### 3.1 공지사항 API

- 원본 API: `http://pippo.petpuls.net/pippo/notice/ls`
- 파라미터:
  - tp: notice (고정값)
  - pn: 페이지 번호
  - rs: 페이지 크기
  - lang: 언어 코드 (선택)

### 3.2 음성 파일 업로드 API

- 엔드포인트: `https://pippo.petpuls.net/emo/v1/analysis/request`
- 메소드: POST
- Content-Type: multipart/form-data
- 요청 파라미터:
  - bark_file: WAV 형식 음성 파일
- 파일명 형식: `YYYY-MM-DD_HH-mm-ss.wav`

### 3.3 감정 분석 결과 조회 API

- 엔드포인트: `https://pippo.petpuls.net/emo/v1/analysis/result`
- 메소드: GET
- 헤더:
  - X-User-Token: 사용자 고유 토큰
- 응답 형식:
  ```json
  {
    "data": {
      "content": [
        {
          "ansFilter": string,  // "noise" 또는 ""
          "ansDog": string     // 감정 분석 결과 코드
        }
      ]
    }
  }
  ```
- 결과 처리:
  - ansFilter가 "noise"인 경우: 노이즈 감지, 재녹음 필요
  - ansDog 값이 존재하는 경우: 감정 분석 결과 처리
  - 그 외의 경우: 대기 상태로 전환

## 4. 파일 업로드 요구사항

### 4.1 기능 요구사항

- WAV 파일 수신 및 처리
- API 서버로 파일 전송
- 업로드 상태 모니터링
- 응답 처리 및 에러 핸들링
- 파일 업로드 후 결과 조회
- 사용자 토큰 기반 인증
- 분석 결과에 따른 상태 관리

### 4.2 기술 요구사항

- multipart/form-data 형식 지원
- 파일 유효성 검사
- 타임스탬프 기반 파일명 생성
- 비동기 파일 전송 처리
- 토큰 기반 인증 처리
- 주기적 결과 조회 처리
- 분석 결과 상태 코드 매핑

## 5. 스타일링

- Tailwind CSS를 기본 스타일링 도구로 사용
- Shadcn/ui 컴포넌트 라이브러리 활용
- GeistVF, GeistMonoVF 폰트 사용

## 6. 에러 처리

### 6.1 에러 코드 및 대응

- 400: 잘못된 요청 파라미터
- 401: 인증 토큰 오류
- 404: 리소스를 찾을 수 없음
- 413: 파일 크기 초과
- 415: 지원하지 않는 파일 형식
- 429: 요청 횟수 초과
- 500: 서버 내부 오류

### 6.2 파일 업로드 관련 검증

- 파일 형식: WAV 파일만 허용
- 파일 크기: 최대 10MB로 제한
- 파일명: 특수문자 제거 및 타임스탬프 추가

## 7. 배포 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] TypeScript 컴파일 확인
- [ ] API 엔드포인트 테스트
- [ ] 파일 업로드 기능 테스트
- [ ] 에러 핸들링 테스트
- [ ] CORS 설정 확인
- [ ] 빌드 테스트
