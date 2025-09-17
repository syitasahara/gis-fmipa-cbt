// Utility functions for dynamic question randomization
// These functions work with API data dynamically

/**
 * Seeded random number generator for consistent randomization
 * @param {number} seed - The seed for random generation
 * @returns {function} Random function that returns values between 0-1
 */
export function createSeededRandom(seed) {
  let m = 0x80000000; // 2**31
  let a = 1103515245;
  let c = 12345;
  
  seed = seed || Date.now();
  return function() {
    seed = (a * seed + c) % m;
    return seed / (m - 1);
  };
}

/**
 * Shuffle array using Fisher-Yates algorithm with optional seeded random
 * @param {Array} array - Array to shuffle
 * @param {number} seed - Optional seed for consistent randomization
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array, seed = null) {
  if (!Array.isArray(array) || array.length <= 1) {
    return [...array];
  }
  
  const shuffled = [...array];
  const random = seed ? createSeededRandom(seed) : Math.random;
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Generate user-specific seed for consistent randomization
 * @param {string} userId - User ID
 * @param {string} level - Education level (SD, SMP, SMA)
 * @param {string} date - Date string (optional, defaults to today)
 * @returns {number} Generated seed
 */
export function generateUserSeed(userId, level, date = null) {
  const today = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const seedString = `${userId}-${level}-${today}`;
  
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Randomize questions order with user-specific seed
 * @param {Array} questions - Array of questions from API
 * @param {string} userId - User ID for consistent randomization
 * @param {string} level - Education level
 * @returns {Array} Randomized questions
 */
export function randomizeQuestions(questions, userId, level) {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn('Invalid questions array provided to randomizeQuestions');
    return [];
  }
  
  try {
    const seed = generateUserSeed(userId, level);
    console.log(`Randomizing ${questions.length} questions with seed: ${seed}`);
    
    return shuffleArray(questions, seed);
  } catch (error) {
    console.error('Error randomizing questions:', error);
    return questions; // Return original array if randomization fails
  }
}

/**
 * Randomize answers within each question
 * @param {Array} questions - Array of questions with answers
 * @param {string} userId - User ID for consistent randomization
 * @param {string} level - Education level
 * @returns {Array} Questions with randomized answers
 */
export function randomizeAnswers(questions, userId, level) {
  if (!Array.isArray(questions)) {
    console.warn('Invalid questions array provided to randomizeAnswers');
    return [];
  }
  
  try {
    const baseSeed = generateUserSeed(userId, level);
    
    return questions.map((question, questionIndex) => {
      try {
        // Skip if no answers
        if (!question.answers || !Array.isArray(question.answers) || question.answers.length === 0) {
          console.warn(`Question ${question.id || questionIndex} has no valid answers`);
          return {
            ...question,
            answers: question.answers || [],
            opsi: []
          };
        }
        
        // Filter valid answers
        const validAnswers = question.answers.filter(answer => 
          answer && 
          (answer.answer_text || answer.answer_img) &&
          typeof answer === 'object'
        );
        
        if (validAnswers.length === 0) {
          console.warn(`Question ${question.id || questionIndex} has no valid answers after filtering`);
          return {
            ...question,
            answers: [],
            opsi: []
          };
        }
        
        // Use question-specific seed for consistent answer randomization
        const questionSeed = baseSeed + questionIndex + (question.id ? question.id.length : 0);
        const shuffledAnswers = shuffleArray(validAnswers, questionSeed);
        
        return {
          ...question,
          answers: shuffledAnswers,
          opsi: shuffledAnswers.map((answer, answerIdx) => {
            try {
              if (answer.answer_text) {
                return answer.answer_text;
              } else if (answer.answer_img) {
                return answer.answer_img;
              } else {
                console.warn(`Answer at index ${answerIdx} has no text or image`);
                return `Opsi ${answerIdx + 1}`;
              }
            } catch (answerError) {
              console.error('Error processing answer:', answerError);
              return `Opsi ${answerIdx + 1}`;
            }
          })
        };
      } catch (questionError) {
        console.error(`Error processing question ${questionIndex}:`, questionError);
        return {
          ...question,
          answers: question.answers || [],
          opsi: []
        };
      }
    });
  } catch (error) {
    console.error('Error randomizing answers:', error);
    return questions; // Return original questions if randomization fails
  }
}

/**
 * Complete randomization function that randomizes both questions and answers
 * @param {Array} questions - Array of questions from API
 * @param {string} userId - User ID for consistent randomization
 * @param {string} level - Education level
 * @returns {Array} Fully randomized questions with randomized answers
 */
export function randomizeQuestionsAndAnswers(questions, userId, level) {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn('No valid questions provided for randomization');
    return [];
  }
  
  try {
    console.log(`Starting randomization for ${questions.length} questions, user: ${userId}, level: ${level}`);
    
    // Step 1: Randomize question order
    const randomizedQuestions = randomizeQuestions(questions, userId, level);
    
    // Step 2: Randomize answers within each question
    const fullyRandomized = randomizeAnswers(randomizedQuestions, userId, level);
    
    console.log(`Randomization complete. Processed ${fullyRandomized.length} questions`);
    
    return fullyRandomized;
  } catch (error) {
    console.error('Error in complete randomization:', error);
    return questions; // Return original questions if anything fails
  }
}

/**
 * Filter questions by level
 * @param {Array} questions - All questions from API
 * @param {string} level - Education level to filter by
 * @returns {Array} Filtered questions
 */
export function filterQuestionsByLevel(questions, level) {
  if (!Array.isArray(questions)) {
    return [];
  }
  
  return questions.filter(question => 
    question && question.level && question.level.toUpperCase() === level.toUpperCase()
  );
}

/**
 * Validate question structure
 * @param {Object} question - Question object to validate
 * @returns {boolean} True if question is valid
 */
export function validateQuestion(question) {
  if (!question || typeof question !== 'object') {
    return false;
  }
  
  // Check required fields
  if (!question.id || !question.question_text || !question.level) {
    return false;
  }
  
  // Check answers
  if (!question.answers || !Array.isArray(question.answers) || question.answers.length === 0) {
    return false;
  }
  
  // Check if at least one answer is valid
  const validAnswers = question.answers.filter(answer => 
    answer && (answer.answer_text || answer.answer_img)
  );
  
  return validAnswers.length > 0;
}

/**
 * Transform API response to internal format
 * @param {Array} apiQuestions - Questions from API
 * @returns {Array} Transformed questions
 */
export function transformApiQuestions(apiQuestions) {
  if (!Array.isArray(apiQuestions)) {
    console.warn('API response is not an array');
    return [];
  }
  
  return apiQuestions
    .filter(validateQuestion)
    .map((q, index) => {
      try {
        // Keep answers with original fields, no URL transformation needed
        const transformedAnswers = Array.isArray(q.answers) ? q.answers
          .filter(a => a && (a.answer_text || a.answer_img) && typeof a === 'object')
          : [];

        return {
          id: q.id || `question_${index}`,
          pertanyaan: q.question_text || '',
          type: q.type || 'text',
          level: q.level || 'SD',
          question_img: q.question_img || null, // Keep original path for consistent URL building
          question_img_url: q.question_img_url || null, // Keep URL field for reference if needed
          answers: transformedAnswers,
          // Keep original API response for reference
          originalQuestion: q
        };
      } catch (error) {
        console.error(`Error transforming question ${index}:`, error);
        return null;
      }
    })
    .filter(Boolean); // Remove null entries
}
