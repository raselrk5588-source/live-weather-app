import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

// English to Bengali helper
const enToBnNums = (str: string) => str.replace(/\d/g, x => '০১২৩৪৫৬৭৮৯'[parseInt(x)]);

// Known team names translation
const teamNamesBn: Record<string, string> = {
  "Germany": "জার্মানি", "Spain": "স্পেন", "Cape Verde": "কেপ ভার্দে",
  "Brazil": "ব্রাজিল", "Morocco": "মরক্কো", "Haiti": "হাইতি",
  "Scotland": "স্কটল্যান্ড", "Australia": "অস্ট্রেলিয়া", "Turkey": "তুরস্ক",
  "Curacao": "কুরাসাও", "Netherlands": "নেদারল্যান্ডস", "Japan": "জাপান",
  "Ivory Coast": "আইভরি কোস্ট", "Ecuador": "ইকুয়েডর", "Tunisia": "তিউনিসিয়া",
  "Sweden": "সুইডেন", "Belgium": "বেলজিয়াম", "Egypt": "মিশর", "USA": "যুক্তরাষ্ট্র"
};

async function fetchESPN(dateYMD: string) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dateYMD}`;
    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.events || [];
    } catch (err) {
        console.error('ESPN fetch error', err);
        return [];
    }
}

export async function GET() {
  const today = new Date();
  
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  };

  const d1 = new Date(today); d1.setDate(today.getDate() - 1);
  const d2 = new Date(today);
  const d3 = new Date(today); d3.setDate(today.getDate() + 1);

  // Fetch 3 days of events
  const [eventsY, eventsT, eventsTom] = await Promise.all([
      fetchESPN(formatDate(d1)),
      fetchESPN(formatDate(d2)),
      fetchESPN(formatDate(d3))
  ]);

  const allEvents = [...eventsY, ...eventsT, ...eventsTom];

  const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const enMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  const getTab = (offset: number, labelPrefix: string) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const id = `${d.getDate()}_${enMonths[d.getMonth()]}`;
    const label = `${labelPrefix}, ${enToBnNums(d.getDate().toString())} ${bnMonths[d.getMonth()]}`;
    return { id, label, dateObj: d };
  };

  const tabs = [
    getTab(-1, 'গতকাল'),
    getTab(0, 'আজ'),
    getTab(1, 'আগামীকাল')
  ];

  const matchesByDate: Record<string, any[]> = {
    [tabs[0].id]: [],
    [tabs[1].id]: [],
    [tabs[2].id]: []
  };

  // Group events by Bangladesh Local Date
  allEvents.forEach(e => {
      const d = new Date(e.date);
      // Get the local date string in Bangladesh time
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', year: 'numeric', month: 'numeric', day: 'numeric' });
      const parts = formatter.formatToParts(d);
      const bdMonth = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1;
      const bdDay = parseInt(parts.find(p => p.type === 'day')?.value || '1');
      
      const eventTabId = `${bdDay}_${enMonths[bdMonth]}`;

      if (matchesByDate[eventTabId]) {
          const comp = e.competitions[0];
          const t1 = comp.competitors[0];
          const t2 = comp.competitors[1];
          
          const isLive = comp.status.type.state === 'in';
          const isPost = comp.status.type.state === 'post';
          let statusStr = comp.status.type.shortDetail;
          
          if (isPost) {
              statusStr = 'FT';
          } else if (!isLive && !isPost) {
              const timeEn = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' });
              statusStr = enToBnNums(timeEn);
          } else if (isLive) {
              statusStr = enToBnNums(String(comp.status.displayClock)) + "'";
          }

          const getScore = (score: string) => {
               if (!isLive && !isPost) return null;
               return enToBnNums(score || '0');
          };

          matchesByDate[eventTabId].push({
              id: e.id,
              group: e.season?.slug === 'group-stage' ? 'গ্রুপ পর্ব' : 'বিশ্বকাপ',
              status: statusStr,
              isLive: isLive,
              teamA: { 
                  name: teamNamesBn[t1.team.name] || t1.team.name, 
                  flag: '⚽', 
                  score: getScore(t1.score) 
              },
              teamB: { 
                  name: teamNamesBn[t2.team.name] || t2.team.name, 
                  flag: '⚽', 
                  score: getScore(t2.score) 
              }
          });
      }
  });

  // Remove duplicate matches if ESPN returns overlap in dates
  for (const key in matchesByDate) {
      const uniqueIds = new Set();
      matchesByDate[key] = matchesByDate[key].filter((m: any) => {
          if (uniqueIds.has(m.id)) return false;
          uniqueIds.add(m.id);
          return true;
      });
  }

  // Add dummy standings to prevent widget crash
  const standings = [
    { pos: '১', team: 'স্পেন', flag: '🇪🇸', played: '১', pts: '৩' },
    { pos: '২', team: 'জার্মানি', flag: '🇩🇪', played: '১', pts: '৩' },
    { pos: '৩', team: 'ব্রাজিল', flag: '🇧🇷', played: '০', pts: '০' },
    { pos: '৪', team: 'আর্জেন্টিনা', flag: '🇦🇷', played: '০', pts: '০' }
  ];

  return NextResponse.json({
    matchesByDate,
    standings,
    tabs: tabs.map(t => ({ id: t.id, label: t.label }))
  });
}
