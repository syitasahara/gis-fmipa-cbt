import { NextResponse } from 'next/server';
import { randomizeQuestionsAndAnswers, filterQuestionsByLevel } from '../../../utils/questionRandomizer';

const BACKEND_URL = 'https://gis-backend.karyavisual.com/api';

// In-memory cache for questions (you can replace this with Redis or database)
let questionsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchAllQuestionsFromBackend() {
  try {
    const response = await fetch(`${BACKEND_URL}/exam/questions`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching questions from backend:', error);
    throw error;
  }
}

async function getCachedQuestions() {
  const now = Date.now();
  const cached = questionsCache.get('all');
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached questions');
    return cached.data;
  }
  
  console.log('Fetching fresh questions from backend');
  const questions = await fetchAllQuestionsFromBackend();
  
  questionsCache.set('all', {
    data: questions,
    timestamp: now
  });
  
  return questions;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const userId = searchParams.get('user_id');
    const randomized = searchParams.get('randomized') === 'true';
    const all = searchParams.get('all') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;

    console.log('Questions API called with params:', {
      level, userId, randomized, all, limit
    });

    // If 'all' parameter is true, get all questions for the level
    if (all) {
      let questions = await getCachedQuestions();
      
      // Filter by level if specified
      if (level) {
        questions = filterQuestionsByLevel(questions, level);
        console.log(`Filtered ${questions.length} questions for level: ${level}`);
      }

      // Apply randomization if requested and userId provided
      if (randomized && userId) {
        questions = randomizeQuestionsAndAnswers(questions, userId, level || 'SD');
        console.log(`Applied randomization for user: ${userId}`);
      }

      // Apply limit if specified
      if (limit && limit > 0) {
        questions = questions.slice(0, limit);
        console.log(`Limited to ${limit} questions`);
      }

      return NextResponse.json(questions);
    }

    // For non-'all' requests, proxy to backend
    const backendUrl = new URL(`${BACKEND_URL}/exam/questions`);
    
    // Forward all search parameters to backend
    searchParams.forEach((value, key) => {
      if (key !== 'all' && key !== 'randomized' && key !== 'user_id') {
        backendUrl.searchParams.set(key, value);
      }
    });

    console.log(`Proxying request to backend: ${backendUrl.toString()}`);

    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Apply client-side randomization if requested
    if (randomized && userId) {
      const randomizedData = randomizeQuestionsAndAnswers(data, userId, level || 'SD');
      return NextResponse.json(randomizedData);
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in questions API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch questions',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
