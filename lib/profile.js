export const profile = {
  birth: {
    date: '1996-08-06',
    workingTime: '02:00',
    timeStatus: 'estimated',
    earliestTime: '01:30',
    latestTime: '02:30',
    timezone: 'Europe/London',
    place: 'Ealing, London, UK',
    ayanamsa: 'Lahiri'
  },
  ascendant: { sign: 'Gemini', degree: 8.5266, provisional: true },
  moon: { sign: 'Aries', degree: 17.8531, nakshatra: 'Bharani', pada: 2, lord: 'Venus' },
  dasha: {
    mahadasha: 'Mars',
    mahadashaStart: '2025-10-25',
    mahadashaEnd: '2032-10-25',
    antardasha: 'Rahu',
    antardashaStart: '2026-03-23',
    antardashaEnd: '2027-04-11'
  },
  accuracyPolicy: {
    stable: ['Planetary signs', 'Moon sign / nakshatra', 'Current Vimshottari MD/AD across the present uncertainty window'],
    sensitive: ['Exact Ascendant degree', 'Houses / house cusps', 'D9 / D10 / vargas', 'Fine angular timing']
  }
};

export function birthTimeLabel() {
  return profile.birth.timeStatus === 'confirmed'
    ? `${profile.birth.workingTime} confirmed`
    : `~${profile.birth.workingTime} · ${profile.birth.earliestTime}–${profile.birth.latestTime}`;
}
