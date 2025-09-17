// Exam schedule utility functions

// Exam schedules by jenjang
export const examSchedules = {
  'sd': {
    startTime: '11:00',
    endTime: '23:59'
  },
  'smp': {
    startTime: '11:00', 
    endTime: '23:59'
  }
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
