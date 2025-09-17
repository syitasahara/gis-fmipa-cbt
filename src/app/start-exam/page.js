'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, authAPI, questionsAPI, removeToken } from '../utils/api';
import { useStartExamProtection, isExamInProgress } from '../utils/examProtection';
import { BookOpen, Clock, Users, Play, ChevronRight, User, LogOut, CheckCircle } from 'lucide-react';

export default function StartExam() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const { startExam } = useStartExamProtection();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        if (!isAuthenticated()) {
          if (isMounted) {
            router.push('/login');
          }
          return;
        }

        // Check if exam is in progress
        if (isExamInProgress()) {
          console.log('Exam already in progress, redirecting to quiz');
          if (isMounted) {
            router.push('/quiz');
          }
          return;
        }

        const userData = await authAPI.getCurrentUser();
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth error:', error);
        
        // Clear invalid token
        removeToken();
        
        if (isMounted) {
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        }
        return;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Load question count when user data is available
  useEffect(() => {
    const loadQuestionCount = async () => {
      if (!user || !user.jenjang) return;

      try {
        setIsLoadingQuestions(true);
        // Try to get question count, if endpoint doesn't exist, get all questions and count them
        let count = 0;
        try {
          const countResult = await questionsAPI.getQuestionCount(user.jenjang);
          count = countResult.count || countResult.total || 0;
        } catch (error) {
          // Fallback: get all questions and count them
          console.log('Count endpoint not available, using fallback...');
          const questions = await questionsAPI.getQuestions(user.jenjang);
          count = questions.length || 0;
        }
        setQuestionCount(count);
      } catch (error) {
        console.error('Error loading question count:', error);
        // Set default count if error
        setQuestionCount(10);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestionCount();
  }, [user]);

  const handleStartExam = () => {
    // Aktifkan proteksi ujian
    startExam();
    // Redirect ke halaman quiz
    router.push('/quiz');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Mempersiapkan ujian...
          </h2>
          <p className="text-gray-600">Memuat data pengguna dan soal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-xl shadow-md">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                  Gebyar Ilmiah Sains
                </h1>
                <p className="text-sm text-purple-600/80">Olimpiade CBT Science Competition</p>
              </div>
            </div>
            
            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {user?.name || user?.username || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
              Siap Memulai Ujian?
            </span>
          </h1>
          
          <p className="text-lg text-purple-800/90 mb-8 max-w-2xl mx-auto">
            Pastikan Anda sudah siap sebelum memulai ujian. Setelah dimulai, waktu akan berjalan terus.
          </p>
        </div>

        {/* Exam Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Jumlah Soal</h3>
            <p className="text-2xl font-bold text-violet-700">
              {isLoadingQuestions ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${questionCount} Soal`
              )}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Waktu Ujian</h3>
            <p className="text-2xl font-bold text-purple-700">90 Menit</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-fuchsia-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-fuchsia-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Jenjang</h3>
            <p className="text-2xl font-bold text-fuchsia-700">{user?.jenjang || 'SMP'}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-purple-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Petunjuk Ujian
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Pastikan koneksi internet Anda stabil</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Jangan menutup browser atau tab selama ujian berlangsung</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Anda dapat menandai soal yang diragu-ragukan untuk dikerjakan nanti</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Pastikan untuk submit jawaban sebelum waktu habis</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartExam}
            className="group bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-800 hover:to-purple-800 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-purple-200/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>Mulai Ujian Sekarang</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-gray-600 mt-4">
            Dengan mengklik tombol di atas, ujian akan segera dimulai dan waktu akan berjalan.
          </p>
        </div>
      </div>
    </div>
  );
}
