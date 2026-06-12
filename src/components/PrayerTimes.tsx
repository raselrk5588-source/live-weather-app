"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './PrayerTimes.module.css';
import { Moon, Sunrise, Sun, Sunset, CloudMoon, Bell, BellRing, Compass } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { speakBengali } from '../utils/speak';
import { toBengaliNumber } from '../utils/number';

interface PrayerData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  month: { en: string; ar: string };
  year: string;
  day: string;
}

const PRAYER_NAMES: Record<string, string> = {
  Fajr: 'ফজর',
  Dhuhr: 'যোহর',
  Asr: 'আসর',
  Maghrib: 'মাগরিব',
  Isha: 'এশা'
};

export default function PrayerTimes() {
  const [timings, setTimings] = useState<PrayerData | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { location } = useAppContext();
  
  // Alarm state: key is prayer name (e.g. 'Fajr'), value is boolean
  const [alarms, setAlarms] = useState<Record<string, boolean>>({});

  const lat = location ? location.lat : 23.8103;
  const lon = location ? location.lon : 90.4125;

  const triggerAlarm = (prayerKey: string) => {
    const prayerName = PRAYER_NAMES[prayerKey] || prayerKey;
    const text = `${prayerName} নামাজের সময় হয়েছে।`;
    
    // Play voice alert
    speakBengali(text);
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('নামাজের সময়', { body: text });
    } else {
      alert(text);
    }
  };

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check alarms exactly at the 0th second of a minute
      if (now.getSeconds() === 0 && timings) {
        const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        for (const [key, isOn] of Object.entries(alarms)) {
          if (isOn && timings[key as keyof PrayerData] === nowStr) {
            triggerAlarm(key);
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, timings]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=1`);
        const data = await res.json();
        if (data.code === 200) {
          setTimings(data.data.timings);
          setHijri(data.data.date.hijri);
        }
      } catch (error) {
        console.error("Error fetching prayer times", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, [lat, lon]);

  const toggleAlarm = (key: string) => {
    setAlarms(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading || !currentTime || !timings) {
    return (
      <div className={styles.prayerContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</div>
      </div>
    );
  }

  const PRAYERS = [
    { key: 'Fajr', nameBn: 'ফজর', nameEn: 'Fajr', time: timings.Fajr, end: `শেষ ${timings.Sunrise}`, icon: Sunrise },
    { key: 'Dhuhr', nameBn: 'যোহর', nameEn: 'Dhuhr', time: timings.Dhuhr, end: `শেষ ${timings.Asr}`, icon: Sun },
    { key: 'Asr', nameBn: 'আসর', nameEn: 'Asr', time: timings.Asr, end: `শেষ ${timings.Sunset}`, icon: Sun },
    { key: 'Maghrib', nameBn: 'মাগরিব', nameEn: 'Maghrib', time: timings.Maghrib, end: `শেষ ${timings.Isha}`, icon: Sunset },
    { key: 'Isha', nameBn: 'এশা', nameEn: 'Isha', time: timings.Isha, end: `শেষ ২৩:৫৯`, icon: CloudMoon },
  ];

  let nextPrayer = PRAYERS[0];
  const nowStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  
  for (const prayer of PRAYERS) {
    if (prayer.time > nowStr) {
      nextPrayer = prayer;
      break;
    }
  }

  const [nextH, nextM] = nextPrayer.time.split(':').map(Number);
  const nextDate = new Date();
  nextDate.setHours(nextH, nextM, 0, 0);
  if (nextDate < currentTime) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  const diffMs = nextDate.getTime() - currentTime.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className={styles.prayerContainer}>
      <div className={styles.nextPrayerCard}>
        <div className={styles.headerRow}>
          <Moon size={18} />
          <span>নামাজের সময়সূচি</span>
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.prayerNameRow}>
            <span className={styles.labelNext}>পরবর্তী নামাজ</span>
            <div className={styles.prayerNameLarge}>
              🌙 {nextPrayer.nameBn}
            </div>
            <div className={styles.prayerTimeLarge}>{toBengaliNumber(nextPrayer.time)}</div>
          </div>
          <div className={styles.timeRemaining}>
            <span className={styles.timeLabel}></span>
            <span className={styles.timeValue}>{toBengaliNumber(diffHrs)} ঘণ্টা {toBengaliNumber(diffMins)} মিনিট</span>
          </div>
        </div>

        <div className={styles.hijriInfo}>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>হিজরি তারিখ</span>
            <span className={styles.infoValue}>{hijri ? `${toBengaliNumber(hijri.day)} ${hijri.month.ar} ${toBengaliNumber(hijri.year)}` : '--'}</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>ক্বিবলা</span>
            <span className={styles.infoValue}>{toBengaliNumber(276.3)}° পশ্চিম</span>
          </div>
        </div>
      </div>

      <div className={styles.prayerList}>
        {PRAYERS.map((prayer, index) => {
          const Icon = prayer.icon;
          const isNext = prayer.key === nextPrayer.key;
          const isAlarmOn = alarms[prayer.key];
          
          return (
            <div
              key={index}
              className={`${styles.prayerItem} ${isNext ? styles.prayerItemActive : ''}`}
            >
              <div className={styles.prayerInfo}>
                <div className={styles.prayerIconWrapper}>
                  <Icon size={20} />
                </div>
                <div className={styles.prayerNames}>
                  <span className={styles.nameBn}>
                    {prayer.nameBn}
                    {isNext && <span className={styles.badgeNext}>পরবর্তী</span>}
                  </span>
                  <span className={styles.nameEn}>{prayer.nameEn}</span>
                </div>
              </div>
              <div className={styles.timeInfo}>
                <div className={styles.timeCol}>
                  <span className={styles.time}>{toBengaliNumber(prayer.time)}</span>
                  <span className={styles.endTime}>{toBengaliNumber(prayer.end)}</span>
                </div>
                <button 
                  onClick={() => toggleAlarm(prayer.key)}
                  className={`${styles.bellBtn} ${isAlarmOn ? styles.bellBtnActive : ''}`}
                  title={isAlarmOn ? "অ্যালার্ম বন্ধ করুন" : "অ্যালার্ম চালু করুন"}
                  style={{ color: isAlarmOn ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                >
                  {isAlarmOn ? <BellRing size={16} /> : <Bell size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.foundationNote}>
        ইসলামিক ফাউন্ডেশন বাংলাদেশ · ঢাকা
      </div>
    </div>
  );
}
