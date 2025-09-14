import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://ujicoba-gis-backend.karyavisual.com/api';

async function proxyRequest(request, endpoint) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullEndpoint = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    console.log(`Proxying ${request.method} request to: ${BACKEND_URL}${fullEndpoint}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
      console.log('Authorization header forwarded');
    } else {
      console.log('No authorization header found');
    }

    const config = {
      method: request.method,
      headers,
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      config.body = await request.text();
      console.log(`Request body: ${config.body}`);
    }

    const response = await fetch(`${BACKEND_URL}${fullEndpoint}`, config);
    const data = await response.text();

    console.log(`Backend response status: ${response.status}`);
    if (!response.ok) {
      console.error(`Backend error: ${data}`);
    }

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Proxy server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const endpoint = `/exam/${params.path.join('/')}`;
  return proxyRequest(request, endpoint);
}

export async function POST(request, { params }) {
  const endpoint = `/exam/${params.path.join('/')}`;
  return proxyRequest(request, endpoint);
}

export async function PUT(request, { params }) {
  const endpoint = `/exam/${params.path.join('/')}`;
  return proxyRequest(request, endpoint);
}

export async function PATCH(request, { params }) {
  const endpoint = `/exam/${params.path.join('/')}`;
  return proxyRequest(request, endpoint);
}

export async function DELETE(request, { params }) {
  const endpoint = `/exam/${params.path.join('/')}`;
  return proxyRequest(request, endpoint);
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
