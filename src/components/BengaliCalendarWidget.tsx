import React, { useState, useEffect } from 'react';
import styles from './BengaliCalendarWidget.module.css';
import { getBengaliDate } from '../utils/bengaliCalendar';
import { CalendarDays, Sprout, Leaf, Sun, Snowflake, CloudRain, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { toBengaliNumber } from '../utils/number';

export default function BengaliCalendarWidget() {
  const [bDate, setBDate] = useState({ dayStr: '', month: '', yearStr: '', season: '' });
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  useEffect(() => {
    setBDate(getBengaliDate());
  }, []);

  const getSeasonIcon = (season: string) => {
    switch(season) {
      case 'গ্রীষ্মকাল': return <Sun size={32} color="#eab308" />;
      case 'বর্ষাকাল': return <CloudRain size={32} color="#3b82f6" />;
      case 'শরৎকাল': return <Wind size={32} color="#a855f7" />;
      case 'হেমন্তকাল': return <Leaf size={32} color="#f97316" />;
      case 'শীতকাল': return <Snowflake size={32} color="#06b6d4" />;
      case 'বসন্তকাল': return <Sprout size={32} color="#22c55e" />;
      default: return <CalendarDays size={32} color="#eab308" />;
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const generateGrid = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const grid = [];
    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      grid.push({
        gregorianDay: i,
        dateObj,
        bengaliInfo: getBengaliDate(dateObj)
      });
    }
    
    return grid;
  };

  const WEEKDAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  const ENG_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const gridData = generateGrid();
  
  const today = new Date();
  const isToday = (d: Date) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  return (
    <div className={`${styles.calendarContainer} glass-panel`}>
      <div className={styles.todayCard}>
        <div className={styles.iconCircle}>
          {getSeasonIcon(bDate.season)}
        </div>
        <div className={styles.dateInfo}>
          <h2 className={styles.dayNum}>{bDate.dayStr}</h2>
          <div className={styles.monthYear}>
            <span className={styles.month}>{bDate.month}</span>
            <span className={styles.year}>{bDate.yearStr} বঙ্গাব্দ</span>
          </div>
        </div>
        <div className={styles.seasonBadge}>
          {bDate.season}
        </div>
      </div>

      <div className={styles.interactiveCalendar}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth} className={styles.navBtn}>
            <ChevronLeft size={24} />
          </button>
          <div className={styles.calendarTitle}>
            {ENG_MONTHS[currentMonthDate.getMonth()]} {toBengaliNumber(currentMonthDate.getFullYear())}
          </div>
          <button onClick={handleNextMonth} className={styles.navBtn}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className={styles.weekdaysRow}>
          {WEEKDAYS.map(wd => <div key={wd} className={styles.weekday}>{wd}</div>)}
        </div>

        <div className={styles.daysGrid}>
          {gridData.map((cell, idx) => {
            if (!cell) return <div key={`empty-${idx}`} className={styles.emptyCell}></div>;
            
            const isCurrentDay = isToday(cell.dateObj);
            const isFirstBnDay = cell.bengaliInfo.dayStr === '১';

            return (
              <div key={cell.gregorianDay} className={`${styles.dayCell} ${isCurrentDay ? styles.todayCell : ''}`}>
                <div className={styles.engDate}>{cell.gregorianDay}</div>
                <div className={styles.bnDate}>
                  {cell.bengaliInfo.dayStr}
                  {isFirstBnDay && <span className={styles.bnMonthLabel}>{cell.bengaliInfo.month}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
