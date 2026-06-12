import React from 'react';
import styles from './HelplineWidget.module.css';
import { PhoneCall, Phone, AlertTriangle } from 'lucide-react';

export default function HelplineWidget() {
  return (
    <div className={`${styles.helplineContainer} glass-panel`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AlertTriangle size={20} className={styles.iconAlert} />
          <h3>জরুরি হেল্পলাইন</h3>
        </div>
        <span className={styles.badge}>টোল-ফ্রি</span>
      </div>
      
      <div className={styles.buttonsGrid}>
        <a href="tel:16123" className={`${styles.callBtn} ${styles.btnAgri}`}>
          <PhoneCall size={20} />
          <div className={styles.btnText}>
            <span className={styles.number}>১৬১২৩</span>
            <span className={styles.label}>কৃষি কল সেন্টার</span>
          </div>
        </a>
        
        <a href="tel:333" className={`${styles.callBtn} ${styles.btnNational}`}>
          <Phone size={20} />
          <div className={styles.btnText}>
            <span className={styles.number}>৩৩৩</span>
            <span className={styles.label}>জাতীয় তথ্য সেবা</span>
          </div>
        </a>

        <a href="tel:999" className={`${styles.callBtn} ${styles.btnEmergency}`}>
          <AlertTriangle size={20} />
          <div className={styles.btnText}>
            <span className={styles.number}>৯৯৯</span>
            <span className={styles.label}>জরুরি পুলিশ/ফায়ার</span>
          </div>
        </a>
      </div>
    </div>
  );
}
