'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabasePaymentLogRepository } from '@/src/infrastructure/repositories/SupabasePaymentLogRepository'

export async function createPaymentLogAction(orderId: string, amountKrw: number, planName: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const repository = new SupabasePaymentLogRepository()
  
  try {
    const log = await repository.createPaymentLog(user.id, orderId, amountKrw, planName)
    return { success: true, logId: log.id }
  } catch (error: any) {
    console.error('Failed in createPaymentLogAction:', error)
    return { success: false, error: error.message }
  }
}
