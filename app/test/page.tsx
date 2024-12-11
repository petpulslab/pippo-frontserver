export default async function TestPage() {
  const response = await fetch("http://localhost:3000/api/notices?lang=en");
  const data = await response.json();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">영어 공지사항 API 테스트</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
