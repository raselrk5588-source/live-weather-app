import { toBengaliNumber } from './number';

export const getBengaliDate = (date: Date = new Date()) => {
  const d = date.getDate();
  const m = date.getMonth() + 1; // 1-12
  const y = date.getFullYear();
  
  // Simplified approximation for Bangladesh Standard
  let bnDay = 1;
  let bnMonth = '';
  let season = '';
  
  if ((m === 4 && d >= 14) || (m === 5 && d <= 14)) { bnMonth = 'বৈশাখ'; season = 'গ্রীষ্মকাল'; bnDay = m === 4 ? d - 13 : d + 17; }
  else if ((m === 5 && d >= 15) || (m === 6 && d <= 14)) { bnMonth = 'জ্যৈষ্ঠ'; season = 'গ্রীষ্মকাল'; bnDay = m === 5 ? d - 14 : d + 17; }
  else if ((m === 6 && d >= 15) || (m === 7 && d <= 15)) { bnMonth = 'আষাঢ়'; season = 'বর্ষাকাল'; bnDay = m === 6 ? d - 14 : d + 16; }
  else if ((m === 7 && d >= 16) || (m === 8 && d <= 15)) { bnMonth = 'শ্রাবণ'; season = 'বর্ষাকাল'; bnDay = m === 7 ? d - 15 : d + 16; }
  else if ((m === 8 && d >= 16) || (m === 9 && d <= 15)) { bnMonth = 'ভাদ্র'; season = 'শরৎকাল'; bnDay = m === 8 ? d - 15 : d + 16; }
  else if ((m === 9 && d >= 16) || (m === 10 && d <= 15)) { bnMonth = 'আশ্বিন'; season = 'শরৎকাল'; bnDay = m === 9 ? d - 15 : d + 15; }
  else if ((m === 10 && d >= 16) || (m === 11 && d <= 14)) { bnMonth = 'কার্তিক'; season = 'হেমন্তকাল'; bnDay = m === 10 ? d - 15 : d + 16; }
  else if ((m === 11 && d >= 15) || (m === 12 && d <= 14)) { bnMonth = 'অগ্রহায়ণ'; season = 'হেমন্তকাল'; bnDay = m === 11 ? d - 14 : d + 16; }
  else if ((m === 12 && d >= 15) || (m === 1 && d <= 13)) { bnMonth = 'পৌষ'; season = 'শীতকাল'; bnDay = m === 12 ? d - 14 : d + 17; }
  else if ((m === 1 && d >= 14) || (m === 2 && d <= 13)) { bnMonth = 'মাঘ'; season = 'শীতকাল'; bnDay = m === 1 ? d - 13 : d + 18; }
  else if ((m === 2 && d >= 14) || (m === 3 && d <= 14)) { bnMonth = 'ফাল্গুন'; season = 'বসন্তকাল'; bnDay = m === 2 ? d - 13 : d + 15; }
  else if ((m === 3 && d >= 15) || (m === 4 && d <= 13)) { bnMonth = 'চৈত্র'; season = 'বসন্তকাল'; bnDay = m === 3 ? d - 14 : d + 17; }
  else { bnMonth = 'বৈশাখ'; season = 'গ্রীষ্মকাল'; bnDay = 1; }
  
  let bnYear = y - 593;
  if (m < 4 || (m === 4 && d < 14)) bnYear -= 1;

  return {
    dayStr: toBengaliNumber(bnDay),
    month: bnMonth,
    yearStr: toBengaliNumber(bnYear),
    season,
    fullStr: `${toBengaliNumber(bnDay)} ${bnMonth} ${toBengaliNumber(bnYear)} — ${season}`
  };
};
