import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PIPPO_API = "http://pippo.petpuls.net/pippo/notice/ls";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";
  const language = searchParams.get("language");
  //
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

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Notice API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notices",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
