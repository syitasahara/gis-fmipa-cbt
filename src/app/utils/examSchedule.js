// Exam schedule utility functions

// Exam schedules by jenjang
// Jadwal diambil dari .env (NEXT_PUBLIC_*) supaya bisa diubah tanpa edit kode.
// PENTING: akses process.env harus statis (bukan bracket notation) agar
// Next.js bisa inline nilainya saat build.
export const examSchedules = {
  'sd': {
    startTime: process.env.NEXT_PUBLIC_EXAM_SD_START || '00:00',
    endTime: process.env.NEXT_PUBLIC_EXAM_SD_END || '09:30'
  },
  'smp': {
    startTime: process.env.NEXT_PUBLIC_EXAM_SMP_START || '00:00',
    endTime: process.env.NEXT_PUBLIC_EXAM_SMP_END || '14:30'
  }
};

// Mode ujian: jendela waktu (startExam - endExam) dari .env.
// Dipakai di /start-exam untuk 3 pilihan: Simulasi / Tryout / Babak Penyisihan.
export const modeSchedules = {
  'simulasi': {
    label: 'Simulasi',
    startTime: process.env.NEXT_PUBLIC_SIMULASI_START || '00:00',
    endTime: process.env.NEXT_PUBLIC_SIMULASI_END || '23:59'
  },
  'tryout': {
    label: 'Tryout',
    startTime: process.env.NEXT_PUBLIC_TRYOUT_START || '00:00',
    endTime: process.env.NEXT_PUBLIC_TRYOUT_END || '23:59'
  },
  'penyisihan': {
    label: 'Babak Penyisihan',
    startTime: process.env.NEXT_PUBLIC_PENYISIHAN_START || '00:00',
    endTime: process.env.NEXT_PUBLIC_PENYISIHAN_END || '23:59'
  }
};

// Check if a MODE's exam window is currently open
export const checkModeActive = (modeKey) => {
  const schedule = modeSchedules[modeKey];
  if (!schedule) {
    return {
      allowed: false,
      message: 'Mode ujian tidak valid.',
      status: 'invalid'
    };
  }

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM

  if (currentTime < schedule.startTime) {
    return {
      allowed: false,
      message: `${schedule.label} belum dimulai. Jadwal: ${schedule.startTime} - ${schedule.endTime}. Silakan tunggu hingga pukul ${schedule.startTime}.`,
      status: 'not_started',
      nextTime: schedule.startTime
    };
  }

  if (currentTime > schedule.endTime) {
    return {
      allowed: false,
      message: `${schedule.label} telah berakhir pada pukul ${schedule.endTime}. Silakan hubungi panitia jika ada kendala.`,
      status: 'ended'
    };
  }

  return {
    allowed: true,
    message: `${schedule.label} sedang berlangsung (${schedule.startTime} - ${schedule.endTime}).`,
    status: 'active'
  };
};

// Check if current time is within exam schedule for given jenjang
export const checkExamSchedule = (jenjang) => {
  const schedule = examSchedules[jenjang];
  if (!schedule) {
    return { 
      allowed: false, 
      message: 'Jenjang tidak valid.',
      status: 'invalid'
    };
  }

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM
  
  if (currentTime < schedule.startTime) {
    return {
      allowed: false,
      message: `Login untuk jenjang ${jenjang} hanya dapat dilakukan saat waktu ujian (${schedule.startTime} - ${schedule.endTime}). Ujian belum dimulai, silakan tunggu hingga pukul ${schedule.startTime}.`,
      status: 'not_started',
      nextTime: schedule.startTime
    };
  }
  
  if (currentTime > schedule.endTime) {
    return {
      allowed: false,
      message: `Login untuk jenjang ${jenjang} tidak dapat dilakukan karena waktu ujian telah berakhir (${schedule.endTime}). Silakan hubungi panitia jika ada kendala.`,
      status: 'ended'
    };
  }
  
  return { 
    allowed: true, 
    message: `Ujian untuk jenjang ${jenjang} sedang berlangsung (${schedule.startTime} - ${schedule.endTime}).`,
    status: 'active'
  };
};

// Check if exam is currently active (for /start-exam page access)
export const checkExamActive = (jenjang) => {
  const schedule = examSchedules[jenjang];
  if (!schedule) {
    return { 
      allowed: false, 
      message: 'Jenjang tidak valid.',
      status: 'invalid'
    };
  }

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM
  
  if (currentTime < schedule.startTime) {
    return {
      allowed: false,
      message: `Ujian untuk jenjang ${jenjang} belum dimulai. Waktu ujian: ${schedule.startTime} - ${schedule.endTime}. Silakan tunggu hingga pukul ${schedule.startTime}.`,
      status: 'not_started',
      nextTime: schedule.startTime
    };
  }
  
  if (currentTime > schedule.endTime) {
    return {
      allowed: false,
      message: `Ujian untuk jenjang ${jenjang} telah berakhir pada pukul ${schedule.endTime}. Silakan hubungi panitia jika ada kendala.`,
      status: 'ended'
    };
  }
  
  return { 
    allowed: true, 
    message: `Ujian untuk jenjang ${jenjang} sedang berlangsung (${schedule.startTime} - ${schedule.endTime}).`,
    status: 'active'
  };
};

// Get current exam status for all jenjang
export const getCurrentExamStatus = () => {
  const statuses = {};
  Object.keys(examSchedules).forEach(jenjang => {
    statuses[jenjang] = checkExamSchedule(jenjang);
  });
  return statuses;
};

// Get time until exam starts (in minutes)
export const getTimeUntilExamStarts = (jenjang) => {
  const schedule = examSchedules[jenjang];
  if (!schedule) return null;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  if (currentTime >= schedule.startTime) return 0;

  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
  
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const startTotalMinutes = startHour * 60 + startMinute;
  
  return startTotalMinutes - currentTotalMinutes;
};

// Get remaining exam duration from current time until exam ends (in milliseconds)
export const getRemainingExamDuration = (jenjang) => {
  const schedule = examSchedules[jenjang];
  if (!schedule) return 90 * 60 * 1000; // Default 90 minutes

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  // If exam hasn't started yet, return full duration
  if (currentTime < schedule.startTime) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) * 60 * 1000; // Convert to milliseconds
  }
  
  // If exam has ended, return 0
  if (currentTime > schedule.endTime) {
    return 0;
  }
  
  // Calculate remaining time from now until exam ends
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
  
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  const remainingMinutes = endTotalMinutes - currentTotalMinutes;
  
  // Ensure we don't return negative values
  return Math.max(0, remainingMinutes * 60 * 1000); // Convert to milliseconds
};
