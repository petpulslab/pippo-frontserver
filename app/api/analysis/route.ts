import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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

    console.log("Calling Pippo API with token:", userToken);

    const response = await fetch(
      "http://pippo.petpuls.net/emo/v1/analysis/result",
      {
        method: "GET",
        headers: {
          "X-User-Token": userToken,
          Accept: "application/json",
        },
      }
    );

    console.log("Pippo API response status:", response.status);
    const responseText = await response.text();
    console.log("Pippo API response body:", responseText);

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText) as AnalysisResult;
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      throw new Error("응답을 파싱하는 중 오류가 발생했습니다.");
    }

    if (!result.data?.content) {
      throw new Error("유효하지 않은 응답 형식입니다.");
    }

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
        error:
          error instanceof Error
            ? error.message
            : "감정 분석 결과를 조회하는 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.stack : undefined,
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
