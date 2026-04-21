import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { PaymentLogRepository } from '@/src/application/ports/out/PaymentLogRepository'
import { PaymentLog, PaymentStatus } from '@/src/domain/entities/PaymentLog'

export class SupabasePaymentLogRepository implements PaymentLogRepository {
  async createPaymentLog(userId: string, orderId: string, amountKrw: number, planName: string): Promise<PaymentLog> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('payment_logs')
      .insert({
        user_id: userId,
        order_id: orderId,
        amount_krw: amountKrw,
        plan_name: planName,
        status: 'STARTED'
      })
      .select('*')
      .single()

    if (error || !data) {
      console.error('Failed to create payment log:', error)
      throw new Error('Failed to create payment log.')
    }

    return this.mapToDomain(data)
  }

  async updatePaymentLogStatus(orderId: string, status: PaymentStatus, failReason?: string, paymentKey?: string): Promise<PaymentLog> {
    const supabase = await createSupabaseServerClient()

    const updatePayload: any = { 
        status, 
        updated_at: new Date().toISOString() 
    }
    
    if (failReason) {
        updatePayload.fail_reason = failReason
    }
    if (paymentKey) {
        updatePayload.payment_key = paymentKey
    }

    const { data, error } = await supabase
      .from('payment_logs')
      .update(updatePayload)
      .eq('order_id', orderId)
      .select('*')
      .single()

    if (error || !data) {
        console.error('Failed to update payment log:', error)
        throw new Error('Failed to update payment log.')
    }

    return this.mapToDomain(data)
  }

  private mapToDomain(row: any): PaymentLog {
    return {
      id: row.id,
      userId: row.user_id,
      orderId: row.order_id,
      amountKrw: row.amount_krw,
      planName: row.plan_name,
      status: row.status as PaymentStatus,
      failReason: row.fail_reason,
      paymentKey: row.payment_key,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }
}
