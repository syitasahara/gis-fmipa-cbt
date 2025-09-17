'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isExamInProgress } from '../utils/examProtection';
import { AlertTriangle, X } from 'lucide-react';

export default function ExamProtectionModal() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Jika ujian berlangsung dan user tidak di halaman quiz, tampilkan modal
    if (isExamInProgress() && pathname !== '/quiz') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [pathname]);

  const handleBackToExam = () => {
    setShowModal(false);
    router.push('/quiz');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Ujian Sedang Berlangsung
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Anda sedang mengerjakan ujian. Navigasi ke halaman lain tidak diperbolehkan 
            selama ujian berlangsung. Silakan kembali ke halaman ujian.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleBackToExam}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <span>Kembali ke Ujian</span>
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            💡 Ujian akan berakhir otomatis ketika waktu habis atau Anda submit jawaban
          </p>
        </div>
      </div>
    </div>
  );
}
