import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Digital Curator — 로그인',
  description:
    '지식 노동자를 위한 프리미엄 노트 테이킹 플랫폼, The Digital Curator에 로그인하세요.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-bg min-h-[calc(100vh-72px)] flex items-center justify-center p-6 relative overflow-hidden">
      {children}
    </div>
  )
}
