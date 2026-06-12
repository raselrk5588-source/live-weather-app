"use client";

import { useEffect, useState } from 'react';
import styles from './WeatherWidget.module.css';
import { Navigation, CloudSun, Droplets, Wind, Eye, ThermometerSun, CloudRain, Cloud, Sun, CloudLightning, Volume2, CalendarDays } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { speakBengali } from '../utils/speak';
import { toBengaliNumber } from '../utils/number';
import { getBengaliDate } from '../utils/bengaliCalendar';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    visibility: number;
    is_day: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}

const getWeatherDetails = (code: number) => {
  if (code === 0) return { label: 'পরিষ্কার আকাশ', icon: Sun, color: '#fde047' };
  if (code === 1 || code === 2) return { label: 'আংশিক মেঘলা', icon: CloudSun, color: '#fde047' };
  if (code === 3) return { label: 'মেঘলা', icon: Cloud, color: '#94a3b8' };
  if (code >= 45 && code <= 48) return { label: 'কুয়াশা', icon: Cloud, color: '#cbd5e1' };
  if (code >= 51 && code <= 67) return { label: 'বৃষ্টি', icon: CloudRain, color: '#60a5fa' };
  if (code >= 71 && code <= 77) return { label: 'তুষারপাত', icon: Cloud, color: '#ffffff' };
  if (code >= 80 && code <= 82) return { label: 'ভারী বৃষ্টি', icon: CloudRain, color: '#3b82f6' };
  if (code >= 95) return { label: 'বজ্রঝড়', icon: CloudLightning, color: '#a855f7' };
  return { label: 'অজানা', icon: Cloud, color: '#94a3b8' };
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { location } = useAppContext();
  
  const lat = location ? location.lat : 23.8103;
  const lon = location ? location.lon : 90.4125;
  const cityName = location ? location.city : "ঢাকা, বাংলাদেশ";

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,visibility&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`
        );
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  const handleSpeak = () => {
    if (!weather) return;
    const details = getWeatherDetails(weather.current.weather_code);
    const temp = Math.round(weather.current.temperature_2m);
    const text = `এখন ${cityName} এর আবহাওয়া ${details.label}। তাপমাত্রা ${toBengaliNumber(temp)} ডিগ্রি সেলসিয়াস। বাতাসে আর্দ্রতা ${toBengaliNumber(weather.current.relative_humidity_2m)} শতাংশ।`;
    
    speakBengali(text);
  };

  if (loading || !currentTime) {
    return (
      <div className={styles.weatherCard}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={styles.weatherCard}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>ডেটা পাওয়া যায়নি</div>
      </div>
    );
  }

  const currentDetails = getWeatherDetails(weather.current.weather_code);
  const CurrentIcon = currentDetails.icon;
  
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('bn-BD', dateOptions).format(currentTime);
  const formattedTime = new Intl.DateTimeFormat('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(currentTime);
  const bnDate = getBengaliDate(currentTime);

  const currentHour = new Date().getHours();
  const hourlyData = [];
  for (let i = 0; i < 5; i++) {
    const dataIndex = currentHour + i;
    if (dataIndex < weather.hourly.time.length) {
      hourlyData.push({
        time: i === 0 ? 'এখন' : `${toBengaliNumber((dataIndex % 24).toString().padStart(2, '0'))}:০০`,
        temp: toBengaliNumber(Math.round(weather.hourly.temperature_2m[dataIndex])),
        details: getWeatherDetails(weather.hourly.weather_code[dataIndex])
      });
    }
  }

  return (
    <div className={styles.weatherCard}>
      <div className={styles.weatherMain}>
        <div className={styles.locationRow}>
          <div className={styles.locationInfo}>
            <Navigation size={18} className={styles.locationIcon} />
            <span>{cityName}</span>
            <div className={styles.dateInfo}>{formattedDate}</div>
            <div className={styles.bengaliDate}>
              <CalendarDays size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}} />
              {bnDate.fullStr}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div className={styles.timeDisplay}>{formattedTime}</div>
            <button onClick={handleSpeak} style={{ background: 'var(--accent-blue)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        <div className={styles.tempRow}>
          <div className={styles.temperature}>
            {toBengaliNumber(Math.round(weather.current.temperature_2m))}<span>°C</span>
          </div>
          <CurrentIcon size={64} color={currentDetails.color} />
        </div>

        <div className={styles.weatherCondition}>{currentDetails.label}</div>
        <div className={styles.highLow}>
          <span style={{color: '#f87171'}}>↑ {toBengaliNumber(Math.round(weather.daily.temperature_2m_max[0]))}°</span>
          <span style={{color: '#60a5fa'}}>↓ {toBengaliNumber(Math.round(weather.daily.temperature_2m_min[0]))}°</span>
          <span>অনুভূত {toBengaliNumber(Math.round(weather.current.apparent_temperature))}°C</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Droplets size={20} /></div>
          <span className={styles.statLabel}>আর্দ্রতা</span>
          <span className={styles.statValue}>{toBengaliNumber(weather.current.relative_humidity_2m)}%</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Wind size={20} /></div>
          <span className={styles.statLabel}>বায়ু গতি</span>
          <span className={styles.statValue}>{toBengaliNumber(weather.current.wind_speed_10m)} কিমি/ঘ</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Eye size={20} /></div>
          <span className={styles.statLabel}>দৃশ্যমানতা</span>
          <span className={styles.statValue}>{toBengaliNumber((weather.current.visibility / 1000).toFixed(1))} কিমি</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ThermometerSun size={20} /></div>
          <span className={styles.statLabel}>UV সূচক</span>
          <span className={styles.statValue}>{toBengaliNumber(weather.daily.uv_index_max[0] || '--')}</span>
        </div>
      </div>

      <div className={styles.forecastSection}>
        <div className={styles.forecastTabs}>
          <button className={`${styles.forecastTab} ${styles.forecastTabActive}`}>ঘণ্টাওয়ারি</button>
        </div>

        <div className={styles.hourlyList}>
          {hourlyData.map((hr, idx) => {
            const HrIcon = hr.details.icon;
            return (
              <div key={idx} className={styles.hourlyItem}>
                <span className={styles.hourlyTime}>{hr.time}</span>
                <HrIcon size={24} color={hr.details.color} className={styles.hourlyIcon} />
                <span className={styles.hourlyTemp}>{hr.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
