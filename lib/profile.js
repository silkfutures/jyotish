export const profile = {
  name: 'Nathan',
  birth: {
    local: '1996-08-06 02:00',
    timezone: 'Europe/London',
    place: 'Ealing, London, UK',
    latitude: 51.513,
    longitude: -0.308,
    ayanamsa: 'Lahiri'
  },
  ascendant: { sign: 'Gemini', degree: 8.5266 },
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
  moon: { sign:'Aries', degree:17.8531, nakshatra:'Bharani', pada:2, lord:'Venus' },
  dasha: {
    mahadasha: 'Mars',
    mahadashaStart: '2025-10-25',
    mahadashaEnd: '2032-10-25',
    antardasha: 'Rahu',
    antardashaStart: '2026-03-23',
    antardashaEnd: '2027-04-11'
  }
};
