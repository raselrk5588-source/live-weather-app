"use client";

import React, { useState, useRef } from 'react';
import styles from './DiseaseScanner.module.css';
import { Camera, Image as ImageIcon, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { speakBengali } from '../utils/speak';

type ScanStatus = 'idle' | 'scanning' | 'result';

interface ScanResult {
  diseaseName: string;
  accuracy: string;
  description: string;
  remedies: string[];
}

export default function DiseaseScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('scanning');
    setErrorMsg(null);
    speakBengali("স্ক্যান করা হচ্ছে, দয়া করে অপেক্ষা করুন");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/scan-disease", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scan image");
      }

      setResult(data);
      setStatus('result');
      speakBengali(`স্ক্যান সম্পন্ন হয়েছে। এটি ${data.diseaseName}। বিস্তারিত প্রতিকার স্ক্রিনে দেখুন।`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('idle');
      speakBengali("দুঃখিত, স্ক্যান করতে সমস্যা হয়েছে।");
    }
  };

  const resetScanner = () => {
    setStatus('idle');
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className={styles.container}>
      {/* Hidden file inputs */}
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        style={{ display: 'none' }} 
        ref={cameraInputRef} 
        onChange={handleFileChange} 
      />

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
          
          {errorMsg && (
            <div style={{ color: 'var(--accent-red, #ef4444)', fontSize: '0.85rem', marginTop: '8px', textAlign: 'center', padding: '0 10px' }}>
              {errorMsg}
            </div>
          )}

          {status === 'idle' && (
            <div className={styles.controls}>
              <button 
                className={styles.galleryBtn} 
                title="গ্যালারি থেকে নিন"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={24} />
              </button>
              <button 
                className={styles.captureBtn} 
                title="ছবি তুলুন"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera size={28} />
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'result' && result && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.iconWarning}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className={styles.diseaseName}>{result.diseaseName}</h3>
              <span className={styles.accuracy}>{result.accuracy}</span>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {result.description}
          </p>

          <div className={styles.adviceBox}>
            <h4>
              <CheckCircle size={18} />
              প্রতিকার
            </h4>
            <ul className={styles.adviceList}>
              {result.remedies.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
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
