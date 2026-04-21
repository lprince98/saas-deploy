'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'

export type AuthActionState = {
  error?: string
  success?: boolean
}

/**
 * 로그인 Server Action
 * 이메일/비밀번호로 Supabase 인증 후 대시보드로 리다이렉트
 */
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해 주세요.' }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message === 'Invalid login credentials') {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    return { error: error.message }
  }

  redirect('/dashboard')
}

/**
 * 회원가입 Server Action
 * 이메일/비밀번호로 Supabase 계정 생성 후 이메일 확인 안내
 */
export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해 주세요.' }
  }

  if (password.length < 8) {
    return { error: '비밀번호는 최소 8자 이상이어야 합니다.' }
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: '이미 등록된 이메일입니다. 로그인을 시도해 주세요.' }
    }
    return { error: error.message }
  }

  // 이메일 확인이 필요한 경우 (Supabase 설정에 따라)
  if (data.user && !data.session) {
    return { success: true, error: undefined }
  }

  redirect('/dashboard')
}

/**
 * 로그아웃 Server Action
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
