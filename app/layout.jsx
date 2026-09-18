import './globals.css';
export const metadata={metadataBase:new URL('https://metrocitynews.co.in'),title:{default:'लोकमदत | मराठी बातम्या',template:'%s | लोकमदत'},description:'लोकमदत — ताज्या मराठी बातम्या, स्थानिक घडामोडी आणि डिजिटल ई-पेपर.'};
export default function RootLayout({children}){return <html lang="mr"><body>{children}</body></html>}
