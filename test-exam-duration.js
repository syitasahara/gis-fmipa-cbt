// Test script for getRemainingExamDuration function
const { getRemainingExamDuration, examSchedules } = require('./src/app/utils/examSchedule');

console.log('=== Testing getRemainingExamDuration ===\n');

// Test current exam schedules
console.log('Current exam schedules:');
Object.entries(examSchedules).forEach(([jenjang, schedule]) => {
  console.log(`${jenjang}: ${schedule.startTime} - ${schedule.endTime}`);
});

console.log('\n=== Testing duration calculation ===');

// Test for each jenjang
Object.keys(examSchedules).forEach(jenjang => {
  const duration = getRemainingExamDuration(jenjang);
  const durationInMinutes = duration / (60 * 1000);
  
  console.log(`\n${jenjang.toUpperCase()}:`);
  console.log(`  Remaining duration: ${duration}ms`);
  console.log(`  Remaining duration: ${durationInMinutes} minutes`);
  console.log(`  Remaining duration: ${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60}m`);
});

// Test with invalid jenjang
console.log('\n=== Testing invalid jenjang ===');
const invalidDuration = getRemainingExamDuration('invalid');
console.log(`Invalid jenjang duration: ${invalidDuration}ms (should be default 90 minutes = ${90 * 60 * 1000}ms)`);

console.log('\n=== Current time info ===');
const now = new Date();
console.log(`Current time: ${now.toTimeString()}`);
console.log(`Current time (HH:MM): ${now.toTimeString().slice(0, 5)}`);
