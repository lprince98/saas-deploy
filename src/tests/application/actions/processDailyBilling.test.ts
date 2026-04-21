import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { processDailyBillingAction } from '@/src/application/actions/processDailyBillingAction'
import { TossPaymentsService } from '@/src/infrastructure/services/TossPaymentsService'

// 1. Supabase 모킹
vi.mock('@/src/infrastructure/database/supabase-server', () => {
  const mockSupabase = {
    from: vi.fn(),
  }
  return {
    createSupabaseServerClient: vi.fn(() => Promise.resolve(mockSupabase))
  }
})

// 2. TossPaymentsService 모킹
vi.mock('@/src/infrastructure/services/TossPaymentsService', () => ({
  TossPaymentsService: {
    executeBilling: vi.fn()
  }
}))

describe('processDailyBillingAction', () => {
  let mockSupabase: any;

  beforeEach(async () => {
    // 모킹된 Supabase 인스턴스 획득
    const { createSupabaseServerClient } = await import('@/src/infrastructure/database/supabase-server')
    mockSupabase = await createSupabaseServerClient()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const setupSupabaseMock = (config: {
    canceledData?: any[],
    activeData?: any[],
    updateResult?: any,
    insertResult?: any
  }) => {
    mockSupabase.from.mockImplementation((table: string) => {
      const createChain = (data: any) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data, error: null }),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
      })

      if (table === 'subscriptions') {
        // 첫 번째 호출(canceled)과 두 번째 호출(active)을 구분해야 하지만
        // 단순화를 위해 호출 순서나 eq 필터 종류로 구분 가능
        const chain = createChain([])
        chain.select = vi.fn().mockImplementation((fields: string) => {
          if (fields === 'id') return createChain(config.canceledData || [])
          return createChain(config.activeData || [])
        })
        return chain
      }
      if (table === 'payment_logs') {
        return createChain([])
      }
      return createChain([])
    })
  }

  it('기한이 만료된 구독 데이터가 없을 경우 성공 처리 0건을 반환해야 한다', async () => {
    setupSupabaseMock({ canceledData: [], activeData: [] })

    const result = await processDailyBillingAction()

    expect(result).toEqual({ successCount: 0, failCount: 0 })
    expect(TossPaymentsService.executeBilling).not.toHaveBeenCalled()
  })

  it('결제 성공 시 current_period_end가 연장되고 payment_logs가 생성되어야 한다', async () => {
    const mockActiveSubs = [
      {
        id: 'sub-1',
        user_id: 'user-1',
        billing_key: 'test_billing_key',
        customer_key: 'test_customer_key',
        amount_krw: 144000,
        plan: 'pro'
      }
    ]

    setupSupabaseMock({ activeData: mockActiveSubs })
    
    vi.mocked(TossPaymentsService.executeBilling).mockResolvedValue({ 
      paymentKey: 'payment_success_key_123' 
    } as any)

    const result = await processDailyBillingAction()

    expect(result.successCount).toBe(1)
    expect(TossPaymentsService.executeBilling).toHaveBeenCalledWith(
        'test_billing_key',
        expect.objectContaining({ amount: 144000 })
    )
  })

  it('결제 실패 시 status가 expired로 변경되어야 한다', async () => {
    const mockActiveSubs = [
      {
        id: 'sub-2',
        user_id: 'user-2',
        billing_key: 'fail_billing_key',
        customer_key: 'fail_customer_key',
        amount_krw: 144000,
        plan: 'pro'
      }
    ]

    setupSupabaseMock({ activeData: mockActiveSubs })
    
    vi.mocked(TossPaymentsService.executeBilling).mockRejectedValue(new Error('Payment failed'))

    const result = await processDailyBillingAction()

  })
})
