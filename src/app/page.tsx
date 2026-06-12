"use client";

import { useState } from "react";
import styles from "./page.module.css";
import WeatherWidget from "../components/WeatherWidget";
import PrayerTimes from "../components/PrayerTimes";
import AgriDashboard from "../components/AgriDashboard";
import DiseaseScanner from "../components/DiseaseScanner";
import TaskReminder from "../components/TaskReminder";
import HelplineWidget from "../components/HelplineWidget";
import BengaliCalendarWidget from "../components/BengaliCalendarWidget";
import AgriNewsWidget from "../components/AgriNewsWidget";
import VoiceAssistant from "../components/VoiceAssistant";
import { Cloud, Sprout, Moon, MapPin, Moon as MoonIcon, Sun, PhoneCall, Camera, CalendarCheck, ArrowLeft, CalendarDays } from "lucide-react";
import { useAppContext } from "../context/AppContext";

type Tab = 'weather' | 'agri' | 'prayer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('weather');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const { theme, setTheme, location, setLocation, setCityName } = useAppContext();
  const [locating, setLocating] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("আপনার ডিভাইস জিপিএস সাপোর্ট করে না");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Reverse geocoding to get city name
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=bn`);
          const data = await res.json();
          setLocation({ lat, lon, city: data.city || data.locality || "আপনার এলাকা" });
        } catch (e) {
          setLocation({ lat, lon, city: "আপনার এলাকা" });
        }
        setLocating(false);
      },
      (error) => {
        alert("লোকেশন পাওয়া যায়নি। দয়া করে জিপিএস চালু করুন।");
        setLocating(false);
      }
    );
    setCityName("ঢাকা");
  };

  const renderSubScreen = () => {
    if (!activeSubScreen) return null;
    return (
      <div className={styles.subScreen}>
        <div className={styles.subScreenHeader}>
          <button className={styles.backBtn} onClick={() => setActiveSubScreen(null)}>
            <ArrowLeft size={24} />
          </button>
          <h2>
            {activeSubScreen === 'helpline' && 'জরুরি হেল্পলাইন'}
            {activeSubScreen === 'scanner' && 'রোগ নির্ণয়'}
            {activeSubScreen === 'reminder' && 'কাজের রিমাইন্ডার'}
            {activeSubScreen === 'calendar' && 'বাংলা পঞ্জিকা'}
            {activeSubScreen === 'agri' && 'কৃষি ড্যাশবোর্ড'}
            {activeSubScreen === 'prayer' && 'নামাজের সময়সূচি'}
          </h2>
          <div style={{width: 40}}></div>
        </div>
        <div className={styles.subScreenContent}>
          {activeSubScreen === 'helpline' && <HelplineWidget />}
          {activeSubScreen === 'scanner' && <DiseaseScanner />}
          {activeSubScreen === 'reminder' && <TaskReminder />}
          {activeSubScreen === 'calendar' && <BengaliCalendarWidget />}
          {activeSubScreen === 'agri' && <AgriDashboard />}
          {activeSubScreen === 'prayer' && <PrayerTimes />}
        </div>
      </div>
    );
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.appWrapper}>
        {renderSubScreen()}
        <header className={`${styles.header} animate-fade-in`}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Cloud size={18} color="#fff" />
            </div>
            <div>
              <h1>কৃষি আবহাওয়া</h1>
              <span>লাইভ</span>
            </div>
          </div>

          <div className={styles.headerControls}>
            <button onClick={handleGetLocation} className={styles.headerBtn} title="লোকেশন নিন">
              <MapPin size={20} color={location ? "var(--accent-green)" : "var(--text-secondary)"} />
            </button>
            <button onClick={toggleTheme} className={styles.headerBtn} title="থিম পরিবর্তন">
              {theme === 'dark' ? <Sun size={20} color="var(--accent-yellow)" /> : <Moon size={20} color="var(--accent-blue)" />}
            </button>
          </div>
        </header>

        <div className={styles.contentArea}>
          <div className={styles.tabPanel}>
            <WeatherWidget />
            <h3 className={styles.menuTitle} style={{marginTop: '1.5rem', fontSize: '1.1rem'}}>দ্রুত সেবা</h3>
            <div className={styles.quickServicesGrid}>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('agri')}>
                <Sprout size={28} color="#22c55e" />
                <span>কৃষি</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('prayer')}>
                <Moon size={28} color="#3b82f6" />
                <span>নামাজ</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('helpline')}>
                <PhoneCall size={28} color="#ef4444" />
                <span>হেল্পলাইন</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('scanner')}>
                <Camera size={28} color="#a855f7" />
                <span>রোগ নির্ণয়</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('reminder')}>
                <CalendarCheck size={28} color="#10b981" />
                <span>রিমাইন্ডার</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => setActiveSubScreen('calendar')}>
                <CalendarDays size={28} color="#eab308" />
                <span>পঞ্জিকা</span>
              </div>
            </div>
            <AgriNewsWidget />
          </div>
        </div>
      </div>
      
      <VoiceAssistant />
    </main>
  );
}
