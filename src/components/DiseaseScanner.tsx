"use client";

import React, { useState } from 'react';
import styles from './DiseaseScanner.module.css';
import { Camera, Image as ImageIcon, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { speakBengali } from '../utils/speak';

type ScanStatus = 'idle' | 'scanning' | 'result';

export default function DiseaseScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  
  const handleScan = () => {
    setStatus('scanning');
    speakBengali("স্ক্যান করা হচ্ছে, দয়া করে অপেক্ষা করুন");
    
    // Simulate API call and AI processing time
    setTimeout(() => {
      setStatus('result');
      speakBengali("স্ক্যান সম্পন্ন হয়েছে। এটি ধানের ব্লাস্ট রোগ। বিস্তারিত প্রতিকার স্ক্রিনে দেখুন।");
    }, 3000);
  };

  const resetScanner = () => {
    setStatus('idle');
  };

  return (
    <div className={styles.container}>
      {status !== 'result' && (
        <div className={styles.scannerArea}>
          <div className={styles.viewfinder}>
            {status === 'idle' ? (
               <Camera size={64} className={styles.scanIcon} strokeWidth={1} />
            ) : (
               <div className={styles.viewfinderInner}>
                 <div className={styles.laser}></div>
               </div>
            )}
          </div>
          
          <div className={styles.statusText}>
            {status === 'idle' ? 'পাতার ছবি ফ্রেমে রাখুন' : 'এআই স্ক্যান করছে...'}
          </div>

          {status === 'idle' && (
            <div className={styles.controls}>
              <button className={styles.galleryBtn} title="গ্যালারি থেকে নিন">
                <ImageIcon size={24} />
              </button>
              <button className={styles.captureBtn} onClick={handleScan} title="ছবি তুলুন">
                <Camera size={28} />
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'result' && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.iconWarning}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className={styles.diseaseName}>ধানের ব্লাস্ট রোগ</h3>
              <span className={styles.accuracy}>৯২% নিশ্চয়তা (AI)</span>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            পাতায় চোখের মত দাগ দেখা যাচ্ছে। এটি ছত্রাকজনিত একটি মারাত্মক রোগ।
          </p>

          <div className={styles.adviceBox}>
            <h4>
              <CheckCircle size={18} />
              প্রতিকার
            </h4>
            <ul className={styles.adviceList}>
              <li>জমিতে ৫-৭ সে.মি. পানি ধরে রাখুন।</li>
              <li>অতিরিক্ত ইউরিয়া সার প্রয়োগ বন্ধ করুন।</li>
              <li>ট্রাইসাইক্লাজল (যেমন- ট্রুপার ৭৫ ডব্লিউপি) ৮ গ্রাম/১০ লিটার হারে পানিতে মিশিয়ে স্প্রে করুন।</li>
            </ul>
          </div>

          <button className={styles.retakeBtn} onClick={resetScanner}>
            <RefreshCw size={20} />
            আবার স্ক্যান করুন
          </button>
        </div>
      )}
    </div>
  );
}
