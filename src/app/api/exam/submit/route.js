import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://gis-backend.karyavisual.com/api';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/exam/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Submit exam failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Submit exam API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
