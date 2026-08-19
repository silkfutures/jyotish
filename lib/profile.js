export const profile = {
  name: 'Nathan',
  birth: {
    date: '1996-08-06',
    workingTime: '02:00',
    timeStatus: 'estimated',
    timeSource: 'Remembered as around 02:00; awaiting family confirmation.',
    uncertaintyMinutes: 30,
    earliestTime: '01:30',
    latestTime: '02:30',
    timezone: 'Europe/London',
    place: 'Ealing, London, UK',
    latitude: 51.513,
    longitude: -0.308,
    ayanamsa: 'Lahiri'
  },

  // Provisional reference result at the working time of 02:00.
  // Do not treat the Ascendant or house-dependent interpretations as verified
  // until the birth time is confirmed and the chart is recalculated.
  ascendant: {
    sign: 'Gemini',
    degree: 8.5266,
    confidence: 'time-sensitive',
    provisional: true
  },

  planets: [
    ['Sun','Cancer',20.0389],
    ['Moon','Aries',17.8531],
    ['Mercury','Leo',12.9583],
    ['Venus','Gemini',5.1734],
    ['Mars','Gemini',13.7254],
    ['Jupiter','Sagittarius',15.2621],
    ['Saturn','Pisces',13.3134],
    ['Rahu','Virgo',17.0808],
    ['Ketu','Pisces',17.0808]
  ],

  moon: {
    sign:'Aries',
    degree:17.8531,
    nakshatra:'Bharani',
    pada:2,
    lord:'Venus',
    confidence:'time-stable'
  },

  dasha: {
    mahadasha: 'Mars',
    mahadashaStart: '2025-10-25',
    mahadashaEnd: '2032-10-25',
    antardasha: 'Rahu',
    antardashaStart: '2026-03-23',
    antardashaEnd: '2027-04-11',
    confidence:'high-within-current-birth-time-window'
  },

  accuracyPolicy: {
    stable: [
      'Planetary signs',
      'Planetary degrees at ordinary display precision',
      'Moon sign and nakshatra',
      'Vimshottari sequence and current MD/AD at this uncertainty range'
    ],
    sensitive: [
      'Ascendant degree',
      'House cusps and exact house placement',
      'House-lord interpretations that depend on the Ascendant',
      'Navamsha and other divisional placements near sign boundaries',
      'Fine timing techniques that depend on exact angles'
    ],
    rule: 'Never present a time-sensitive factor as certain while birth.timeStatus is estimated.'
  }
};

export function birthTimeLabel() {
  if (profile.birth.timeStatus === 'confirmed') {
    return `${profile.birth.workingTime} confirmed`;
  }
  return `~${profile.birth.workingTime} · ${profile.birth.earliestTime}–${profile.birth.latestTime} working window`;
}

export function confidenceForTopic(topic = '') {
  const t = topic.toLowerCase();
  const sensitiveWords = ['ascendant','house','houses','navamsha','d9','d10','varga','angle','lagna'];
  if (sensitiveWords.some(word => t.includes(word))) return 'time-sensitive';
  return 'time-stable';
}
