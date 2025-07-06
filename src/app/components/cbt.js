'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, BookOpen, Send, HelpCircle, X, AlertTriangle, Image, Table, CheckCircle, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const totalSoal = 50;
const examDuration = 90 * 60 * 1000; // 90 minutes in milliseconds

const dummySoals = Array.from({ length: totalSoal }, (_, i) => {
  const types = ['text', 'image', 'table'];
  const type = types[i % 3];
  
  let pertanyaan = '';
  let media = null;
  
  if (type === 'text') {
    pertanyaan = `Siapakah Presiden ke-${i+1} Indonesia?`;
  } else if (type === 'image') {
    pertanyaan = `Identifikasi gambar berikut (Soal ${i+1}):`;
    media = 'https://via.placeholder.com/500x300?text=Contoh+Gambar+Soal';
  } else if (type === 'table') {
    pertanyaan = `Analisis tabel berikut (Soal ${i+1}):`;
    media = (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">No</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Nilai</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">1</td>
            <td className="border p-2">Andi</td>
            <td className="border p-2">85</td>
          </tr>
          <tr>
            <td className="border p-2">2</td>
            <td className="border p-2">Budi</td>
            <td className="border p-2">90</td>
          </tr>
        </tbody>
      </table>
    );
  }
  
  return {
    pertanyaan,
    type,
    media,
    opsi: ['Ir. Soekarno', 'Prabowo', 'B.J. Habibie', 'Soeharto'].map((opt, idx) => 
      type === 'image' ? `${opt} (Gambar ${idx+1})` : 
      type === 'table' ? `${opt} (Data ${idx+1})` : opt
    )
  };
});

export default function QuizPage() {
  const router = useRouter();
  const [currentSoal, setCurrentSoal] = useState(1);
  const [jawaban, setJawaban] = useState(Array(totalSoal).fill(null));
  const [raguRagu, setRaguRagu] = useState(Array(totalSoal).fill(false));
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [tabChanges, setTabChanges] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showFinalSubmitConfirm, setShowFinalSubmitConfirm] = useState(false);

  // Handle timer
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

  // Handle visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabChanges(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
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

  const handleJawab = (index) => {
    const updated = [...jawaban];
    updated[currentSoal - 1] = index;
    setJawaban(updated);
  };

  const toggleRaguRagu = () => {
    const updated = [...raguRagu];
    updated[currentSoal - 1] = !updated[currentSoal - 1];
    setRaguRagu(updated);
  };

  const batalkanJawaban = () => {
    const updatedJawaban = [...jawaban];
    const updatedRagu = [...raguRagu];
    updatedJawaban[currentSoal - 1] = null;
    updatedRagu[currentSoal - 1] = false;
    setJawaban(updatedJawaban);
    setRaguRagu(updatedRagu);
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

  const kirimJawaban = (isAutoSubmit) => {
    setIsSubmitting(true);
    const terjawab = jawaban.filter(j => j !== null).length;
    const ragu = raguRagu.filter(r => r === true).length;
    
    // Prepare submission result
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (isAutoSubmit) setShowTimeUpModal(false);
      if (showSubmitWarning) setShowSubmitWarning(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const terjawab = jawaban.filter(j => j !== null).length;
  const ragu = raguRagu.filter(r => r === true).length;
  const progress = (terjawab / totalSoal) * 100;

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

  const currentQuestion = dummySoals[currentSoal - 1];

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
              Anda telah meninggalkan halaman ujian {tabChanges} kali. Jika melakukan ini lebih dari 5x, Anda akan didiskualifikasi.
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
              Anda telah meninggalkan halaman ujian lebih dari 5x. Anda didiskualifikasi dari ujian ini.
            </p>
            <p className="text-gray-700 mb-6 text-center text-sm">
              Data jawaban Anda tetap akan disimpan.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  setShowCheatingWarning(false);
                  kirimJawaban(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Kirim Jawaban
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
                <span className="font-medium">{submissionResult.totalQuestions}</span>
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
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submit Confirmation Modal */}
      {showFinalSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <Send className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-center mb-3 text-gray-800">Konfirmasi Kirim Jawaban</h2>
            <p className="text-gray-700 mb-4 text-center">
              Apakah Anda yakin ingin mengirim jawaban? Jawaban yang sudah dikirim tidak dapat diubah lagi.
            </p>
            <div className="flex justify-center space-x-4">
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
                Kirim Jawaban
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
                <p className="text-sm text-gray-600">Science Competition</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-700">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
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
                <span>Ragu-ragu: {ragu}</span>
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

              {currentQuestion.media && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                  {currentQuestion.type === 'image' ? (
                    <img 
                      src={currentQuestion.media} 
                      alt="Gambar soal" 
                      className="w-full h-auto max-h-60 object-contain"
                    />
                  ) : (
                    <div className="p-2 overflow-x-auto">
                      {currentQuestion.media}
                    </div>
                  )}
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    raguRagu[currentSoal - 1]
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{raguRagu[currentSoal - 1] ? 'Hapus Ragu-ragu' : 'Tandai Ragu-ragu'}</span>
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
                  <span className="text-sm text-gray-600">Sudah Dijawab ({terjawab - ragu})</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-500 rounded relative">
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">Ragu-ragu ({ragu})</span>
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