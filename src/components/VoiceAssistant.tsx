"use client";

import React, { useState } from 'react';
import styles from './VoiceAssistant.module.css';
import { Mic, X } from 'lucide-react';
import { speakBengali } from '../utils/speak';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsListening(true);
      setMessage('বলুন, আপনি কী জানতে চান?');
      speakBengali('বলুন, আপনি কী জানতে চান?');
      
      // Simulate listening and responding
      setTimeout(() => {
        setMessage('আজকের ধানের বাজার মূল্য ১,২৫০ টাকা প্রতি টন।');
        speakBengali('আজকের ধানের বাজার মূল্য এক হাজার দুইশত পঞ্চাশ টাকা প্রতি টন।');
        setIsListening(false);
        
        setTimeout(() => {
          setIsOpen(false);
        }, 5000);
      }, 3500);
    } else {
      setIsOpen(false);
      setIsListening(false);
    }
  };

  return (
    <div className={styles.voiceContainer}>
      {isOpen && (
        <div className={styles.dialogueBox}>
          <div>{message}</div>
          {isListening && (
            <div className={styles.waves}>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
              <div className={styles.wave}></div>
            </div>
          )}
        </div>
      )}
      
      <button 
        className={`${styles.fabBtn} ${isListening ? styles.active : ''}`} 
        onClick={handleToggle}
      >
        {isOpen && !isListening ? <X size={28} /> : <Mic size={28} />}
      </button>
    </div>
  );
}
