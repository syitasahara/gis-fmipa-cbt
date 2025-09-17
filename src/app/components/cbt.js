'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, BookOpen, Send, HelpCircle, X, AlertTriangle, Image, Table, CheckCircle, Home, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { questionsAPI, answersAPI, authAPI, isAuthenticated, getCurrentUserId, removeToken } from '../utils/api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { checkExamSchedule, examSchedules } from '../utils/examSchedule';
import { useStartExamProtection, isExamInProgress } from '../utils/examProtection';
import { 
  randomizeQuestionsAndAnswers, 
  transformApiQuestions, 
  filterQuestionsByLevel,
  generateUserSeed 
} from '../utils/questionRandomizer';

const examDuration = 60 * 60 * 1000; // 60 minutes in milliseconds

export default function QuizPage() {
  const router = useRouter();
  const { endExam } = useStartExamProtection();
  
  // Authentication & User state
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent multiple redirects
  
  // Questions & Exam state
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [totalSoal, setTotalSoal] = useState(0);
  
  // Current question state
  const [currentSoal, setCurrentSoal] = useState(1);
  const [jawaban, setJawaban] = useState([]);
  const [raguRagu, setRaguRagu] = useState([]);
  const [userAnswerIds, setUserAnswerIds] = useState([]); // Track backend answer IDs
  
  // Timer & UI state
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [tabChanges, setTabChanges] = useState(0);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showFinalSubmitConfirm, setShowFinalSubmitConfirm] = useState(false);
  const [error, setError] = useState('');

  // Authentication check
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const checkAuth = async () => {
      // Prevent multiple redirects
      if (isRedirecting) {
        console.log('Already redirecting, skipping auth check');
        return;
      }
      
      try {
        // First check if token exists
        if (!isAuthenticated()) {
          console.log('No token found, redirecting to login');
          if (isMounted && !isRedirecting) {
            setIsRedirecting(true);
            router.push('/login');
          }
          return;
        }

        console.log('Token found, verifying with server...');
        
        // Then verify token with server
        const userData = await authAPI.getCurrentUser();
        console.log('User data loaded successfully:', userData);
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        
        // If auth fails, clear token and redirect to login
        removeToken();
        
        // Clear exam protection if auth fails
        if (typeof document !== 'undefined') {
          document.cookie = 'examStarted=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'examStartTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'examEndTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        if (typeof window !== 'undefined') {
          localStorage.removeItem('examStarted');
          localStorage.removeItem('examStartTime');
          localStorage.removeItem('examEndTime');
        }
        
        // Add a delay to prevent infinite redirect loops
        if (isMounted && !isRedirecting) {
          setIsRedirecting(true);
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        }
        return;
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false; // Cleanup function
    };
  }, [router, isRedirecting]);

  // Pencegahan navigasi browser dan tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isExamInProgress()) {
        e.preventDefault();
        e.returnValue = 'Ujian sedang berlangsung. Yakin ingin meninggalkan halaman?';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isExamInProgress()) {
        // User meninggalkan tab
        const currentViolations = parseInt(getCookie('violations') || '0');
        const newViolations = currentViolations + 1;
        setCookie('violations', newViolations.toString());
        setViolations(newViolations);
        
        if (newViolations >= 3) {
          setShowCheatingWarning(true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Check exam schedule
  const checkSchedule = (jenjang) => checkExamSchedule(jenjang);

  // Seeded random function for consistent randomization
  const seededRandom = (seed) => {
    let m = 0x80000000; // 2**31
    let a = 1103515245;
    let c = 12345;
    
    return function() {
      seed = (a * seed + c) % m;
      return seed / (m - 1);
    };
  };

  // Cookie-based doubt management
  const saveRaguRaguToCookie = (raguArray) => {
    if (!user) return;
    const cookieKey = `ragu_ragu_${user.id}_${user.jenjang}`;
    setCookie(cookieKey, JSON.stringify(raguArray), 7); // Expire in 7 days
  };

  const loadRaguRaguFromCookie = (questionsLength) => {
    if (!user) return Array(questionsLength).fill(false);
    const cookieKey = `ragu_ragu_${user.id}_${user.jenjang}`;
    const savedRagu = getCookie(cookieKey);
    if (savedRagu) {
      try {
        const parsed = JSON.parse(savedRagu);
        // Ensure array length matches current questions
        if (Array.isArray(parsed) && parsed.length === questionsLength) {
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing ragu-ragu from cookie:', error);
      }
    }
    return Array(questionsLength).fill(false);
  };

  // Get or create consistent seed for this user session
  const getUserSeed = () => {
    const sessionKey = `exam_seed_${user?.id}_${user?.jenjang}`;
    let seed = localStorage.getItem(sessionKey);
    
    if (!seed) {
      // Create new seed based on user ID and current date (so it's different each day)
      const today = new Date().toDateString();
      seed = `${user?.id || 'guest'}_${today}`.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      // Ensure positive number
      seed = Math.abs(seed);
      localStorage.setItem(sessionKey, seed.toString());
    }
    
    return parseInt(seed);
  };

  // Fisher-Yates shuffle algorithm with seeded random
  const shuffleArraySeeded = (array, seed) => {
    const shuffled = [...array];
    const random = seededRandom(seed);
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      if (!user) return;

      // Check exam schedule first
      const scheduleCheck = checkSchedule(user.jenjang);
      if (!scheduleCheck.allowed) {
        setError(scheduleCheck.message);
        setIsLoadingQuestions(false);
        return;
      }

      try {
        setIsLoadingQuestions(true);
        
        // Get all questions for the user's level dynamically from API
        console.log(`Loading questions for level: ${user.jenjang}`);
        const questionsData = await questionsAPI.getAllQuestions(user.jenjang);
        
        console.log('Raw questions data from API:', questionsData);
        
        // Validate questions data
        if (!Array.isArray(questionsData)) {
          throw new Error('Questions data is not an array');
        }

        if (questionsData.length === 0) {
          throw new Error(`No questions found for level: ${user.jenjang}`);
        }
        
        // Transform API data to internal format using the new utility
        const transformedQuestions = transformApiQuestions(questionsData);
        
        console.log('Transformed questions:', transformedQuestions);

        if (transformedQuestions.length === 0) {
          throw new Error('No valid questions after transformation');
        }

        // Get user ID for consistent randomization
        const userId = getCurrentUserId() || user.id || user.email || 'anonymous';
        
        // Apply dynamic randomization based on user and level
        const randomizedQuestions = randomizeQuestionsAndAnswers(
          transformedQuestions, 
          userId, 
          user.jenjang
        );

        console.log('Dynamically randomized questions:', randomizedQuestions);

        // Update state with randomized questions
        setQuestions(randomizedQuestions);
        setTotalSoal(randomizedQuestions.length);
        setJawaban(Array(randomizedQuestions.length).fill(null));
        
        // Load ragu-ragu from cookies
        const savedRaguRagu = loadRaguRaguFromCookie(randomizedQuestions.length);
        setRaguRagu(savedRaguRagu);
        
        setUserAnswerIds(Array(randomizedQuestions.length).fill(null));

        // Load existing user answers if any
        await loadUserAnswers(randomizedQuestions);
        
        console.log(`Successfully loaded and randomized ${randomizedQuestions.length} questions for user ${userId}, level ${user.jenjang}`);
        
      } catch (error) {
        console.error('Error loading questions:', error);
        setError(`Gagal memuat soal ujian: ${error.message}. Silakan refresh halaman.`);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [user]);

  // Load existing user answers
  const loadUserAnswers = useCallback(async (questionsData) => {
    if (!user) return;

    try {
      let userId = getCurrentUserId();
      
      // If getting userId from token fails, try to get it from user object
      if (!userId && user && user.id) {
        userId = user.id;
      }
      
      if (!userId) return;

      const userAnswers = await answersAPI.getUserAnswers(userId);
      
      // Map existing answers to frontend state
      userAnswers.forEach(answer => {
        const questionIndex = questionsData.findIndex(q => q.id === answer.question_id);
        if (questionIndex !== -1) {
          const answerIndex = questionsData[questionIndex].answers.findIndex(a => a.id === answer.answer_id);
          if (answerIndex !== -1) {
            setJawaban(prev => {
              const updated = [...prev];
              updated[questionIndex] = answerIndex;
              return updated;
            });
            setRaguRagu(prev => {
              const updated = [...prev];
              updated[questionIndex] = answer.is_doubtful || false;
              return updated;
            });
            setUserAnswerIds(prev => {
              const updated = [...prev];
              updated[questionIndex] = answer.id;
              return updated;
            });
          }
        }
      });
    } catch (error) {
      console.error('Error loading user answers:', error);
    }
  }, [user]);  

  // Refetch answers from server to ensure synchronization
  const refetchAnswers = async () => {
    setIsRefetching(true);
    try {
      let userId = getCurrentUserId();
      if (!userId && user && user.id) {
        userId = user.id;
      }
      
      if (!userId) return;

      console.log('REFETCH: Getting latest answers from server for user:', userId);
      const userAnswers = await answersAPI.getUserAnswers(userId);
      
      console.log('REFETCH: Got answers from server:', userAnswers);
      
      // Reset jawaban and IDs, but preserve ragu-ragu from cookies
      const resetJawaban = Array(questions.length).fill(null);
      const resetIds = Array(questions.length).fill(null);
      // Keep ragu-ragu from cookies instead of server
      const preservedRagu = loadRaguRaguFromCookie(questions.length);
      
      // Map server answers to frontend state
      userAnswers.forEach(answer => {
        const questionIndex = questions.findIndex(q => q.id === answer.question_id);
        if (questionIndex !== -1) {
          const answerIndex = questions[questionIndex].answers.findIndex(a => a.id === answer.answer_id);
          if (answerIndex !== -1) {
            resetJawaban[questionIndex] = answerIndex;
            resetIds[questionIndex] = answer.id;
          }
        }
      });
      
      // Update states - preserving ragu-ragu from cookies
      setJawaban(resetJawaban);
      setRaguRagu(preservedRagu); // Use cookie data instead of server data
      setUserAnswerIds(resetIds);
      
      console.log('REFETCH: Local state synced with server data');
      
    } catch (error) {
      console.error('Error refetching answers from server:', error);
    } finally {
      setIsRefetching(false);
    }
  };

  // Initialize violations from cookies
  useEffect(() => {
    const savedViolations = getCookie('violations');
    if (savedViolations) {
      setViolations(parseInt(savedViolations));
    }
  }, []);

  // Handle visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => {
          const newCount = prev + 1;
          setCookie('violations', newCount);
          if (newCount >= 5) {
            // Show cheating warning first
            setShowCheatingWarning(true);
          } else {
            setShowWarning(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto-refresh when exam hasn't started yet
  useEffect(() => {
    if (error && error.includes('dimulai')) {
      const interval = setInterval(() => {
        if (user) {
          const scheduleCheck = checkSchedule(user.jenjang);
          if (scheduleCheck.allowed) {
            // Exam time has started, reload the page
            window.location.reload();
          }
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [error, user]);

  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(true);
    setTimeout(() => {
      kirimJawaban(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleTimeUp]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle answer submission with API
  // Loading state for answer submission
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [submittingQuestionIndex, setSubmittingQuestionIndex] = useState(null);
  const [pendingAnswerIndex, setPendingAnswerIndex] = useState(null); // Track which option is being submitted
  const [isRefetching, setIsRefetching] = useState(false); // Track refetch status

  const handleJawab = async (index) => {
    const currentQuestion = questions[currentSoal - 1];
    if (!currentQuestion) return;

    const selectedAnswer = currentQuestion.answers[index];
    if (!selectedAnswer) return;

    // Set loading state
    setIsSubmittingAnswer(true);
    setSubmittingQuestionIndex(currentSoal - 1);
    setPendingAnswerIndex(index);
    setError(''); // Clear any previous errors

    try {
      let userId = getCurrentUserId();
      
      // If getting userId from token fails, try to get it from user object
      if (!userId && user && user.id) {
        userId = user.id;
      }
      
      if (!userId) throw new Error('User ID not found');

      console.log('STEP 1: Submitting answer to server FIRST:', {
        userId,
        questionId: currentQuestion.id,
        answerId: selectedAnswer.id,
        questionNumber: currentSoal,
        selectedIndex: index
      });

      // If there's an existing answer, delete it first
      const existingAnswerId = userAnswerIds[currentSoal - 1];
      if (existingAnswerId) {
        console.log('Deleting existing answer:', existingAnswerId);
        await answersAPI.cancelAnswer(existingAnswerId);
      }

      // STEP 1: Submit new answer to server FIRST
      const response = await answersAPI.submitAnswer(
        userId,
        currentQuestion.id,
        selectedAnswer.id
      );

      console.log('STEP 2: Server confirmed answer saved:', response);

      // STEP 3: Update answer ID tracking immediately for this question
      const updatedIds = [...userAnswerIds];
      updatedIds[currentSoal - 1] = response.id || null;
      setUserAnswerIds(updatedIds);

      // STEP 4: Fetch latest data from server to ensure full synchronization
      console.log('STEP 3: Fetching latest data from server...');
      await refetchAnswers();

      console.log('STEP 4: Local state fully synced with server after save and refetch');

    } catch (error) {
      console.error('Error submitting answer to server:', error);
      setError(`Gagal menyimpan jawaban ke server: ${error.message || 'Silakan coba lagi.'}`);
      
      // Don't update local state if server save failed
      console.log('Local state NOT updated due to server error');
    } finally {
      // Clear loading state
      setIsSubmittingAnswer(false);
      setSubmittingQuestionIndex(null);
      setPendingAnswerIndex(null);
    }
  };

  // Toggle ragu-ragu (save to cookie for persistence)
  const toggleRaguRagu = () => {
    if (jawaban[currentSoal - 1] === null) return;

    console.log('Toggling doubt (with cookie persistence) for question:', currentSoal);
    
    // Update UI state and save to cookie
    const updated = [...raguRagu];
    updated[currentSoal - 1] = !updated[currentSoal - 1];
    setRaguRagu(updated);
    
    // Save to cookies for persistence
    saveRaguRaguToCookie(updated);
    
    console.log('Doubt status changed and saved to cookie:', updated[currentSoal - 1] ? 'marked as doubtful' : 'unmarked');
  };

  // Cancel answer with API
  const batalkanJawaban = async () => {
    const answerId = userAnswerIds[currentSoal - 1];
    console.log('Canceling answer for answerId:', answerId, 'for question:', currentSoal);
    
    if (!answerId) {
      setError('Tidak dapat membatalkan jawaban. ID jawaban tidak ditemukan.');
      return;
    }

    try {
      await answersAPI.cancelAnswer(answerId);

      const updatedJawaban = [...jawaban];
      const updatedRagu = [...raguRagu];
      const updatedIds = [...userAnswerIds];
      
      updatedJawaban[currentSoal - 1] = null;
      updatedRagu[currentSoal - 1] = false;
      updatedIds[currentSoal - 1] = null;
      
      setJawaban(updatedJawaban);
      setRaguRagu(updatedRagu);
      setUserAnswerIds(updatedIds);
      
      // Save updated ragu-ragu to cookies
      saveRaguRaguToCookie(updatedRagu);
      
      console.log('Answer canceled successfully for answerId:', answerId);
    } catch (error) {
      console.error('Error canceling answer:', error);
      
      // Fallback: Update UI optimistically even if API fails
      const updatedJawaban = [...jawaban];
      const updatedRagu = [...raguRagu];
      const updatedIds = [...userAnswerIds];
      
      updatedJawaban[currentSoal - 1] = null;
      updatedRagu[currentSoal - 1] = false;
      updatedIds[currentSoal - 1] = null;
      
      setJawaban(updatedJawaban);
      setRaguRagu(updatedRagu);
      setUserAnswerIds(updatedIds);
      
      // Save updated ragu-ragu to cookies
      saveRaguRaguToCookie(updatedRagu);
      
      setError(`Jawaban dibatalkan locally (server error: ${error.message || 'Unknown'})`);
    }
  };

  const nextSoal = () => {
    if (currentSoal < totalSoal) setCurrentSoal(currentSoal + 1);
  };

  const prevSoal = () => {
    if (currentSoal > 1) setCurrentSoal(currentSoal - 1);
  };

  const handleSubmitAttempt = () => {
    const hasRagu = raguRagu.some(r => r === true);
    if (hasRagu) {
      setShowSubmitWarning(true);
    } else {
      setShowFinalSubmitConfirm(true);
    }
  };

  // Final submission with results calculation
  const kirimJawaban = async (isAutoSubmit) => {
    setIsSubmitting(true);
    
    try {
      let userId = getCurrentUserId();
      
      // If getting userId from token fails, try to get it from user object
      if (!userId && user && user.id) {
        userId = user.id;
        console.log('Using userId from user object:', userId, typeof userId);
      }
      
      if (!userId) throw new Error('User ID not found');
      
      console.log('Submitting exam for userId:', userId, typeof userId);

      // Calculate duration
      const usedDuration = examDuration - timeLeft;
      const durationInMinutes = Math.floor(usedDuration / 60000); // Convert to minutes
      
      // Get violations count from cookie
      const totalViolations = parseInt(getCookie('violations') || '0');
      
      // Submit exam data first
      try {
        await answersAPI.submitExam(userId, {
          durationInMinutes,
          totalViolations,
          isAutoSubmit
        });
      } catch (submitError) {
        console.warn('Failed to submit exam data:', submitError);
        // Continue to get results even if submit fails
      }
      
      // Get final results from backend
      const results = await answersAPI.getResults(userId);
      
      const terjawab = jawaban.filter(j => j !== null).length;
      const ragu = raguRagu.filter(r => r === true).length;
      
      // Prepare submission result with backend data
      const result = {
        totalQuestions: totalSoal,
        answered: results.correct + results.wrong || terjawab,
        unanswered: results.unanswered || (totalSoal - terjawab),
        marked: ragu,
        correct: results.correct || 0,
        wrong: results.wrong || 0,
        score: results.score || 0,
        durationInMinutes,
        totalViolations,
        isAutoSubmit,
        timestamp: new Date().toLocaleString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      };
      
      setSubmissionResult(result);
      
      // Akhiri proteksi ujian
      endExam();
      
      // Show success modal after processing and clear local storage
      setTimeout(() => {
        setIsSubmitting(false);
        if (isAutoSubmit) setShowTimeUpModal(false);
        if (showSubmitWarning) setShowSubmitWarning(false);
        setShowSuccessModal(true);
        
        // Clear localStorage and cookies - including auth token and randomization seed
        localStorage.clear();
        deleteCookie('violations');
        
        // Specifically clear exam seed for this user
        if (user?.id && user?.jenjang) {
          const sessionKey = `exam_seed_${user.id}_${user.jenjang}`;
          localStorage.removeItem(sessionKey);
        }
        
        // Ensure auth token is completely removed
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        
        setTimeout(() => {
          router.push('/login');
        }, 3000); // Increased to 3 seconds to let user see results
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      
      // Fallback to local calculation if backend fails
      const terjawab = jawaban.filter(j => j !== null).length;
      const ragu = raguRagu.filter(r => r === true).length;
      
      const result = {
        totalQuestions: totalSoal,
        answered: terjawab,
        unanswered: totalSoal - terjawab,
        marked: ragu,
        isAutoSubmit,
        timestamp: new Date().toLocaleString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      };
      
      setSubmissionResult(result);
      setError('Gagal menghitung hasil dari server, menampilkan hasil lokal.');
      
      // Akhiri proteksi ujian meskipun error
      endExam();
      
      setTimeout(() => {
        setIsSubmitting(false);
        if (isAutoSubmit) setShowTimeUpModal(false);
        if (showSubmitWarning) setShowSubmitWarning(false);
        setShowSuccessModal(true);
        
        // Clear localStorage and cookies even in error case
        localStorage.clear();
        deleteCookie('violations');
        
        // Specifically clear exam seed for this user
        if (user?.id && user?.jenjang) {
          const sessionKey = `exam_seed_${user.id}_${user.jenjang}`;
          localStorage.removeItem(sessionKey);
        }
        
        // Ensure auth token is completely removed
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        
        // Redirect to login after showing results
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }, 1000);
    }
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    
    // Akhiri proteksi ujian
    endExam();
    
    // Clear all auth data before going to home
    localStorage.clear();
    deleteCookie('violations');
    
    // Ensure auth token is completely removed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    
    router.push('/login'); // Redirect to login instead of home since user is logged out
  };

  const terjawab = jawaban.filter(j => j !== null).length;
  const ragu = raguRagu.filter(r => r === true).length;
  const progress = totalSoal > 0 ? (terjawab / totalSoal) * 100 : 0;

  const getStatusSoal = (index) => {
    if (jawaban[index] !== null && raguRagu[index]) return 'ragu';
    if (jawaban[index] !== null) return 'dijawab';
    return 'belum';
  };

  const getStatusText = () => {
    if (jawaban[currentSoal - 1] !== null && raguRagu[currentSoal - 1]) return 'Ragu-ragu';
    if (jawaban[currentSoal - 1] !== null) return 'Terjawab';
    return 'Belum Dijawab';
  };

  const getStatusColor = () => {
    if (jawaban[currentSoal - 1] !== null && raguRagu[currentSoal - 1]) return 'bg-amber-100 text-amber-800';
    if (jawaban[currentSoal - 1] !== null) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  const currentQuestion = questions[currentSoal - 1];

  // Show loading screen while authenticating or loading questions
  if (isLoadingAuth || isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isLoadingAuth ? 'Memverifikasi akun...' : 'Memuat soal ujian...'}
          </h2>
          <p className="text-gray-600">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Show error if no questions loaded or schedule not allowed
  if (!isLoadingQuestions && (questions.length === 0 || error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error && error.includes('dimulai') ? 'Ujian Belum Dimulai' : 
             error && error.includes('berakhir') ? 'Ujian Telah Berakhir' : 
             'Tidak Ada Soal'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'Belum ada soal ujian yang tersedia untuk jenjang Anda.'}
          </p>
          {error && error.includes('dimulai') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-700 text-sm">
                Halaman ini akan secara otomatis refresh setiap 30 detik untuk memeriksa waktu ujian.
              </p>
            </div>
          )}
          <button 
            onClick={() => {
              // Clear auth token when going back
              localStorage.clear();
              if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
              }
              router.push('/login');
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  // Don't render main content if no current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Memuat soal...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Warning Modals */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-3 text-gray-800">Peringatan!</h2>
            <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">
              Anda telah meninggalkan halaman ujian {violations} kali. Jika melakukan ini lebih dari 5x, Anda akan didiskualifikasi.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowWarning(false)}
                className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheatingWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-3 text-gray-800">Pelanggaran!</h2>
            <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">
              Anda telah meninggalkan halaman ujian 5 kali!
            </p>
            <p className="text-red-600 mb-4 text-center font-semibold text-sm sm:text-base">
              Anda akan didiskualifikasi dan ujian akan diakhiri.
            </p>
            <p className="text-gray-700 mb-6 text-center text-xs sm:text-sm">
              Data jawaban Anda akan disimpan dan dikirim secara otomatis.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setShowCheatingWarning(false);
                  kirimJawaban(true);
                }}
                className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-3 text-gray-800">Ada Jawaban Ragu-ragu!</h2>
            <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">
              Anda memiliki {ragu} soal yang ditandai ragu-ragu. Yakin ingin melanjutkan?
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowSubmitWarning(false)}
                className="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Periksa Lagi
              </button>
              <button 
                onClick={() => kirimJawaban(false)}
                className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
              >
                Kirim Saja
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-3 text-gray-800">Waktu Habis!</h2>
            <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">
              Waktu ujian telah berakhir. Jawaban Anda akan otomatis dikirim.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && submissionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-emerald-600">
              Jawaban Berhasil Dikirim!
            </h2>
            
            <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 mb-4 border border-emerald-100">
              <div className="text-center text-xs sm:text-sm text-emerald-700 mb-2">
                {submissionResult.isAutoSubmit ? 'Waktu ujian telah habis. Jawaban otomatis dikirim.' : 'Jawaban Anda telah berhasil dikirimkan.'}
              </div>
              <div className="text-xs text-emerald-600 text-center">
                {submissionResult.timestamp}
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Total Soal:</span>
                <span className="font-medium text-gray-600">{submissionResult.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Terjawab:</span>
                <span className="font-medium text-emerald-600">{submissionResult.answered}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Belum Dijawab:</span>
                <span className="font-medium text-amber-600">{submissionResult.unanswered}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Ditandai Ragu-ragu:</span>
                <span className="font-medium text-amber-600">{submissionResult.marked}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleBackToHome}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Login</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submit Confirmation Modal */}
      {showFinalSubmitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay transparan agar klik di luar modal menutup modal */}
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setShowFinalSubmitConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-4 sm:p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Kirim Jawaban?</h2>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Yakin ingin mengirim jawaban? Jawaban yang sudah dikirim tidak dapat diubah lagi.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowFinalSubmitConfirm(false)}
                className="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowFinalSubmitConfirm(false);
                  kirimJawaban(false);
                }}
                className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Gebyar Ilmiah Sains</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Science Competition - {user?.jenjang || ''} 
                  {user?.jenjang && examSchedules[user.jenjang] && 
                    ` (${examSchedules[user.jenjang].startTime} - ${examSchedules[user.jenjang].endTime})`
                  }
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              {user && (
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700 truncate max-w-[120px] sm:max-w-none">{user.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="font-medium text-purple-700 text-sm sm:text-base">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start sm:items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-red-700 text-sm flex-1">{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">{/* Main Question Area */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-purple-600">{terjawab}/{totalSoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 text-sm text-gray-600 gap-1 sm:gap-0">
                <span>
                  Ragu-ragu: {
                    jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length
                  }
                </span>
                <span>Belum dijawab: {totalSoal - terjawab}</span>
              </div>
              
              {/* Saving Status Indicator */}
              {isSubmittingAnswer && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-blue-700 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Menyimpan jawaban ke server dulu, mohon tunggu...</span>
                  </div>
                </div>
              )}
              
              {/* Refetching Status Indicator */}
              {isRefetching && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-700 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Mengambil data terbaru dari server...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3 flex-wrap">
                  <div className="bg-purple-100 text-purple-600 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base">
                    Soal {currentSoal}
                  </div>
                  <div className="text-gray-500 text-sm sm:text-base">dari {totalSoal}</div>
                  <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                    {currentQuestion.type === 'image' && (
                      <>
                        <Image className="w-4 h-4 mr-1" />
                        <span>Gambar</span>
                      </>
                    )}
                    {currentQuestion.type === 'table' && (
                      <>
                        <Table className="w-4 h-4 mr-1" />
                        <span>Tabel</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                {currentQuestion.pertanyaan}
              </h2>

              {console.log("currentQuestion", currentQuestion)}

              {currentQuestion.type == 'image' && (
                <div className="mb-4 sm:mb-6 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={`https://gis-backend.karyavisual.com/gis-backend-v5/storage/app/public/${currentQuestion.question_img}`} 
                    alt="Gambar soal" 
                    className="w-full h-auto object-contain max-h-[300px] sm:max-h-[400px]" 
                    onError={(e) => {
                      console.error('Failed to load question image:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-red-500 text-sm italic p-4 text-center">
                    Gambar tidak dapat dimuat
                  </div>
                </div>
              )}


              <div className="space-y-3 mb-8">
                {currentQuestion.opsi.map((opsi, idx) => {
                  const isSelected = jawaban[currentSoal - 1] === idx;
                  const isPending = isSubmittingAnswer && submittingQuestionIndex === currentSoal - 1 && pendingAnswerIndex === idx;
                  const isDisabled = (isSubmittingAnswer && submittingQuestionIndex === currentSoal - 1) || isRefetching;
                  
                  // Check if answer is an image by looking at the original answer data
                  const originalAnswer = currentQuestion.answers && currentQuestion.answers[idx];
                  const isImageAnswer = originalAnswer && originalAnswer.answer_img && originalAnswer.type === 'image';
                  const isTextAnswer = originalAnswer && originalAnswer.answer_text && originalAnswer.type === 'text';
                  
                  return (
                    <label key={idx} className="block">
                      <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : isPending
                          ? 'border-blue-400 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-gray-100'
                      } ${isDisabled ? 'opacity-70 cursor-wait' : ''}`}>
                        <div className={`flex items-${isImageAnswer ? 'start' : 'center'} space-x-4`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500'
                              : isPending
                              ? 'border-blue-400 bg-blue-400'
                              : 'border-gray-300'
                          } ${isImageAnswer ? 'mt-1' : ''}`}>
                            {isPending ? (
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            ) : isSelected ? (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            ) : null}
                          </div>
                          
                          {/* Content container */}
                          <div className={`flex-1 ${isImageAnswer ? '' : 'flex items-center space-x-3'}`}>
                            {/* Label and Text Content */}
                            <div className={`flex items-center space-x-3 ${isImageAnswer ? 'mb-2' : ''}`}>
                              <span className={`font-bold text-lg ${
                                isSelected ? 'text-purple-600' : isPending ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              
                              {/* Display text content (either from answer_text or fallback to opsi) */}
                              {!isImageAnswer && (
                                <span className={`text-lg ${
                                  isSelected ? 'text-gray-800 font-medium' : isPending ? 'text-blue-800 font-medium' : 'text-gray-700'
                                }`}>
                                  {isTextAnswer ? originalAnswer.answer_text : opsi}
                                </span>
                              )}
                            </div>
                            
                            {/* Image Content */}
                            {isImageAnswer && (
                              <div className="w-full max-w-md">
                                <img 
                                  src={`https://gis-backend.karyavisual.com/gis-backend-v5/storage/app/public/${originalAnswer.answer_img}`}
                                  alt={`Jawaban ${String.fromCharCode(65 + idx)}`}
                                  className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    console.error('Failed to load answer image:', e.target.src);
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                  }}
                                />
                                <div className="hidden text-red-500 text-sm italic">
                                  Gambar tidak dapat dimuat: {originalAnswer.answer_img}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Status indicators */}
                          {isPending && (
                            <div className="flex items-center text-blue-600 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              <span className="hidden sm:inline">Menyimpan ke server...</span>
                            </div>
                          )}
                          {isRefetching && isSelected && (
                            <div className="flex items-center text-green-600 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              <span className="hidden sm:inline">Sinkronisasi...</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`soal-${currentSoal}`}
                          checked={isSelected}
                          onChange={() => handleJawab(idx)}
                          disabled={isDisabled}
                          className="sr-only"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-100">
                <button
                  onClick={toggleRaguRagu}
                  disabled={jawaban[currentSoal - 1] === null}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    jawaban[currentSoal - 1] === null
                      ? 'bg-amber-100 text-amber-300 cursor-not-allowed'
                      : raguRagu[currentSoal - 1]
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {raguRagu[currentSoal - 1] ? 'Hapus Ragu-ragu' : 'Tandai Ragu-ragu'}
                  </span>
                  <span className="sm:hidden">
                    {raguRagu[currentSoal - 1] ? 'Hapus Ragu' : 'Ragu-ragu'}
                  </span>
                </button>

                {jawaban[currentSoal - 1] !== null && (
                  <button
                    onClick={batalkanJawaban}
                    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Batalkan Jawaban</span>
                    <span className="sm:hidden">Batalkan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevSoal}
                disabled={currentSoal === 1}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                  currentSoal === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <button
                onClick={nextSoal}
                disabled={currentSoal === totalSoal}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                  currentSoal === totalSoal
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            {/* Question Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">Daftar Soal</h3>
              
              <div className="grid grid-cols-8 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-5 gap-1 sm:gap-2 mb-3 sm:mb-4">
                {Array.from({ length: totalSoal }, (_, i) => {
                  const status = getStatusSoal(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentSoal(i + 1)}
                      disabled={showSuccessModal}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-105 relative ${
                        currentSoal === i + 1
                          ? 'bg-purple-600 text-white shadow-lg'
                          : status === 'ragu'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : status === 'dijawab'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      } ${showSuccessModal ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {i + 1}
                      {status === 'ragu' && (
                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full border border-white sm:border-2"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Sudah Dijawab ({terjawab - jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length})
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded relative">
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Ragu-ragu ({jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length})
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Belum Dijawab ({totalSoal - terjawab})</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-600 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Soal Aktif</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <button
                onClick={handleSubmitAttempt}
                disabled={isSubmitting || showSuccessModal}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}</span>
              </button>
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                Pastikan semua jawaban sudah benar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}