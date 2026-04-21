import Image from 'next/image'
import AuthForm from '@/src/presentation/components/auth/AuthForm'
import { IconBox } from '@/src/presentation/components/ui/IconBox'

export default function LoginPage() {
  return (
    <>
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#dee0ff] opacity-20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-[#cde6f4] opacity-30 blur-[100px]" />
      </div>

      {/* Decorative Preview Images */}
      <div className="hidden lg:block absolute bottom-12 left-12 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl rotate-[-3deg] z-0 opacity-40 hover:opacity-80 transition-all duration-500 border-4 border-white grayscale">
        <Image
          src="/auth-preview-desk.png"
          alt="미니멀 책상 프리뷰"
          fill
          loading="eager"
          className="object-cover"
          sizes="256px"
        />
      </div>
      <div className="hidden lg:block absolute top-12 right-12 w-72 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[5deg] z-0 opacity-40 hover:opacity-80 transition-all duration-500 border-4 border-white grayscale">
        <Image
          src="/auth-preview-gallery.png"
          alt="갤러리 프리뷰"
          fill
          className="object-cover"
          sizes="288px"
        />
      </div>

      {/* Main Auth Container */}
      <main className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <IconBox icon="auto_awesome" variant="primary" size="lg" className="mx-auto mb-4 bg-gradient-to-br from-[#24389c] to-[#3f51b5] text-white" />
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-[#191c1e] mb-1">
            The Digital Curator
          </h1>
          <p className="text-[#4a626d] font-manrope font-semibold text-sm">
            의도적인 생각의 정리.
          </p>
        </div>

        {/* Auth Card */}
        <AuthForm />

        {/* Help & Language Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="#"
            className="flex items-center space-x-1.5 text-[#4a626d] hover:text-[#24389c] transition-colors group"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-12 transition-transform"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-xs font-medium">도움이 필요하신가요?</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-1.5 text-[#4a626d] hover:text-[#24389c] transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-xs font-medium">한국어</span>
          </a>
        </div>
      </main>
    </>
  )
}
