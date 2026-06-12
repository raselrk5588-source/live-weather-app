"use client";

import React from 'react';
import styles from './AgriNewsWidget.module.css';
import { Newspaper, Clock } from 'lucide-react';

const NEWS_DATA = [
  {
    id: 1,
    type: 'govt',
    badge: 'সরকারি নোটিশ',
    headline: 'আগামী সপ্তাহে কৃষকদের মাঝে বিনামূল্যে আউশ ধানের বীজ বিতরণ শুরু',
    time: '২ ঘন্টা আগে',
  },
  {
    id: 2,
    type: 'alert',
    badge: 'সতর্কতা',
    headline: 'উত্তরাঞ্চলে কালবৈশাখী ঝড়ের পূর্বাভাস, পাকা ধান দ্রুত কেটে ফেলার নির্দেশ',
    time: '৫ ঘন্টা আগে',
  },
  {
    id: 3,
    type: 'news',
    badge: 'কৃষি সংবাদ',
    headline: 'নতুন উদ্ভাবিত জিংক সমৃদ্ধ ধানের বাম্পার ফলন, কৃষকদের মুখে হাসি',
    time: 'গতকাল',
  }
];

export default function AgriNewsWidget() {
  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'govt': return styles.badgeGovt;
      case 'alert': return styles.badgeAlert;
      case 'news': return styles.badgeNews;
      default: return styles.badgeNews;
    }
  };

  return (
    <div className={styles.newsContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Newspaper size={20} color="var(--accent-blue)" />
          কৃষি সংবাদ ও নোটিশ
        </div>
        <span className={styles.seeAll}>সব দেখুন</span>
      </div>

      <div className={styles.newsList}>
        {NEWS_DATA.map((news) => (
          <div key={news.id} className={styles.newsCard}>
            <span className={`${styles.newsBadge} ${getBadgeClass(news.type)}`}>
              {news.badge}
            </span>
            <h4 className={styles.newsHeadline}>{news.headline}</h4>
            <div className={styles.newsFooter}>
              <Clock size={14} />
              <span>{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
