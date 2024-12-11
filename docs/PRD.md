# Pippo 공지사항 프론트 서버 기술 문서

## 1. 개요

Next.js를 사용하여 Pippo 공지사항 API를 중계하는 프론트 서버 구축 문서입니다.

## 2. API 명세

### 기본 정보

- 원본 API: `http://pippo.petpuls.net/pippo/notice/ls`
- 파라미터:
  - tp: notice (고정값)
  - pn: 페이지 번호
  - rs: 페이지 크기
  - lang: 언어 코드 (선택)

### 프론트 서버 API

```typescript
// 타입 정의
interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoticeResponse {
  success: boolean;
  data: {
    items: Notice[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}
```

## 3. 구현 코드

### API 라우트 구현

```typescript
// pages/api/notices.ts
import { NextApiRequest, NextApiResponse } from "next";

const PIPPO_API = "http://pippo.petpuls.net/pippo/notice/ls";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page = 1, pageSize = 20, language } = req.query;

  try {
    const url = new URL(PIPPO_API);
    url.searchParams.set("tp", "notice");
    url.searchParams.set("pn", String(page));
    url.searchParams.set("rs", String(pageSize));

    if (language) {
      url.searchParams.set("lang", String(language));
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
      },
    });
  } catch (error) {
    console.error("Notice API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notices",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
```

### 환경 변수 설정

```env
PIPPO_API_BASE_URL=http://pippo.petpuls.net/pippo
NODE_ENV=development
```

## 4. 프로젝트 설정

### package.json

```json
{
  "name": "pippo-notice-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^16.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.8.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 5. API 사용 예시

### 기본 호출

```typescript
const getNotices = async () => {
  const response = await fetch("/api/notices");
  const data = await response.json();
  return data;
};
```

### 페이지네이션 사용

```typescript
const getNoticesWithPagination = async (page: number, pageSize: number) => {
  const response = await fetch(
    `/api/notices?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();
  return data;
};
```

### 다국어 지원

```typescript
const getNoticesWithLanguage = async (language: string) => {
  const response = await fetch(`/api/notices?language=${language}`);
  const data = await response.json();
  return data;
};
```

## 6. 에러 처리

### 에러 코드 및 대응

- 400: 잘못된 요청 파라미터
- 404: 리소스를 찾을 수 없음
- 500: 서버 내부 오류

### 에러 처리 예시

```typescript
const getNotices = async () => {
  try {
    const response = await fetch("/api/notices");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    throw error;
  }
};
```

## 7. 배포 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] TypeScript 컴파일 확인
- [ ] API 엔드포인트 테스트
- [ ] 에러 핸들링 테스트
- [ ] CORS 설정 확인
- [ ] 빌드 테스트
