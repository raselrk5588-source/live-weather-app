// Ensure voices are loaded early by the browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export const speakBengali = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert("আপনার ব্রাউজার ভয়েস সাপোর্ট করে না।");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Explicitly set language
  utterance.lang = 'bn-BD';
  utterance.rate = 0.85; // Slower for clarity

  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a Bengali voice
  let bnVoice = voices.find(v => v.lang.includes('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));

  if (bnVoice) {
    // Use native Speech Synthesis
    utterance.voice = bnVoice;
    window.speechSynthesis.speak(utterance);
    return;
  }

  // Fallback: If no Bengali voice is found natively, use Google Translate TTS Audio (gtx client)
  try {
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=bn&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.play().catch(e => {
      console.error("Audio playback blocked or failed:", e);
      
      // Ultimate fallback: Just try to let the browser handle it natively even without a specific voice
      window.speechSynthesis.speak(utterance);
    });
  } catch (error) {
    console.error("Fallback TTS failed", error);
    window.speechSynthesis.speak(utterance);
  }
};
