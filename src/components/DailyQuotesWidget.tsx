"use client";

import { useState, useEffect } from "react";
import styles from "./DailyQuotesWidget.module.css";
import { Sparkles, RefreshCw, Quote } from "lucide-react";

const QUOTES = [
  { text: "যেখানে পরিশ্রম নেই, সেখানে সাফল্য নেই।", author: "উইলিয়াম ল্যাংল্যান্ড" },
  { text: "সমস্যাকে ভয় পেয়ো না, সমস্যাই তোমাকে নতুন পথ দেখাবে।", author: "সংগৃহীত" },
  { text: "আজকের কাজ কালকের জন্য ফেলে রাখা মানে নিজের সাফল্যকে পিছিয়ে দেওয়া।", author: "সংগৃহীত" },
  { text: "কষ্ট ছাড়া কেষ্ট মেলে না।", author: "বাংলা প্রবাদ" },
  { text: "ধৈর্য তেতো হলেও এর ফল খুব মিষ্টি।", author: "জ্যাঁ জ্যাক রুশো" },
  { text: "নিজেকে পরিবর্তন করো, পৃথিবী এমনিতেই পরিবর্তন হয়ে যাবে।", author: "সক্রেটিস" },
  { text: "সফলতা মানে ৯৯ বার পড়ে গিয়ে ১০০ তম বার উঠে দাঁড়ানো।", author: "কনফুসিয়াস" },
  { text: "কৃষকের ঘামেই দেশের আসল সমৃদ্ধি।", author: "সংগৃহীত" },
  { text: "যে মাঠে বীজ বোনে, সে কখনো নিরাশ হয় না।", author: "সংগৃহীত" }
];

export default function DailyQuotesWidget() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Generate a pseudo-random quote based on the current day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setQuoteIndex(dayOfYear % QUOTES.length);
  }, []);

  const changeQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const currentQuote = QUOTES[quoteIndex];

  return (
    <div className={styles.container}>
      <Quote size={120} className={styles.bgIcon} />
      
      <div className={styles.header}>
        <Sparkles size={16} color="var(--accent-yellow)" />
        <span className={styles.headerText}>দৈনিক অনুপ্রেরণা</span>
      </div>

      <div className={styles.quoteContent}>
        <p className={styles.quoteText}>{currentQuote.text}</p>
        <span className={styles.author}>{currentQuote.author}</span>
      </div>

      <div className={styles.actions}>
        <button onClick={changeQuote} className={styles.refreshBtn} title="অন্য উক্তি দেখুন">
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
