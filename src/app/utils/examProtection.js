'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie } from '../utils/cookies';

// Hook untuk melindungi navigasi ketika ujian berlangsung
export function useExamProtection() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Cek apakah ujian sedang berlangsung
    const examStarted = getCookie('examStarted');
    const examEndTime = getCookie('examEndTime');
    
    if (examStarted === 'true' && examEndTime) {
      const currentTime = new Date().getTime();
      const endTime = parseInt(examEndTime);
      
      // Jika ujian masih berlangsung dan user tidak di halaman quiz
      if (currentTime < endTime && pathname !== '/quiz') {
        // Redirect ke halaman quiz
        router.replace('/quiz');
      }
    }
  }, [pathname, router]);
}

// Hook untuk memulai proteksi ujian
export function useStartExamProtection() {
  return {
    startExam: () => {
      const examDuration = 60 * 60 * 1000; // 60 menit
      const startTime = new Date().getTime();
      const endTime = startTime + examDuration;
      
      // Set cookies untuk menandai ujian dimulai
      document.cookie = `examStarted=true; path=/; max-age=${60 * 60}`; // 1 jam
      document.cookie = `examStartTime=${startTime}; path=/; max-age=${60 * 60}`;
      document.cookie = `examEndTime=${endTime}; path=/; max-age=${60 * 60}`;
      
      // Set localStorage sebagai backup
      localStorage.setItem('examStarted', 'true');
      localStorage.setItem('examStartTime', startTime.toString());
      localStorage.setItem('examEndTime', endTime.toString());
    },
    
    endExam: () => {
      // Hapus cookies dan localStorage
      document.cookie = 'examStarted=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'examStartTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'examEndTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      localStorage.removeItem('examStarted');
      localStorage.removeItem('examStartTime');
      localStorage.removeItem('examEndTime');
    }
  };
}

// Fungsi untuk cek apakah ujian sedang berlangsung
export function isExamInProgress() {
  if (typeof window === 'undefined') return false;
  
  // Cek dari cookies dulu
  const examStarted = getCookie('examStarted');
  const examEndTime = getCookie('examEndTime');
  
  if (examStarted === 'true' && examEndTime) {
    const currentTime = new Date().getTime();
    const endTime = parseInt(examEndTime);
    return currentTime < endTime;
  }
  
  // Fallback ke localStorage
  const localExamStarted = localStorage.getItem('examStarted');
  const localExamEndTime = localStorage.getItem('examEndTime');
  
  if (localExamStarted === 'true' && localExamEndTime) {
    const currentTime = new Date().getTime();
    const endTime = parseInt(localExamEndTime);
    return currentTime < endTime;
  }
  
  return false;
}
