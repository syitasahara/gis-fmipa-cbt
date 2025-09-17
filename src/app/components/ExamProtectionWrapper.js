'use client';

import { useEffect, useState } from 'react';
import { useExamProtection } from '../utils/examProtection';
import ExamProtectionModal from './ExamProtectionModal';

export default function ExamProtectionWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);
  
  // Gunakan hook proteksi ujian
  useExamProtection();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Prevent hydration mismatch
  if (!isClient) {
    return null;
  }
  
  return (
    <>
      {children}
      <ExamProtectionModal />
    </>
  );
}
