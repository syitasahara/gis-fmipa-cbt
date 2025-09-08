import ApiTest from '../components/ApiTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">API Test Page</h1>
          <ApiTest />
        </div>
      </div>
    </div>
  );
}
