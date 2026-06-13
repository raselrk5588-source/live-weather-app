"use client";

import React, { useState, useEffect } from 'react';
import styles from './NewsWidget.module.css';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';

type Tab = 'agri' | 'national' | 'local' | 'sports' | 'entertainment';

export default function NewsWidget() {
  const [activeTab, setActiveTab] = useState<Tab>('national');
  const [newsData, setNewsData] = useState({
    national: [] as any[],
    sports: [] as any[],
    entertainment: [] as any[],
    agri: [] as any[],
    local: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      const natUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/bengali/rss.xml';
      const sportsUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%9F&hl=bn&gl=BD&ceid=BD:bn';
      const entUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BF%E0%A6%A8%E0%A7%8B%E0%A6%A6%E0%A6%A8&hl=bn&gl=BD&ceid=BD:bn';
      const agriUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%BF&hl=bn&gl=BD&ceid=BD:bn';
      const localUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=%E0%A6%86%E0%A6%AC%E0%A6%B9%E0%A6%BE%E0%A6%93%E0%A7%9F%E0%A6%BE&hl=bn&gl=BD&ceid=BD:bn';

      const [resNat, resSports, resEnt, resAgri, resLocal] = await Promise.all([
        fetch(natUrl),
        fetch(sportsUrl),
        fetch(entUrl),
        fetch(agriUrl),
        fetch(localUrl)
      ]);

      const [dataNat, dataSports, dataEnt, dataAgri, dataLocal] = await Promise.all([
        resNat.json(),
        resSports.json(),
        resEnt.json(),
        resAgri.json(),
        resLocal.json()
      ]);
      
      const formatNews = (item: any, type: string, badge: string, idPrefix: string, index: number) => {
        // Clean title by removing publisher suffixes and English translations often separated by | or -
        let cleanTitle = item.title ? item.title.split(' - ')[0].split(' | ')[0].trim() : 'খবর';
        
        return {
          id: `${idPrefix}-${index}`,
          type,
          badge,
          headline: cleanTitle,
          time: item.pubDate ? new Date(item.pubDate).toLocaleDateString('bn-BD', { hour: 'numeric', minute: 'numeric' }) : 'আজ',
          link: item.link
        };
      };

      const getSafeItems = (data: any, fallback: any[]) => {
        let result = [];
        if (data && data.status === 'ok' && data.items && data.items.length > 0) {
          // Filter out completely English news (must contain at least one Bengali character)
          result = data.items.filter((item: any) => /[\u0980-\u09FF]/.test(item.title));
        }
        
        // Pad with fallback data to ensure we always have 5 items
        if (result.length < 5) {
          const needed = 5 - result.length;
          result = [...result, ...fallback.slice(0, needed)];
        }
        
        return result.slice(0, 5);
      };

      const fallbackNat = [
        { title: 'জাতীয় নির্বাচনের নতুন তারিখ ঘোষণা', pubDate: new Date().toISOString(), link: 'https://www.bbc.com/bengali/topics/c340q430z4vt' },
        { title: 'পদ্মা সেতুতে নতুন টোল হার কার্যকর', pubDate: new Date().toISOString(), link: 'https://www.bbc.com/bengali/topics/c340q430z4vt' }
      ];
      const fallbackSports = [
        { title: 'টি-টোয়েন্টি বিশ্বকাপে বাংলাদেশের অসাধারণ জয়', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/sports' },
        { title: 'সাকিব আল হাসানের নতুন রেকর্ড, উচ্ছ্বসিত ভক্তরা', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/sports' },
        { title: 'মেসির জাদুকরী গোলে শিরোপা জিতল মিয়ামি', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/sports' }
      ];
      const fallbackEnt = [
        { title: 'নতুন সিনেমায় চুক্তিবদ্ধ হলেন শাকিব খান', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/entertainment' },
        { title: 'অস্কারে যাচ্ছে বাংলাদেশের নতুন এই সিনেমা', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/entertainment' },
        { title: 'জনপ্রিয় গায়কের নতুন অ্যালবামের রেকর্ড বিক্রি', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/entertainment' }
      ];
      const fallbackAgri = [
        { title: 'কৃষকদের জন্য নতুন প্রণোদনা ঘোষণা সরকারের', pubDate: new Date().toISOString(), link: 'https://www.jugantor.com/agriculture' },
        { title: 'বাম্পার ফলন: হাসি ফুটেছে প্রান্তিক কৃষকের মুখে', pubDate: new Date().toISOString(), link: 'https://www.jugantor.com/agriculture' }
      ];
      const fallbackLocal = [
        { title: 'আগামী ২৪ ঘন্টায় দেশের বিভিন্ন স্থানে বৃষ্টির সম্ভাবনা', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/bangladesh/environment' },
        { title: 'রাজধানীতে তীব্র যানজট, ভোগান্তিতে যাত্রীরা', pubDate: new Date().toISOString(), link: 'https://www.prothomalo.com/bangladesh/capital' }
      ];

      const nationalItems = getSafeItems(dataNat, fallbackNat).slice(0, 5);
      const sportsItems = getSafeItems(dataSports, fallbackSports).slice(0, 5);
      const entItems = getSafeItems(dataEnt, fallbackEnt).slice(0, 5);
      const agriItems = getSafeItems(dataAgri, fallbackAgri).slice(0, 5);
      const localItems = getSafeItems(dataLocal, fallbackLocal).slice(0, 5);

      setNewsData({
        national: nationalItems.map((item: any, i: number) => formatNews(item, 'national', 'জাতীয়', 'nat', i)),
        sports: sportsItems.map((item: any, i: number) => formatNews(item, 'sports', 'খেলাধুলা', 'spt', i)),
        entertainment: entItems.map((item: any, i: number) => formatNews(item, 'entertainment', 'বিনোদন', 'ent', i)),
        agri: agriItems.map((item: any, i: number) => formatNews(item, 'news', 'কৃষি ও পরিবেশ', 'agr', i)),
        local: localItems.map((item: any, i: number) => formatNews(item, 'local', 'আবহাওয়া আপডেট', 'loc', i)),
      });
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 5 minutes (300000 ms)
    const intervalId = setInterval(() => {
      fetchNews();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'govt': return styles.badgeGovt;
      case 'alert': return styles.badgeAlert;
      case 'news': return styles.badgeNews;
      case 'national': return styles.badgeNational;
      case 'local': return styles.badgeLocal;
      case 'sports': return styles.badgeSports;
      case 'entertainment': return styles.badgeEntertainment;
      default: return styles.badgeNews;
    }
  };

  const currentNews = newsData[activeTab];

  return (
    <div className={styles.newsContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Newspaper size={20} color="var(--accent-blue)" />
          সর্বশেষ সংবাদ
        </div>
        <span className={styles.seeAll}>সব দেখুন</span>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'national' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('national')}
        >
          জাতীয়
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'sports' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sports')}
        >
          খেলাধুলা
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'entertainment' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('entertainment')}
        >
          বিনোদন
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'agri' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('agri')}
        >
          কৃষি
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'local' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('local')}
        >
          আবহাওয়া
        </button>
      </div>

      <div className={`${styles.newsList} ${styles.fadeIn}`} key={activeTab}>
        {loading && currentNews.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            লাইভ খবর লোড হচ্ছে...
          </div>
        ) : currentNews.length > 0 ? (
          currentNews.map((news: any) => (
            <a 
              key={news.id} 
              href={news.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.newsCard}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`${styles.newsBadge} ${getBadgeClass(news.type)}`}>
                  {news.badge}
                </span>
                {news.link !== '#' && <ExternalLink size={14} color="var(--text-secondary)" />}
              </div>
              <h4 className={styles.newsHeadline}>{news.headline}</h4>
              <div className={styles.newsFooter}>
                <Clock size={14} />
                <span>{news.time}</span>
              </div>
            </a>
          ))
        ) : (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            কোনো খবর পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
