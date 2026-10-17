'use client';

import { useExamProtection } from '../utils/examProtection';
import ExamProtectionModal from './ExamProtectionModal';

export default function ExamProtectionWrapper({ children }) {
  // Gunakan hook proteksi ujian (hanya efek samping di useEffect —
  // render tetap deterministik antara SSR dan hydration)
  useExamProtection();

  // Children dirender langsung. Gate `isClient` dulu membuat SSR menghasilkan
  // body kosong lalu konten "pop-in" setelah mount — itu penyebab blank flash.
  return (
    <>
      {children}
      <ExamProtectionModal />
    </>
  );
}
