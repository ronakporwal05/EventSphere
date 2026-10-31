/**
 * Dynamic Calendar Utility for Event Sphere AI
 * Fetches real-time current calendar dates across all platform components
 */

export interface EventCalendarWindow {
  currentYear: number;
  currentMonthName: string;
  startDateFormatted: string;
  endDateFormatted: string;
  heroDateBadgeText: string;
  flagshipDateText: string;
  day1Iso: string;
  day2Iso: string;
  day3Iso: string;
  day1Label: string;
  day2Label: string;
  day3Label: string;
  day1Weekday: string;
  day2Weekday: string;
  day3Weekday: string;
  countdownTargetTime: number;
}

export function getCurrentCalendarWindow(): EventCalendarWindow {
  const now = new Date();
  const year = now.getFullYear();

  // Day 1: Today
  const d1 = new Date(now);
  // Day 2: Tomorrow
  const d2 = new Date(now);
  d2.setDate(d1.getDate() + 1);
  // Day 3: Day after tomorrow
  const d3 = new Date(now);
  d3.setDate(d1.getDate() + 2);

  const formatIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatShort = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  };

  const day1Iso = formatIso(d1);
  const day2Iso = formatIso(d2);
  const day3Iso = formatIso(d3);

  const m1 = d1.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const m3 = d3.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const heroDateBadgeText =
    m1 === m3
      ? `${d1.getDate()}-${d3.getDate()} ${m1} ${year} • BENGALURU, INDIA`
      : `${d1.getDate()} ${m1} - ${d3.getDate()} ${m3} ${year} • BENGALURU, INDIA`;

  const flagshipDateText =
    m1 === m3
      ? `${m1} ${d1.getDate()} - ${d3.getDate()}, ${year}`
      : `${m1} ${d1.getDate()} - ${m3} ${d3.getDate()}, ${year}`;

  const formatFullShort = (d: Date) => {
    return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' })}`;
  };

  const day1Weekday = d1.toLocaleString('en-US', { weekday: 'short' });
  const day2Weekday = d2.toLocaleString('en-US', { weekday: 'short' });
  const day3Weekday = d3.toLocaleString('en-US', { weekday: 'short' });

  // Countdown target: 7 days from now at 09:00 AM IST
  const targetDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  targetDate.setHours(9, 30, 0, 0);

  return {
    currentYear: year,
    currentMonthName: now.toLocaleString('en-US', { month: 'long' }),
    startDateFormatted: formatShort(d1),
    endDateFormatted: formatShort(d3),
    heroDateBadgeText,
    flagshipDateText,
    day1Iso,
    day2Iso,
    day3Iso,
    day1Label: `Day 1 • ${formatFullShort(d1)}`,
    day2Label: `Day 2 • ${formatFullShort(d2)}`,
    day3Label: `Day 3 • ${formatFullShort(d3)}`,
    day1Weekday,
    day2Weekday,
    day3Weekday,
    countdownTargetTime: targetDate.getTime(),
  };
}
