'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Clock, Calendar } from 'lucide-react';
import { authAPI } from '../utils/api';
import { checkExamSchedule, examSchedules, getCurrentExamStatus, getTimeUntilExamStarts } from '../utils/examSchedule';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [examStatuses, setExamStatuses] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));
  const [hasActiveExam, setHasActiveExam] = useState(false);

  // Update current time and exam statuses every minute
  useEffect(() => {
    const updateStatus = () => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
      const statuses = getCurrentExamStatus();
      setExamStatuses(statuses);
      
      // Check if any exam is currently active
      const hasActive = Object.values(statuses).some(status => status.status === 'active');
      setHasActiveExam(hasActive);
    };

    // Initial update
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Check if user's jenjang has active exam schedule
      if (response.user && response.user.jenjang) {
        const scheduleCheck = checkExamSchedule(response.user.jenjang);
        
        if (!scheduleCheck.allowed) {
          // If exam is not allowed at this time, clear token and show error
          // Don't call logout API, just clear local storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          setError(scheduleCheck.message);
          return;
        }
      }
      
      // Login successful and schedule is valid, redirect to quiz
      router.push('/quiz');
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Login gagal. Periksa email dan password Anda.';
      
      if (err.message.includes('Koneksi ke server gagal')) {
        errorMessage = 'Salah username atau password. Lalu, periksa koneksi internet Anda.';
      } else if (err.message.includes('Masalah akses server')) {
        errorMessage = 'Terjadi masalah teknis. Tim kami sedang memperbaikinya.';
      } else if (err.message.includes('Unauthorized') || err.message.includes('401')) {
        errorMessage = 'Email atau password salah. Silakan coba lagi.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl shadow-md mx-auto w-fit mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
            Login Peserta
          </h1>
          <p className="text-purple-600/80 mt-2">Gebyar Ilmiah Sains - CBT</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`border rounded-lg p-4 mb-6 flex items-start space-x-2 ${
            error.includes('dimulai') || error.includes('berakhir') 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              error.includes('dimulai') || error.includes('berakhir') 
                ? 'text-amber-500' 
                : 'text-red-500'
            }`} />
            <div className="flex-1">
              <span className={`text-sm ${
                error.includes('dimulai') || error.includes('berakhir') 
                  ? 'text-amber-700' 
                  : 'text-red-700'
              }`}>
                {error}
              </span>
              {(error.includes('dimulai') || error.includes('berakhir')) && (
                <div className="mt-2">
                  <button
                    onClick={() => router.push('/schedule')}
                    className="text-xs text-amber-800 underline hover:text-amber-900 font-medium"
                  >
                    Lihat detail jadwal ujian →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border text-slate-600 border-gray-300 rounded-lg transition-all"
                placeholder="Masukkan email Anda"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 border text-slate-600 border-gray-300 rounded-lg transition-all"
                placeholder="Masukkan password Anda"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !hasActiveExam}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : !hasActiveExam ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Tidak Ada Ujian Aktif</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </>
            )}
          </button>

          {!hasActiveExam && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                Login hanya dapat dilakukan saat ada ujian yang sedang berlangsung. 
                Silakan tunggu hingga waktu ujian dimulai.
              </p>
            </div>
          )}
        </form>

        {/* Exam Schedule Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Jadwal Ujian</h3>
            </div>
            <p className="text-sm text-gray-600">Waktu saat ini: {currentTime}</p>
          </div>

          <div className="space-y-3">
            {Object.entries(examSchedules).map(([jenjang, schedule]) => {
              const status = examStatuses[jenjang] || { status: 'unknown' };
              const isActive = status.status === 'active';
              const isNotStarted = status.status === 'not_started';
              const isEnded = status.status === 'ended';

              return (
                <div 
                  key={jenjang}
                  className={`p-4 rounded-lg border-2 ${
                    isActive 
                      ? 'border-green-300 bg-green-50' 
                      : isNotStarted 
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{jenjang}</h4>
                      <p className="text-sm text-gray-600">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                      {isNotStarted && (
                        <p className="text-xs text-blue-600 mt-1">
                          Dimulai dalam {getTimeUntilExamStarts(jenjang)} menit
                        </p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-green-100 text-green-700' 
                        : isNotStarted 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isActive && '🟢 Sedang Berlangsung'}
                      {isNotStarted && '🔵 Belum Dimulai'}
                      {isEnded && '🔴 Telah Berakhir'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-amber-700 mb-2">
                  <strong>Penting:</strong> Anda hanya dapat login dan mengakses ujian sesuai dengan jadwal jenjang Anda. 
                  Login di luar jadwal akan ditolak sistem.
                </p>
                <button
                  onClick={() => router.push('/schedule')}
                  className="text-xs text-amber-800 underline hover:text-amber-900 font-medium"
                >
                  Lihat informasi lengkap jadwal ujian →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
