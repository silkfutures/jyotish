import './globals.css';

export const metadata = {
  title: 'Signal — Life Intelligence',
  description: 'A private life intelligence system for decisions, dreams, people and Jyotish.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
