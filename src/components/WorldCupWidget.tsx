"use client";

import React, { useState } from 'react';
import styles from './WorldCupWidget.module.css';

// Using Google-like tabs
type Tab = 'matches' | 'news' | 'standings';

// Dates
const dates = [
  { id: '13_jun', label: 'গতকাল, ১৩ জুন' },
  { id: '14_jun', label: 'আজ, ১৪ জুন' },
  { id: '15_jun', label: 'আগামীকাল, ১৫ জুন' },
];

export default function WorldCupWidget() {
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [activeDate, setActiveDate] = useState('14_jun');

  // Google-like match data structure based on BST
  const matchesByDate: Record<string, any[]> = {
    '13_jun': [
      {
        id: 'r1',
        group: 'গ্রুপ বি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'কাতার', flag: '🇶🇦', score: 1 },
        teamB: { name: 'সুইজারল্যান্ড', flag: '🇨🇭', score: 2 }
      },
      {
        id: 'r3',
        group: 'গ্রুপ ডি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'অস্ট্রেলিয়া', flag: '🇦🇺', score: 1 },
        teamB: { name: 'তুরস্ক', flag: '🇹🇷', score: 1 }
      }
    ],
    '14_jun': [
      {
        id: 'u1',
        group: 'গ্রুপ বি',
        status: '01:00 AM',
        isLive: false,
        teamA: { name: 'কাতার', flag: '🇶🇦', score: null },
        teamB: { name: 'সুইজারল্যান্ড', flag: '🇨🇭', score: null }
      },
      {
        id: 'u2',
        group: 'গ্রুপ সি',
        status: '04:00 AM',
        isLive: false,
        teamA: { name: 'ব্রাজিল', flag: '🇧🇷', score: null },
        teamB: { name: 'মরক্কো', flag: '🇲🇦', score: null }
      },
      {
        id: 'u3',
        group: 'গ্রুপ সি',
        status: '07:00 AM',
        isLive: false,
        teamA: { name: 'হাইতি', flag: '🇭🇹', score: null },
        teamB: { name: 'স্কটল্যান্ড', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', score: null }
      },
      {
        id: 'u4',
        group: 'গ্রুপ ডি',
        status: '10:00 AM',
        isLive: false,
        teamA: { name: 'অস্ট্রেলিয়া', flag: '🇦🇺', score: null },
        teamB: { name: 'তুরস্ক', flag: '🇹🇷', score: null }
      }
    ],
    '15_jun': [
      {
        id: 'u5',
        group: 'গ্রুপ এফ',
        status: '02:00 AM',
        isLive: false,
        teamA: { name: 'নেদারল্যান্ডস', flag: '🇳🇱', score: null },
        teamB: { name: 'জাপান', flag: '🇯🇵', score: null }
      },
      {
        id: 'u6',
        group: 'গ্রুপ ই',
        status: '05:00 AM',
        isLive: false,
        teamA: { name: 'আইভরি কোস্ট', flag: '🇨🇮', score: null },
        teamB: { name: 'ইকুয়েডর', flag: '🇪🇨', score: null }
      }
    ]
  };

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
              {(matchesByDate[activeDate] || []).map((match) => (
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
                      <span className={styles.statusText}>{match.status}</span>
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
                  {[
                    { pos: '১', team: 'ব্রাজিল', flag: '🇧🇷', played: '০', pts: '০' },
                    { pos: '২', team: 'মরক্কো', flag: '🇲🇦', played: '০', pts: '০' },
                    { pos: '৩', team: 'হাইতি', flag: '🇭🇹', played: '০', pts: '০' },
                    { pos: '৪', team: 'স্কটল্যান্ড', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', played: '০', pts: '০' }
                  ].map(team => (
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
