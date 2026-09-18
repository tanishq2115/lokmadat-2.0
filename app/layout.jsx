import "./globals.css";

export const metadata = {
  title: "लोकमदत | महाराष्ट्रातील ताज्या बातम्या",
  description:
    "लोकमदत — महाराष्ट्रातील ताज्या आणि महत्त्वाच्या बातम्या.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mr">
      <body>{children}</body>
    </html>
  );
}
