export const runtime = "edge";
import { Notice } from "@/lib/types";

async function getNotices(page = 1, pageSize = 20) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const response = await fetch(
    `${baseUrl}/api/notices?page=${page}&pageSize=${pageSize}`,
    {
      // Next.js 13+ 에서는 상대 경로 사용 가능
      cache: "no-store", // 또는 필요에 따라 캐시 설정
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch notices");
  }
  return response.json();
}

export default async function Home() {
  const { data } = await getNotices();

  if (!data?.items) {
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">공지사항</h1>
          <p>공지사항이 없습니다.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">공지사항</h1>
        <div className="space-y-4">
          {data.items.map((notice: Notice) => (
            <article key={notice.id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">{notice.title}</h2>
              <p className="mt-2 text-gray-600">{notice.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                작성일: {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
