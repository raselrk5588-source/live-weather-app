import { NextResponse } from 'next/server';

export const dynamic = "force-static";
export async function GET() {
  const matchesByDate = {
    '13_jun': [
      {
        id: 'r1',
        group: 'গ্রুপ বি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'কাতার', flag: '🇶🇦', score: '১' },
        teamB: { name: 'সুইজারল্যান্ড', flag: '🇨🇭', score: '১' }
      }
    ],
    '14_jun': [
      {
        id: 'u1',
        group: 'গ্রুপ সি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'ব্রাজিল', flag: '🇧🇷', score: '১' },
        teamB: { name: 'মরক্কো', flag: '🇲🇦', score: '১' }
      },
      {
        id: 'u2',
        group: 'গ্রুপ সি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'হাইতি', flag: '🇭🇹', score: '০' },
        teamB: { name: 'স্কটল্যান্ড', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', score: '১' }
      },
      {
        id: 'u3',
        group: 'গ্রুপ ডি',
        status: 'FT',
        isLive: false,
        teamA: { name: 'অস্ট্রেলিয়া', flag: '🇦🇺', score: '১' },
        teamB: { name: 'তুরস্ক', flag: '🇹🇷', score: '১' }
      },
      {
        id: 'u4',
        group: 'গ্রুপ ই',
        status: '১১:০০ PM',
        isLive: false,
        teamA: { name: 'জার্মানি', flag: '🇩🇪', score: null },
        teamB: { name: 'কুরাসাও', flag: '🇨🇼', score: null }
      }
    ],
    '15_jun': [
      {
        id: 'u5',
        group: 'গ্রুপ এফ',
        status: '০২:০০ AM',
        isLive: false,
        teamA: { name: 'নেদারল্যান্ডস', flag: '🇳🇱', score: null },
        teamB: { name: 'জাপান', flag: '🇯🇵', score: null }
      },
      {
        id: 'u6',
        group: 'গ্রুপ ই',
        status: '০৫:০০ AM',
        isLive: false,
        teamA: { name: 'আইভরি কোস্ট', flag: '🇨🇮', score: null },
        teamB: { name: 'ইকুয়েডর', flag: '🇪🇨', score: null }
      },
      {
        id: 'u7',
        group: 'গ্রুপ এফ',
        status: '০৮:০০ AM',
        isLive: false,
        teamA: { name: 'তিউনিসিয়া', flag: '🇹🇳', score: null },
        teamB: { name: 'সুইডেন', flag: '🇸🇪', score: null }
      },
      {
        id: 'u8',
        group: 'গ্রুপ জি',
        status: '১১:০০ PM',
        isLive: false,
        teamA: { name: 'বেলজিয়াম', flag: '🇧🇪', score: null },
        teamB: { name: 'মিশর', flag: '🇪🇬', score: null }
      }
    ]
  };

  const standings = [
    { pos: '১', team: 'স্কটল্যান্ড', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', played: '১', pts: '৩' },
    { pos: '২', team: 'ব্রাজিল', flag: '🇧🇷', played: '১', pts: '১' },
    { pos: '৩', team: 'মরক্কো', flag: '🇲🇦', played: '১', pts: '১' },
    { pos: '৪', team: 'হাইতি', flag: '🇭🇹', played: '১', pts: '০' }
  ];

  // Dynamically generate tabs for Yesterday, Today, Tomorrow
  const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const enMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  const getTab = (offset: number, labelPrefix: string) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const id = `${d.getDate()}_${enMonths[d.getMonth()]}`;
    const toBn = (n: number) => n.toString().replace(/\d/g, x => '০১২৩৪৫৬৭৮৯'[parseInt(x)]);
    const label = `${labelPrefix}, ${toBn(d.getDate())} ${bnMonths[d.getMonth()]}`;
    return { id, label };
  };

  const tabs = [
    getTab(-1, 'গতকাল'),
    getTab(0, 'আজ'),
    getTab(1, 'আগামীকাল')
  ];

  return NextResponse.json({
    matchesByDate,
    standings,
    tabs
  });
}
