"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import WeatherWidget from "../components/WeatherWidget";
import PrayerTimes from "../components/PrayerTimes";
import AgriDashboard from "../components/AgriDashboard";
import DiseaseScanner from "../components/DiseaseScanner";
import TaskReminder from "../components/TaskReminder";
import HelplineWidget from "../components/HelplineWidget";
import BengaliCalendarWidget from "../components/BengaliCalendarWidget";
import NewsWidget from "../components/NewsWidget";
import VoiceAssistant from "../components/VoiceAssistant";
import GroceryListWidget from "../components/GroceryListWidget";
import DailyQuotesWidget from "../components/DailyQuotesWidget";
import WorldCupWidget from "../components/WorldCupWidget";
import { Cloud, Sprout, Moon, MapPin, Moon as MoonIcon, Sun, PhoneCall, Camera, CalendarCheck, ArrowLeft, CalendarDays, ShoppingCart, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

type Tab = 'weather' | 'agri' | 'prayer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('weather');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingFeature, setPendingFeature] = useState<string | null>(null);
  
  const { theme, setTheme, location, setLocation } = useAppContext();
  const { isAuthenticated, userMobile, logout } = useAuth();
  const [locating, setLocating] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

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
  };

  const handleUnsubscribe = async () => {
    if (!userMobile || !confirm("আপনি কি আনসাবস্ক্রাইব করতে চান?")) return;
    
    setUnsubscribing(true);
    try {
      const res = await fetch('/api/need/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_mobile: userMobile }).toString()
      });
      const data = await res.json();
      if (data.success || data.subscriptionStatus === 'UNREGISTERED') {
        alert("সফলভাবে আনসাবস্ক্রাইব করা হয়েছে");
        logout();
      } else {
        alert(data.error || "আনসাবস্ক্রাইব করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      alert("সার্ভার ত্রুটি");
    } finally {
      setUnsubscribing(false);
    }
  };

  const handleFeatureClick = (feature: string) => {
    if (!isAuthenticated) {
      setPendingFeature(feature);
      setShowLoginModal(true);
    } else {
      setActiveSubScreen(feature);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingFeature) {
      setActiveSubScreen(pendingFeature);
      setPendingFeature(null);
    }
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
            {activeSubScreen === 'grocery' && 'বাজারের তালিকা'}
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
          {activeSubScreen === 'grocery' && <GroceryListWidget />}
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
              <h1>ইনফো পকেট</h1>
              <span>লাইভ</span>
            </div>
          </div>

          <div className={styles.headerControls}>
            {!isAuthenticated ? (
              <button 
                className={styles.subscribeBtn} 
                onClick={() => setShowLoginModal(true)}
              >
                সাবস্ক্রাইব করুন
              </button>
            ) : (
              <div className={styles.profileMenuContainer} ref={profileMenuRef}>
                <button 
                  className={styles.headerBtn} 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  title="প্রোফাইল"
                >
                  <User size={20} color="var(--text-primary)" />
                </button>
                
                {showProfileMenu && (
                  <div className={styles.profileDropdown}>
                    <span className={styles.userPhone}>{userMobile}</span>
                    <button 
                      className={styles.unsubscribeBtn} 
                      onClick={handleUnsubscribe}
                      disabled={unsubscribing}
                    >
                      {unsubscribing ? "অপেক্ষা করুন..." : "আনসাবস্ক্রাইব"}
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('agri')}>
                <Sprout size={28} color="#22c55e" />
                <span>কৃষি</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('prayer')}>
                <Moon size={28} color="#3b82f6" />
                <span>নামাজ</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('helpline')}>
                <PhoneCall size={28} color="#ef4444" />
                <span>হেল্পলাইন</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('reminder')}>
                <CalendarCheck size={28} color="#10b981" />
                <span>রিমাইন্ডার</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('calendar')}>
                <CalendarDays size={28} color="#eab308" />
                <span>পঞ্জিকা</span>
              </div>
              <div className={`${styles.quickCard} glass-panel`} onClick={() => handleFeatureClick('grocery')}>
                <ShoppingCart size={28} color="#f97316" />
                <span>বাজার</span>
              </div>
            </div>
            <DailyQuotesWidget />
            <WorldCupWidget />
            <NewsWidget />
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
          setPendingFeature(null);
        }} 
        onSuccess={handleLoginSuccess} 
      />
    </main>
  );
}
