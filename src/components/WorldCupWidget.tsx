"use client";

import React, { useState, useEffect } from 'react';
import styles from './WorldCupWidget.module.css';

// Using Google-like tabs
type Tab = 'matches' | 'news' | 'standings';

export default function WorldCupWidget() {
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [activeDate, setActiveDate] = useState('');
  const [dates, setDates] = useState<{id: string, label: string}[]>([]);
  const [matchesByDate, setMatchesByDate] = useState<Record<string, any[]>>({});
  const [standings, setStandings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/sports/worldcup');
        const data = await res.json();
        setMatchesByDate(data.matchesByDate);
        setStandings(data.standings);
        setDates(data.tabs);
        if (!activeDate && data.tabs.length > 0) {
          setActiveDate(data.tabs[1].id); // Default to 'Today'
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch sports data', err);
        setIsLoading(false);
      }
    };
    
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 30000); // Auto-update every 30s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.widgetContainer}>
      {/* Header section similar to Google Search Top */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.logoIcon}>⚽</span>
          <div>
            <h2>বিশ্বকাপ ২০২৬</h2>
            <p>পুরুষদের টুর্নামেন্ট</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className={styles.mainTabs}>
        <button 
          className={`${styles.mainTab} ${activeTab === 'matches' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('matches')}
        >ম্যাচ</button>
        <button 
          className={`${styles.mainTab} ${activeTab === 'news' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('news')}
        >খবর</button>
        <button 
          className={`${styles.mainTab} ${activeTab === 'standings' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('standings')}
        >পয়েন্ট টেবিল</button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === 'matches' && (
          <div className={styles.matchesSection}>
            {/* Date Selector */}
            <div className={styles.dateSelector}>
              {dates.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.dateBtn} ${activeDate === d.id ? styles.activeDateBtn : ''}`}
                  onClick={() => setActiveDate(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Match List */}
            <div className={styles.matchList}>
              {isLoading ? (
                <div className={styles.placeholderState}>ম্যাচের তথ্য লোড হচ্ছে...</div>
              ) : (!matchesByDate[activeDate] || matchesByDate[activeDate].length === 0) ? (
                <div className={styles.placeholderState} style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>এই দিনে কোনো ম্যাচ নেই</div>
              ) : matchesByDate[activeDate].map((match) => (
                <div key={match.id} className={styles.googleMatchCard}>
                  <div className={styles.matchGroupInfo}>{match.group}</div>
                  
                  <div className={styles.matchCardBody}>
                    <div className={styles.teamsSection}>
                      <div className={styles.teamRow}>
                        <div className={styles.teamNameWrapper}>
                          <span className={styles.flag}>{match.teamA.flag}</span>
                          <span className={styles.teamName}>{match.teamA.name}</span>
                        </div>
                        {match.teamA.score !== null && <span className={styles.teamScore}>{match.teamA.score}</span>}
                      </div>
                      
                      <div className={styles.teamRow}>
                        <div className={styles.teamNameWrapper}>
                          <span className={styles.flag}>{match.teamB.flag}</span>
                          <span className={styles.teamName}>{match.teamB.name}</span>
                        </div>
                        {match.teamB.score !== null && <span className={styles.teamScore}>{match.teamB.score}</span>}
                      </div>
                    </div>
                    
                    <div className={styles.matchStatusSection}>
                      {match.isLive && <span className={styles.liveIndicator}>LIVE</span>}
                      <span className={match.isLive ? styles.liveStatusText : styles.statusText}>{match.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className={styles.newsSection} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 1, title: '২০২৬ বিশ্বকাপে নতুন ফরম্যাটে খেলা হবে, বাড়ছে দলের সংখ্যা', time: '২ ঘণ্টা আগে', source: 'খেলার খবর' },
              { id: 2, title: 'ব্রাজিল দলে নতুন চমক, তরুণদের সুযোগ', time: '৫ ঘণ্টা আগে', source: 'স্পোর্টস ডাইজেস্ট' },
              { id: 3, title: 'বিশ্বকাপের ভেন্যুগুলোর প্রস্তুতি প্রায় শেষ পর্যায়ে', time: '১ দিন আগে', source: 'ফুটবল আপডেট' }
            ].map(news => (
              <div key={news.id} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>{news.title}</h4>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#718096' }}>
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'standings' && (
          <div className={styles.standingsSection}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#a0aec0', textTransform: 'uppercase' }}>গ্রুপ সি (Group C)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#e2e8f0' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#718096', textAlign: 'left' }}>
                    <th style={{ padding: '6px 4px', fontWeight: '500' }}>#</th>
                    <th style={{ padding: '6px 4px', fontWeight: '500' }}>দল</th>
                    <th style={{ padding: '6px 4px', fontWeight: '500', textAlign: 'center' }}>ম্যাচ</th>
                    <th style={{ padding: '6px 4px', fontWeight: '500', textAlign: 'center' }}>পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>লোড হচ্ছে...</td></tr>
                  ) : standings.map((team, idx) => (
                    <tr key={team.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '8px 4px' }}>{team.pos}</td>
                      <td style={{ padding: '8px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{team.flag}</span>
                        <span style={{ fontWeight: '600' }}>{team.team}</span>
                      </td>
                      <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.played}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '700' }}>{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
