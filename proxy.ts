import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase 세션 갱신용 프록시 (구 middleware)
 * 모든 요청마다 세션 토큰을 갱신하고 보호 경로를 처리합니다
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // 세션 유저 확인 — 항상 getUser() 호출해야 세션이 갱신됩니다
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 인증된 유저가 /login 또는 /signup 접근 시 대시보드로 리다이렉트
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 보호된 경로에 비인증 유저 접근 차단
  const protectedPaths = ['/dashboard', '/notes', '/payment']
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  )

  if (!user && isProtectedPath) {
    const nextUrl = new URL('/login', request.url)
    nextUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(nextUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
