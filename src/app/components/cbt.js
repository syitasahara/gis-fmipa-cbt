'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, BookOpen, Send, HelpCircle, X, AlertTriangle, Image, Table, CheckCircle, Home, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { questionsAPI, answersAPI, authAPI, isAuthenticated, getCurrentUserId } from '../utils/api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { checkExamSchedule, examSchedules } from '../utils/examSchedule';

const examDuration = 60 * 60 * 1000; // 60 minutes in milliseconds

export default function QuizPage() {
  const router = useRouter();
  
  // Authentication & User state
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
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
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
        return;
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Check exam schedule
  const checkSchedule = (jenjang) => checkExamSchedule(jenjang);

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
        const questionsData = await questionsAPI.getQuestions(user.jenjang);
        
        // Transform backend data to frontend format
        const transformedQuestions = questionsData.map(q => ({
          id: q.id,
          pertanyaan: q.question_text || '',
          type: q.type,
          question_img_url: q.question_img || null,
          answers: q.answers || [],
          opsi: q.answers?.map(a => a.answer_text || a.answer_img || '') || []
        }));

        setQuestions(transformedQuestions);
        setTotalSoal(transformedQuestions.length);
        setJawaban(Array(transformedQuestions.length).fill(null));
        setRaguRagu(Array(transformedQuestions.length).fill(false));
        setUserAnswerIds(Array(transformedQuestions.length).fill(null));

        // Load existing user answers if any
        await loadUserAnswers(transformedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        setError('Gagal memuat soal ujian. Silakan refresh halaman.');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [user]);

  // Load existing user answers
  const loadUserAnswers = async (questionsData) => {
    if (!user) return;

    try {
      const userId = getCurrentUserId();
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
  };  // Handle timer
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
  }, []);

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

  const handleTimeUp = () => {
    setShowTimeUpModal(true);
    setTimeout(() => {
      kirimJawaban(true);
    }, 3000);
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle answer submission with API
  const handleJawab = async (index) => {
    const currentQuestion = questions[currentSoal - 1];
    if (!currentQuestion) return;

    const selectedAnswer = currentQuestion.answers[index];
    if (!selectedAnswer) return;

    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User ID not found');

      // If there's an existing answer, delete it first
      const existingAnswerId = userAnswerIds[currentSoal - 1];
      if (existingAnswerId) {
        await answersAPI.cancelAnswer(existingAnswerId);
      }

      // Submit new answer
      const response = await answersAPI.submitAnswer(
        userId,
        currentQuestion.id,
        selectedAnswer.id
      );

      // Update local state
      const updated = [...jawaban];
      updated[currentSoal - 1] = index;
      setJawaban(updated);

      // Update answer ID tracking
      const updatedIds = [...userAnswerIds];
      updatedIds[currentSoal - 1] = response.id || null;
      setUserAnswerIds(updatedIds);

    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Gagal menyimpan jawaban. Silakan coba lagi.');
    }
  };

  // Toggle ragu-ragu with API
  const toggleRaguRagu = async () => {
    if (jawaban[currentSoal - 1] === null) return;

    const answerId = userAnswerIds[currentSoal - 1];
    if (!answerId) return;

    try {
      await answersAPI.toggleDoubt(answerId);

      const updated = [...raguRagu];
      updated[currentSoal - 1] = !updated[currentSoal - 1];
      setRaguRagu(updated);
    } catch (error) {
      console.error('Error toggling doubt:', error);
      setError('Gagal mengubah status ragu-ragu. Silakan coba lagi.');
    }
  };

  // Cancel answer with API
  const batalkanJawaban = async () => {
    const answerId = userAnswerIds[currentSoal - 1];
    if (!answerId) return;

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
    } catch (error) {
      console.error('Error canceling answer:', error);
      setError('Gagal membatalkan jawaban. Silakan coba lagi.');
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
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User ID not found');

      // Calculate duration
      const usedDuration = examDuration - timeLeft;
      const durationInMinutes = Math.floor(usedDuration / 60000); // Convert to minutes
      
      // Get violations count from cookie
      const totalViolations = parseInt(getCookie('violations') || '0');
      
      // Get final results from backend with additional data
      const payload = {
        userId,
        durationInMinutes,
        totalViolations,
        isAutoSubmit
      };
      
      const results = await answersAPI.getResults(payload);
      
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
      
      // Show success modal after processing and clear local storage
      setTimeout(() => {
        setIsSubmitting(false);
        if (isAutoSubmit) setShowTimeUpModal(false);
        if (showSubmitWarning) setShowSubmitWarning(false);
        setShowSuccessModal(true);
        
        // Clear localStorage and cookies - including auth token
        localStorage.clear();
        deleteCookie('violations');
        
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
      
      setTimeout(() => {
        setIsSubmitting(false);
        if (isAutoSubmit) setShowTimeUpModal(false);
        if (showSubmitWarning) setShowSubmitWarning(false);
        setShowSuccessModal(true);
        
        // Clear localStorage and cookies even in error case
        localStorage.clear();
        deleteCookie('violations');
        
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Peringatan!</h2>
            <p className="text-gray-700 mb-4 text-center">
              Anda telah meninggalkan halaman ujian {violations} kali. Jika melakukan ini lebih dari 5x, Anda akan didiskualifikasi.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowWarning(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheatingWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Pelanggaran!</h2>
            <p className="text-gray-700 mb-4 text-center">
              Anda telah meninggalkan halaman ujian 5 kali!
            </p>
            <p className="text-red-600 mb-4 text-center font-semibold">
              Anda akan didiskualifikasi dan ujian akan diakhiri.
            </p>
            <p className="text-gray-700 mb-6 text-center text-sm">
              Data jawaban Anda akan disimpan dan dikirim secara otomatis.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setShowCheatingWarning(false);
                  kirimJawaban(true);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Ada Jawaban Ragu-ragu!</h2>
            <p className="text-gray-700 mb-4 text-center">
              Anda memiliki {ragu} soal yang ditandai ragu-ragu. Yakin ingin melanjutkan?
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowSubmitWarning(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Periksa Lagi
              </button>
              <button 
                onClick={() => kirimJawaban(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Kirim Saja
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Waktu Habis!</h2>
            <p className="text-gray-700 mb-4 text-center">
              Waktu ujian telah berakhir. Jawaban Anda akan otomatis dikirim.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && submissionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-emerald-600">
              Jawaban Berhasil Dikirim!
            </h2>
            
            <div className="bg-emerald-50 rounded-lg p-4 mb-4 border border-emerald-100">
              <div className="text-center text-sm text-emerald-700 mb-2">
                {submissionResult.isAutoSubmit ? 'Waktu ujian telah habis. Jawaban otomatis dikirim.' : 'Jawaban Anda telah berhasil dikirimkan.'}
              </div>
              <div className="text-xs text-emerald-600 text-center">
                {submissionResult.timestamp}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Soal:</span>
                <span className="font-medium text-gray-600">{submissionResult.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Terjawab:</span>
                <span className="font-medium text-emerald-600">{submissionResult.answered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Belum Dijawab:</span>
                <span className="font-medium text-amber-600">{submissionResult.unanswered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ditandai Ragu-ragu:</span>
                <span className="font-medium text-amber-600">{submissionResult.marked}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleBackToHome}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay transparan agar klik di luar modal menutup modal */}
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setShowFinalSubmitConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-purple-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Kirim Jawaban?</h2>
            <p className="text-gray-700 mb-6">
              Yakin ingin mengirim jawaban? Jawaban yang sudah dikirim tidak dapat diubah lagi.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowFinalSubmitConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowFinalSubmitConfirm(false);
                  kirimJawaban(false);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-600">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Gebyar Ilmiah Sains</h1>
                <p className="text-sm text-gray-600">
                  Science Competition - {user?.jenjang || ''} 
                  {user?.jenjang && examSchedules[user.jenjang] && 
                    ` (${examSchedules[user.jenjang].startTime} - ${examSchedules[user.jenjang].endTime})`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{user.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-700">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
              <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                <span>
                  Ragu-ragu: {
                    jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length
                  }
                </span>
                <span>Belum dijawab: {totalSoal - terjawab}</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-bold">
                    Soal {currentSoal}
                  </div>
                  <div className="text-gray-500">dari {totalSoal}</div>
                  <div className="flex items-center text-gray-500 text-sm">
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
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                {currentQuestion.pertanyaan}
              </h2>

              {console.log("currentQuestion", currentQuestion)}

              {currentQuestion.type == 'image' && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={`https://gis-backend.karyavisual.com/gis-backend-v5/storage/app/public/${currentQuestion.question_img_url}`} 
                    alt="Gambar soal" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}


              <div className="space-y-3 mb-8">
                {currentQuestion.opsi.map((opsi, idx) => (
                  <label key={idx} className="block">
                    <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      jawaban[currentSoal - 1] === idx
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          jawaban[currentSoal - 1] === idx
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {jawaban[currentSoal - 1] === idx && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`font-bold text-lg ${
                            jawaban[currentSoal - 1] === idx ? 'text-purple-600' : 'text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className={`text-lg ${
                            jawaban[currentSoal - 1] === idx ? 'text-gray-800 font-medium' : 'text-gray-700'
                          }`}>
                            {opsi}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name={`soal-${currentSoal}`}
                        checked={jawaban[currentSoal - 1] === idx}
                        onChange={() => handleJawab(idx)}
                        className="sr-only"
                      />
                    </div>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-100">
                <button
                  onClick={toggleRaguRagu}
                  disabled={jawaban[currentSoal - 1] === null}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    jawaban[currentSoal - 1] === null
                      ? 'bg-amber-100 text-amber-300 cursor-not-allowed'
                      : raguRagu[currentSoal - 1]
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>
                    {raguRagu[currentSoal - 1] ? 'Hapus Ragu-ragu' : 'Tandai Ragu-ragu'}
                  </span>
                </button>

                {jawaban[currentSoal - 1] !== null && (
                  <button
                    onClick={batalkanJawaban}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Batalkan Jawaban</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevSoal}
                disabled={currentSoal === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentSoal === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={nextSoal}
                disabled={currentSoal === totalSoal}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentSoal === totalSoal
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Question Grid - moved to top */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Daftar Soal</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: totalSoal }, (_, i) => {
                  const status = getStatusSoal(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentSoal(i + 1)}
                      disabled={showSuccessModal}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 relative ${
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
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className="text-sm text-gray-600">
                    Sudah Dijawab ({terjawab - jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length})
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-500 rounded relative">
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Ragu-ragu ({jawaban.filter((j, idx) => j !== null && raguRagu[idx]).length})
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600">Belum Dijawab ({totalSoal - terjawab})</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span className="text-sm text-gray-600">Soal Aktif</span>
                </div>
              </div>
            </div>

            {/* Submit Button - moved to bottom */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={handleSubmitAttempt}
                disabled={isSubmitting || showSuccessModal}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}</span>
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Pastikan semua jawaban sudah benar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}