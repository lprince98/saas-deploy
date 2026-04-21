import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { TopNavBar } from '@/src/presentation/components/shared/TopNavBar'
import { Footer } from '@/src/presentation/components/shared/Footer'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CloudNote — 당신의 사유를 위한 디지털 갤러리',
  description:
    '지식 노동자를 위한 프리미엄 노트 테이킹 플랫폼 — CloudNote',
  openGraph: {
    title: 'CloudNote — 당신의 사유를 위한 디지털 갤러리',
    description: 'AI 문맥 검색과 에디토리얼 미학을 결합한 프리미엄 노트 테이킹 플랫폼',
    url: 'https://saas-deploy-lprince98.vercel.app', // 실제 배포 URL로 변경 가능
    siteName: 'CloudNote',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CloudNote 서비스 미리보기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudNote — 당신의 사유를 위한 디지털 갤러리',
    description: '지식 노동자를 위한 프리미엄 노트 테이킹 플랫폼',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-inter bg-[#f7f9fc] text-[#191c1e] flex flex-col">
        {children}
      </body>
    </html>
  )
}
