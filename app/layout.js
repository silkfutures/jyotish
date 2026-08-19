import './globals.css';

export const metadata = {
  title: 'Jyotish Oracle — Life Intelligence',
  description: 'Personal Jyotish, I Ching, dreams and life-pattern intelligence.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
