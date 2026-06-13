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
            <h2>World Cup 2026</h2>
            <p>Men's tournament</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className={styles.mainTabs}>
        <button 
          className={`${styles.mainTab} ${activeTab === 'matches' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('matches')}
        >Matches</button>
        <button 
          className={`${styles.mainTab} ${activeTab === 'news' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('news')}
        >News</button>
        <button 
          className={`${styles.mainTab} ${activeTab === 'standings' ? styles.activeMainTab : ''}`}
          onClick={() => setActiveTab('standings')}
        >Standings</button>
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

        {activeTab !== 'matches' && (
          <div className={styles.placeholderState}>
            <p>More information coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
