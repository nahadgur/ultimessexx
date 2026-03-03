import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.essexdentalimplants.com'),
  title: {
    default: 'Essex Dental Implants | Find Elite Dental Implant Specialists',
    template: '%s | Essex Dental Implants',
  },
  description:
    'Connecting patients with verified dental implant specialists for permanent tooth replacement solutions across the UK.',
  keywords: [
    'dental implants',
    'dental implant specialist',
    'tooth replacement',
    'dental implants UK',
    'implant dentist',
    'full arch implants',
    'all-on-4 implants',
  ],
  authors: [{ name: 'Essex Dental Implants' }],
  creator: 'Essex Dental Implants',
  publisher: 'Essex Dental Implants',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    url: 'https://www.essexdentalimplants.com',
    title: 'Essex Dental Implants | Elite Dental Implant Specialist Network',
    description:
      'Find verified dental implant specialists across the UK. Permanent solutions. Trusted experts.',
    siteName: 'Essex Dental Implants',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Essex Dental Implants Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essex Dental Implants | Dental Implant Specialists',
    description:
      'Connecting patients with the top dental implant specialists across the UK.',
    images: ['/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BPLXLSCSS6"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BPLXLSCSS6');
            `,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} ${dmSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
