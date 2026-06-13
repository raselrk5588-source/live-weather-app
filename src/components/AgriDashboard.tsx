"use client";

import { useEffect, useState } from 'react';
import styles from './AgriDashboard.module.css';
import { Sprout, CloudRain, ThermometerSun, Sun, Volume2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { speakBengali } from '../utils/speak';
import { toBengaliNumber } from '../utils/number';
import FertilizerCalculator from './FertilizerCalculator';
import DiseaseScanner from './DiseaseScanner';

interface AgriData {
  current: {
    soil_moisture_0_to_7cm: number;
    temperature_2m: number;
    precipitation: number;
  };
  daily: {
    precipitation_probability_max: number[];
    uv_index_max: number[];
  };
}

const CROP_DATA: Record<string, any> = {
  rice: {
    id: 'rice',
    title: 'ধান',
    subtitle: 'বোরো ধান - কার্যকর কৃষি পর্যায়',
    health: 85,
    healthLabel: 'ভালো',
    healthClass: 'badgeGreen',
    diseaseRisk: 'ব্লাস্ট রোগের ঝুঁকি মাঝারি',
    tips: ['পটাস সার প্রয়োগ করুন', 'আগাছা পরিষ্কার করুন', 'পানির স্তর ৫-৭ সেমি রাখুন']
  },
  jute: {
    id: 'jute',
    title: 'পাট',
    subtitle: 'তোষা পাট - বৃদ্ধি পর্যায়',
    health: 72,
    healthLabel: 'মাঝারি',
    healthClass: 'badgeYellow',
    diseaseRisk: 'মাকড়সার আক্রমণ হতে পারে',
    tips: ['জমি নিড়ানি দিন', 'পর্যাপ্ত আর্দ্রতা নিশ্চিত করুন', 'কীটনাশক স্প্রে করুন']
  },
  veg: {
    id: 'veg',
    title: 'সবজি',
    subtitle: 'মৌসুমি সবজি - ফলন পর্যায়',
    health: 92,
    healthLabel: 'চমৎকার',
    healthClass: 'badgeGreen',
    diseaseRisk: 'রোগ বালাই নেই',
    tips: ['নিয়মিত সেচ দিন', 'পাকা ফল সংগ্রহ করুন', 'জৈব সার ব্যবহার করুন']
  }
};

export default function AgriDashboard() {
  const [agriData, setAgriData] = useState<AgriData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCrop, setActiveCrop] = useState('rice');
  const { location } = useAppContext();
  
  const lat = location ? location.lat : 23.8103;
  const lon = location ? location.lon : 90.4125;

  useEffect(() => {
    const fetchAgriData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,soil_moisture_0_to_7cm&daily=uv_index_max,precipitation_probability_max&timezone=auto`);
        const data = await res.json();
        setAgriData(data);
      } catch (error) {
        console.error("Error fetching agricultural data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgriData();
  }, [lat, lon]);

  const rainProb = agriData?.daily.precipitation_probability_max[0] || 0;
  const temp = Math.round(agriData?.current.temperature_2m || 0);
  const uv = agriData?.daily.uv_index_max[0] || 0;
  
  const soilMoistureRaw = agriData?.current.soil_moisture_0_to_7cm || 0.2;
  let soilMoisturePercent = Math.round(((soilMoistureRaw - 0.1) / 0.3) * 100);
  if (soilMoisturePercent < 0) soilMoisturePercent = 0;
  if (soilMoisturePercent > 100) soilMoisturePercent = 100;

  const handleSpeak = () => {
    const text = `কৃষি পরামর্শ: মাটির আর্দ্রতা ${toBengaliNumber(soilMoisturePercent)} শতাংশ। আগামী ${toBengaliNumber(48)} ঘণ্টায় বৃষ্টির সম্ভাবনা ${toBengaliNumber(rainProb)} শতাংশ। ${rainProb > 50 ? 'সেচ বন্ধ রাখুন।' : 'মাটিতে পর্যাপ্ত আর্দ্রতা না থাকলে সেচ দিন।'} তাপমাত্রা ${toBengaliNumber(temp)} ডিগ্রি সেলসিয়াস।`;
    speakBengali(text);
  };

  if (loading || !agriData) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>কৃষি ডেটা লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.banner} glass-panel`}>
        <div className={styles.bannerHeader}>
          <div className={styles.bannerIcon}>
            <Sprout size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 className={styles.bannerTitle}>কৃষি ড্যাশবোর্ড</h2>
            <p className={styles.bannerSub}>এটি ফসল পর্যবেক্ষণ করা হচ্ছে</p>
          </div>
          <button onClick={handleSpeak} style={{ background: 'var(--accent-green)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={18} />
          </button>
        </div>
        
        <div className={styles.alertList}>
          <div className={`${styles.alertItem} ${rainProb > 50 ? styles.alertGreen : styles.alertYellow}`}>
            <CloudRain size={18} />
            <span>আগামী ৪৮ ঘণ্টায় বৃষ্টির সম্ভাবনা {toBengaliNumber(rainProb)}% — {rainProb > 50 ? 'সেচ বন্ধ রাখুন' : 'সেচের প্রস্তুতি নিন'}</span>
          </div>
          <div className={`${styles.alertItem} ${temp > 32 ? styles.alertYellow : styles.alertGreen}`}>
            <ThermometerSun size={18} />
            <span>তাপমাত্রা {toBengaliNumber(temp)}°C — {temp > 32 ? 'ধানের পরাগায়নে সামান্য প্রভাব পড়তে পারে' : 'ফসল বৃদ্ধির জন্য আদর্শ'}</span>
          </div>
          <div className={`${styles.alertItem} ${uv > 6 ? styles.alertYellow : styles.alertGreen}`}>
            <Sun size={18} />
            <span>UV সূচক {toBengaliNumber(Math.round(uv))} — {uv > 6 ? 'কীটনাশক স্প্রে বিকেলে করুন' : 'কীটনাশক স্প্রে করার উপযুক্ত সময়'}</span>
          </div>
        </div>
      </div>

      <div className={styles.cropSelector}>
        <button onClick={() => setActiveCrop('rice')} className={`${styles.cropBtn} ${activeCrop === 'rice' ? styles.cropActive : ''}`}>
          <div className={styles.cropIconWrapper}>
            <Sprout size={24} className={styles.iconRice} />
          </div>
          <span>ধান</span>
          <div className={styles.dotGreen}></div>
        </button>
        <button onClick={() => setActiveCrop('jute')} className={`${styles.cropBtn} ${activeCrop === 'jute' ? styles.cropActive : ''}`}>
          <div className={styles.cropIconWrapper}>
            <Sprout size={24} className={styles.iconJute} />
          </div>
          <span>পাট</span>
          <div className={styles.dotYellow}></div>
        </button>
        <button onClick={() => setActiveCrop('veg')} className={`${styles.cropBtn} ${activeCrop === 'veg' ? styles.cropActive : ''}`}>
          <div className={styles.cropIconWrapper}>
            <Sprout size={24} className={styles.iconVeg} />
          </div>
          <span>সবজি</span>
          <div className={styles.dotGreen}></div>
        </button>
      </div>

      <div className={`${styles.cropDetails} glass-panel`}>
        <div className={styles.cropHeader}>
          <div>
            <div className={styles.cropTitleRow}>
              <h3>{CROP_DATA[activeCrop].title}</h3>
              <span className={styles[CROP_DATA[activeCrop].healthClass]}>{CROP_DATA[activeCrop].healthLabel}</span>
            </div>
            <p className={styles.cropSub}>{CROP_DATA[activeCrop].subtitle}</p>
          </div>
          <div className={styles.healthScore}>
            <span className={styles.scoreValue}>{toBengaliNumber(CROP_DATA[activeCrop].health)}%</span>
            <span className={styles.scoreLabel}>স্বাস্থ্য সূচক</span>
          </div>
        </div>

        <div className={styles.moistureSection}>
          <div className={styles.moistureLabel}>
            <span>মাটির আর্দ্রতা</span>
            <span className={styles.moistureValue}>{toBengaliNumber(soilMoisturePercent)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${soilMoisturePercent}%` }}></div>
          </div>
        </div>

        <div className={styles.chartTabs}>
          <button className={styles.chartTabActive}>আর্দ্রতা</button>
          <button className={styles.chartTab}>বৃষ্টি (সেমি)</button>
        </div>

        <div className={styles.chartArea}>
          <svg viewBox="0 0 300 80" className={styles.mockChart}>
            <path d="M0,60 Q50,60 100,50 T200,45 T300,55" fill="none" stroke="var(--accent-green)" strokeWidth="2" />
            <path d="M0,60 Q50,60 100,50 T200,45 T300,55 L300,80 L0,80 Z" fill="url(#gradientGreen)" opacity="0.2" />
            <defs>
              <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="1"/>
                <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.chartLabelsX}>
            <span>সোম</span><span>মঙ্গল</span><span>বুধ</span><span>বৃহ</span><span>শুক্র</span><span>শনি</span><span>রবি</span>
          </div>
          <div className={styles.chartLabelsY}>
            <span>{toBengaliNumber(80)}</span><span>{toBengaliNumber(40)}</span><span>{toBengaliNumber(0)}</span>
          </div>
        </div>

        <div className={styles.adviceSection}>
          <div className={styles.adviceItem}>
            <span className={styles.adviceIconWarning}>⚠️</span>
            <span>{soilMoisturePercent < 50 ? 'সেচ দিন ৩ দিনের মধ্যে' : 'মাটিতে পর্যাপ্ত আর্দ্রতা আছে'}</span>
          </div>
          <div className={styles.adviceItem}>
            <span className={styles.adviceIconWarning}>⚠️</span>
            <span>{CROP_DATA[activeCrop].diseaseRisk}</span>
          </div>
        </div>

        <div className={styles.tipsSection}>
          <h4>পরামর্শ</h4>
          <ul className={styles.tipsList}>
            {CROP_DATA[activeCrop].tips.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>


      
      <FertilizerCalculator />
      <div style={{ marginTop: '2rem', padding: '0 0.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>ফসল রোগ নির্ণয় (AI)</h3>
        <DiseaseScanner />
      </div>
    </div>
  );
}
