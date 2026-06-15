import React, { useState } from 'react';
import styles from './LoginModal.module.css';
import { useAuth } from '../context/AuthContext';
import { X, Phone, Lock, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('দয়া করে আপনার মোবাইল নম্বর দিন');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // প্রথমে সাবস্ক্রিপশন চেক করা হচ্ছে
      const checkRes = await fetch('/api/need/check_subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_mobile: phone }).toString()
      });

      const checkData = await checkRes.json();

      if (checkData.subscriptionStatus === 'REGISTERED') {
        login(phone, 'REGISTERED');
        onSuccess();
        return;
      }

      // সাবস্ক্রাইব করা না থাকলে OTP পাঠানো হচ্ছে
      const res = await fetch('/api/need/send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_mobile: phone }).toString()
      });
      
      const data = await res.json();
      
      if (data.success) {
        setReferenceNo(data.referenceNo);
        setStep('otp');
      } else {
        setError(data.message || 'OTP পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError('সার্ভার ত্রুটি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('দয়া করে OTP দিন');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/need/verify_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ Otp: otp, referenceNo }).toString()
      });
      
      const data = await res.json();
      
      if (data.statusCode === 'S1000' || data.statusCode === 'SUCCESS' || data.subscriptionStatus === 'REGISTERED') {
        login(phone, data.subscriptionStatus || 'REGISTERED');
        onSuccess();
      } else {
        setError(data.statusDetail || 'ভুল OTP। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError('সার্ভার ত্রুটি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} animate-scale-up glass-panel`}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={styles.header}>
          <h2>{step === 'phone' ? 'লগইন করুন' : 'OTP যাচাই করুন'}</h2>
          <p>{step === 'phone' 
            ? 'ফিচারটি ব্যবহার করতে আপনার মোবাইল নম্বর দিয়ে লগইন করুন' 
            : 'আপনার মোবাইলে পাঠানো OTP টি দিন'}</p>
        </div>

        <form onSubmit={step === 'phone' ? handlePhoneSubmit : handleOtpSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          {step === 'phone' ? (
            <div className={styles.inputGroup}>
              <Phone size={20} className={styles.icon} />
              <input 
                type="tel" 
                placeholder="01XXXXXXXXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <Lock size={20} className={styles.icon} />
              <input 
                type="text" 
                placeholder="XXXXXX" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                maxLength={6}
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 size={20} className={styles.spin} /> : 'পরবর্তী ধাপ'}
          </button>
          
          {step === 'otp' && (
            <button 
              type="button" 
              className={styles.backBtn} 
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              নম্বর পরিবর্তন করুন
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
