import GISOfficialAPITest from '@/app/components/GISOfficialAPITest';

export default function TestGISAPIPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <GISOfficialAPITest />
    </div>
  );
}

export const metadata = {
  title: 'GIS Official API Test',
  description: 'Test suite for GIS Official API integration',
};