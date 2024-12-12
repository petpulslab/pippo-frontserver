import { NextRequest, NextResponse } from "next/server";

interface AnalysisResult {
  data: {
    content: {
      ansFilter: string;
      ansDog: string;
    }[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const userToken = request.headers.get("X-User-Token");

    if (!userToken) {
      return NextResponse.json(
        { success: false, error: "인증 토큰이 필요합니다." },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    const response = await fetch(
      "https://pippo.petpuls.net/emo/v1/analysis/result",
      {
        headers: {
          "X-User-Token": userToken,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const result: AnalysisResult = await response.json();

    return NextResponse.json(result, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("감정 분석 결과 조회 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: "감정 분석 결과를 조회하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
