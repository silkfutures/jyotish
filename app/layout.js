import './globals.css';

export const metadata = {
  title: 'Jyotish Oracle',
  description: 'Personal Vedic astrology + I Ching decision intelligence.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
