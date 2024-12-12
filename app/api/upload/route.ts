import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // 요청에서 FormData 추출
    const formData = await request.formData();
    const audioFile = formData.get("bark_file");

    if (!audioFile) {
      return NextResponse.json(
        { error: "음성 파일이 필요합니다." },
        { status: 400 }
      );
    }

    // API 서버로 요청 전달
    const response = await fetch(
      "https://pippo.petpuls.net/emo/v1/analysis/request",
      {
        method: "POST",
        body: formData, // 받은 FormData를 그대로 전달
      }
    );

    if (!response.ok) {
      throw new Error("API 서버 요청 실패");
    }

    // API 서버의 응답을 그대로 클라이언트에 전달
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "파일 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
