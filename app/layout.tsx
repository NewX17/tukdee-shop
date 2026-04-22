import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'ถูกดี. - รวมของกินของใช้เด็กหอ',
  description: 'รวมไอเทมเด็กหอและของแต่งโต๊ะคอมที่คัดมาแล้วว่าคุ้ม',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J9YBY67F7C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J9YBY67F7C');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}