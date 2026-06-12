"use client";

import React, { useState } from 'react';
import styles from './FertilizerCalculator.module.css';
import { Calculator } from 'lucide-react';
import { toBengaliNumber } from '../utils/number';

// Rates per decimal (শতাংশ) in KG - Based on approximate BARC standard recommendations
const FERTILIZER_RATES: Record<string, { urea: number; tsp: number; potash: number }> = {
  boro: { urea: 1.1, tsp: 0.4, potash: 0.5 },
  aman: { urea: 0.7, tsp: 0.3, potash: 0.35 },
  wheat: { urea: 0.9, tsp: 0.5, potash: 0.4 },
  maize: { urea: 2.0, tsp: 0.9, potash: 0.8 },
  potato: { urea: 1.4, tsp: 0.8, potash: 1.0 },
  onion: { urea: 1.0, tsp: 0.6, potash: 0.6 },
  jute: { urea: 0.6, tsp: 0.2, potash: 0.2 },
  tomato: { urea: 1.2, tsp: 0.8, potash: 0.6 },
};

export default function FertilizerCalculator() {
  const [crop, setCrop] = useState('boro');
  const [landSize, setLandSize] = useState('');
  const [unit, setUnit] = useState('decimal');
  const [result, setResult] = useState<{ urea: number; tsp: number; potash: number } | null>(null);

  const calculate = () => {
    let sizeInDecimal = parseFloat(landSize);
    if (isNaN(sizeInDecimal) || sizeInDecimal <= 0) return;

    if (unit === 'bigha') {
      sizeInDecimal = sizeInDecimal * 33; // 1 Bigha = 33 Decimal
    }

    const rates = FERTILIZER_RATES[crop];
    setResult({
      urea: sizeInDecimal * rates.urea,
      tsp: sizeInDecimal * rates.tsp,
      potash: sizeInDecimal * rates.potash
    });
  };

  return (
    <div className={`${styles.calculatorContainer} glass-panel`}>
      <h3 className={styles.calcTitle}>
        <Calculator size={22} color="var(--accent-green)" />
        সার ক্যালকুলেটর
      </h3>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>ফসলের নাম</label>
        <select className={styles.select} value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="boro">বোরো ধান</option>
          <option value="aman">আমন ধান</option>
          <option value="wheat">গম</option>
          <option value="maize">ভুট্টা</option>
          <option value="potato">আলু</option>
          <option value="onion">পেঁয়াজ</option>
          <option value="tomato">টমেটো</option>
          <option value="jute">পাট</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label className={styles.label}>জমির পরিমাণ</label>
          <input 
            type="number" 
            className={styles.input} 
            placeholder="যেমন: ১০" 
            value={landSize}
            onChange={(e) => setLandSize(e.target.value)}
          />
        </div>
        <div className={styles.formGroup} style={{ width: '120px' }}>
          <label className={styles.label}>একক</label>
          <select className={styles.select} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="decimal">শতাংশ</option>
            <option value="bigha">বিঘা</option>
          </select>
        </div>
      </div>

      <button className={styles.calcBtn} onClick={calculate}>হিসাব করুন</button>

      {result && (
        <div className={styles.resultBox}>
          <h4 className={styles.resultTitle}>প্রয়োজনীয় সারের পরিমাণ:</h4>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.fertName}>ইউরিয়া</span>
              <span className={styles.fertAmount}>{toBengaliNumber(result.urea.toFixed(1))} কেজি</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.fertName}>টিএসপি</span>
              <span className={styles.fertAmount}>{toBengaliNumber(result.tsp.toFixed(1))} কেজি</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.fertName}>পটাশ</span>
              <span className={styles.fertAmount}>{toBengaliNumber(result.potash.toFixed(1))} কেজি</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
