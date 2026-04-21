import type { Metadata } from 'next'
import LoginPageContent from '../login/page'

export const metadata: Metadata = {
  title: 'The Digital Curator — 회원가입',
  description: 'The Digital Curator에 가입하고 나만의 디지털 갤러리를 시작하세요.',
}

// 회원가입 페이지는 로그인 페이지와 동일한 UI를 공유하며,
// AuthForm 내부의 탭 상태로 회원가입 폼을 표시합니다.
export default function SignupPage() {
  return <LoginPageContent />
}
