import Link from 'next/link'

/**
 * 전역 푸터 컴포넌트
 * 랜딩 페이지와 정보 제공 페이지에서 사용됩니다.
 */
export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/50 pt-20 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <span className="text-2xl font-bold tracking-tighter text-indigo-900 font-headline">
              The Digital Curator
            </span>
            <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
              탁월한 디자인을 통해 세상이 지식을 캡처하고, 정리하고, 발견하는 방식을 혁신합니다.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                aria-label="Share"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                aria-label="Email"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-slate-900">제품</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">기능 소개</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">요금제</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">노트 에디터</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">연동 서비스</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-slate-900">리소스</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">문서</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">헬프 센터</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">커뮤니티</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">API 레퍼런스</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-slate-900">회사</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">회사 소개</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">채용</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">개인정보 처리방침</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">이용약관</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-slate-900">고객 지원</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">시스템 상태</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">문의하기</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 The Digital Curator. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-indigo-600">쿠키 설정</Link>
            <Link href="#" className="hover:text-indigo-600">글로벌 프라이버시</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
