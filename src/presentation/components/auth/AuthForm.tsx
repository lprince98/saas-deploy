'use client'

import { useActionState, useState } from 'react'
import { loginAction, signupAction, type AuthActionState } from '@/app/(auth)/actions'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Label } from '@/src/presentation/components/ui/Label'
import { Input } from '@/src/presentation/components/ui/Input'

type AuthTab = 'login' | 'signup'

const initialState: AuthActionState = {}

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const [loginState, loginDispatch, loginPending] = useActionState(
    loginAction,
    initialState,
  )

  const [signupState, signupDispatch, signupPending] = useActionState(
    async (prevState: AuthActionState, formData: FormData) => {
      const result = await signupAction(prevState, formData)
      if (result.success) setSignupSuccess(true)
      return result
    },
    initialState,
  )

  const isLogin = activeTab === 'login'
  const currentState = isLogin ? loginState : signupState
  const isPending = isLogin ? loginPending : signupPending

  return (
    <Card variant="glass" className="p-8 border-[#c5c5d4]/10 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex items-center space-x-1 bg-[#f2f4f7] p-1 rounded-lg mb-8">
        <button
          type="button"
          id="tab-login"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 font-manrope ${
            isLogin
              ? 'bg-white shadow-sm text-[#24389c]'
              : 'text-[#4a626d] hover:text-[#24389c]'
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          id="tab-signup"
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 font-manrope ${
            !isLogin
              ? 'bg-white shadow-sm text-[#24389c]'
              : 'text-[#4a626d] hover:text-[#24389c]'
          }`}
        >
          회원가입
        </button>
      </div>

      <div className="space-y-6">
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            type="button"
            id="btn-google-auth"
            className="bg-white border-[#c5c5d4]/20 text-[#191c1e] font-manrope font-semibold hover:bg-[#f2f4f7]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button
            variant="ghost"
            type="button"
            id="btn-apple-auth"
            className="bg-white border-[#c5c5d4]/20 text-[#191c1e] font-manrope font-semibold hover:bg-[#f2f4f7]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="mr-2">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-grow h-px bg-[#c5c5d4]/30" />
          <span className="px-4 text-[10px] uppercase tracking-widest font-bold text-[#757684] font-manrope">
            또는 이메일
          </span>
          <div className="flex-grow h-px bg-[#c5c5d4]/30" />
        </div>

        {/* Email/Password Form */}
        {signupSuccess && !isLogin ? (
          <div className="py-6 text-center space-y-3">
            <IconBox icon="check" variant="secondary" size="lg" className="mx-auto h-14 w-14 mb-2" />
            <p className="font-semibold text-[#191c1e] font-headline">
              이메일을 확인해 주세요
            </p>
            <p className="text-sm text-[#4a626d] leading-relaxed font-inter">
              인증 링크가 발송되었습니다.
              <br />
              이메일을 확인하고 계정을 활성화해 주세요.
            </p>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setActiveTab('login')
                setSignupSuccess(false)
              }}
              className="mt-2 text-[#24389c] hover:bg-transparent hover:underline"
            >
              로그인으로 돌아가기
            </Button>
          </div>
        ) : (
          <form
            action={isLogin ? loginDispatch : signupDispatch}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                name="email"
                type="email"
                icon="alternate_email"
                placeholder="curator@example.com"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <Label htmlFor="password">비밀번호</Label>
                {isLogin && (
                  <a
                    className="text-[11px] font-semibold text-[#24389c] hover:underline font-manrope"
                    href="#"
                  >
                    분실하셨나요?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                icon="lock"
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#757684] hover:text-[#24389c] transition-colors"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                }
              />
            </div>

            {/* Error Message */}
            {currentState?.error && (
              <Badge variant="error" className="w-full flex items-start gap-2 py-2.5 bg-red-50 text-[#ba1a1a] border-red-100 rounded-lg">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">error</span>
                <p className="text-xs font-medium font-inter">
                  {currentState.error}
                </p>
              </Badge>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                id="btn-auth-submit"
                type="submit"
                disabled={isPending}
                className="w-full py-4 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    처리 중...
                  </>
                ) : isLogin ? (
                  '갤러리로 계속하기'
                ) : (
                  '큐레이터로 시작하기'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Tonal Footer */}
      <div className="mt-8 text-center px-4">
        <p className="text-[11px] text-[#4a626d] leading-relaxed font-manrope">
          계속 진행함으로써 본 서비스의{' '}
          <a className="text-[#191c1e] font-semibold hover:text-[#24389c] transition-colors" href="#">이용약관</a>{' '}
          및{' '}
          <a className="text-[#191c1e] font-semibold hover:text-[#24389c] transition-colors" href="#">개인정보 처리방침</a>
          에 동의하게 됩니다.
        </p>
      </div>
    </Card>
  )
}

