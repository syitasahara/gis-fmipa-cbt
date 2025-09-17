// Testing and debugging utilities for question randomization
import { questionsAPI } from './api';
import { randomizeQuestionsAndAnswers, generateUserSeed } from './questionRandomizer';

/**
 * Test randomization with different users
 * @param {string} level - Education level (SD, SMP, SMA)
 * @param {Array} testUsers - Array of user IDs to test
 */
export async function testRandomization(level = 'SD', testUsers = ['user1', 'user2', 'user3']) {
  try {
    console.log(`Testing randomization for level: ${level}`);
    
    // Get questions from API
    const questions = await questionsAPI.getAllQuestions(level);
    console.log(`Loaded ${questions.length} questions from API`);
    
    const results = {};
    
    for (const userId of testUsers) {
      const seed = generateUserSeed(userId, level);
      const randomized = randomizeQuestionsAndAnswers(questions, userId, level);
      
      results[userId] = {
        seed,
        questionOrder: randomized.map(q => q.id),
        firstQuestionAnswers: randomized[0]?.answers?.map(a => a.id) || [],
        totalQuestions: randomized.length
      };
      
      console.log(`User ${userId} (seed: ${seed}):`);
      console.log(`  - First 5 question IDs: ${results[userId].questionOrder.slice(0, 5).join(', ')}`);
      console.log(`  - First question answer order: ${results[userId].firstQuestionAnswers.slice(0, 4).join(', ')}`);
    }
    
    // Check if randomization is working (different users should have different orders)
    const allSame = testUsers.every(userId => 
      JSON.stringify(results[userId].questionOrder) === JSON.stringify(results[testUsers[0]].questionOrder)
    );
    
    console.log('\n=== RANDOMIZATION TEST RESULTS ===');
    console.log(`All users have same question order: ${allSame ? 'YES (❌ Problem!)' : 'NO (✅ Good!)'}`);
    
    // Test consistency (same user should get same order)
    const user1FirstRun = randomizeQuestionsAndAnswers(questions, testUsers[0], level);
    const user1SecondRun = randomizeQuestionsAndAnswers(questions, testUsers[0], level);
    
    const consistent = JSON.stringify(user1FirstRun.map(q => q.id)) === 
                     JSON.stringify(user1SecondRun.map(q => q.id));
    
    console.log(`Same user gets consistent order: ${consistent ? 'YES (✅ Good!)' : 'NO (❌ Problem!)'}`);
    
    return results;
    
  } catch (error) {
    console.error('Error testing randomization:', error);
    throw error;
  }
}

/**
 * Debug question structure
 * @param {string} level - Education level
 * @param {number} limit - Number of questions to examine
 */
export async function debugQuestions(level = 'SD', limit = 5) {
  try {
    console.log(`Debugging questions for level: ${level}`);
    
    const questions = await questionsAPI.getAllQuestions(level);
    const limitedQuestions = questions.slice(0, limit);
    
    console.log(`\n=== QUESTION DEBUG INFO ===`);
    console.log(`Total questions available: ${questions.length}`);
    console.log(`Examining first ${limit} questions:`);
    
    limitedQuestions.forEach((q, index) => {
      console.log(`\n--- Question ${index + 1} ---`);
      console.log(`ID: ${q.id}`);
      console.log(`Type: ${q.type}`);
      console.log(`Level: ${q.level}`);
      console.log(`Question: ${q.question_text?.substring(0, 100)}...`);
      console.log(`Has image: ${q.question_img_url ? 'YES' : 'NO'}`);
      console.log(`Answers count: ${q.answers?.length || 0}`);
      
      if (q.answers?.length > 0) {
        console.log(`Answer types:`);
        q.answers.forEach((a, idx) => {
          console.log(`  ${idx + 1}. ${a.type} - ${a.answer_text ? 'Text' : 'Image'} - Correct: ${a.is_correct ? 'YES' : 'NO'}`);
        });
      }
    });
    
    return limitedQuestions;
    
  } catch (error) {
    console.error('Error debugging questions:', error);
    throw error;
  }
}

/**
 * Compare API endpoints
 */
export async function compareAPIEndpoints(level = 'SD') {
  try {
    console.log(`Comparing API endpoints for level: ${level}`);
    
    const regularQuestions = await questionsAPI.getQuestions(level);
    const allQuestions = await questionsAPI.getAllQuestions(level);
    
    console.log(`\n=== API ENDPOINT COMPARISON ===`);
    console.log(`Regular endpoint: ${regularQuestions.length} questions`);
    console.log(`All endpoint: ${allQuestions.length} questions`);
    console.log(`Difference: ${allQuestions.length - regularQuestions.length} additional questions`);
    
    if (regularQuestions.length > 0 && allQuestions.length > 0) {
      const regularIds = new Set(regularQuestions.map(q => q.id));
      const allIds = new Set(allQuestions.map(q => q.id));
      
      const onlyInAll = allQuestions.filter(q => !regularIds.has(q.id));
      const onlyInRegular = regularQuestions.filter(q => !allIds.has(q.id));
      
      console.log(`Questions only in 'all' endpoint: ${onlyInAll.length}`);
      console.log(`Questions only in 'regular' endpoint: ${onlyInRegular.length}`);
    }
    
    return { regularQuestions, allQuestions };
    
  } catch (error) {
    console.error('Error comparing API endpoints:', error);
    throw error;
  }
}

/**
 * Test question loading performance
 */
export async function testPerformance(level = 'SD', iterations = 3) {
  console.log(`Testing performance for level: ${level} (${iterations} iterations)`);
  
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    try {
      const questions = await questionsAPI.getAllQuestions(level);
      const randomized = randomizeQuestionsAndAnswers(questions, `testUser${i}`, level);
      
      const end = performance.now();
      const time = end - start;
      times.push(time);
      
      console.log(`Iteration ${i + 1}: ${time.toFixed(2)}ms (${randomized.length} questions)`);
      
    } catch (error) {
      console.error(`Error in iteration ${i + 1}:`, error);
    }
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`\nAverage time: ${avgTime.toFixed(2)}ms`);
  
  return { times, average: avgTime };
}

// Utility to run all tests
export async function runAllTests(level = 'SD') {
  console.log(`\n🧪 RUNNING ALL TESTS FOR LEVEL: ${level}`);
  console.log('='.repeat(50));
  
  try {
    // Test 1: Basic randomization
    console.log('\n1️⃣ Testing randomization...');
    await testRandomization(level);
    
    // Test 2: Debug questions
    console.log('\n2️⃣ Debugging questions...');
    await debugQuestions(level);
    
    // Test 3: Compare endpoints
    console.log('\n3️⃣ Comparing API endpoints...');
    await compareAPIEndpoints(level);
    
    // Test 4: Performance
    console.log('\n4️⃣ Testing performance...');
    await testPerformance(level);
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Tests failed:', error);
  }
}

// Browser-friendly version for development
if (typeof window !== 'undefined') {
  window.questionTests = {
    testRandomization,
    debugQuestions,
    compareAPIEndpoints,
    testPerformance,
    runAllTests
  };
  
  console.log('Question testing utilities loaded! Use window.questionTests in browser console.');
}
