import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { processDailyBillingAction } from '@/src/application/actions/processDailyBillingAction'

// 1. Supabase 모킹
vi.mock('@/src/infrastructure/database/supabase-server', () => {
  const mockSupabase = {
    from: vi.fn(),
  }
  return {
    createSupabaseServerClient: vi.fn(() => Promise.resolve(mockSupabase))
  }
})

// 2. Fetch API 모킹
const originalFetch = global.fetch

describe('processDailyBillingAction (TDD Red)', () => {
  let mockSupabase: any;

  beforeEach(async () => {
    // 매 테스트 전 fetch 모킹 초기화
    global.fetch = vi.fn()
    
    // 모킹된 Supabase 인스턴스 획득
    const { createSupabaseServerClient } = await import('@/src/infrastructure/database/supabase-server')
    mockSupabase = await createSupabaseServerClient()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.clearAllMocks()
  })

  it('기한이 만료된 구독 데이터가 없을 경우 성공 처리 0건을 반환해야 한다', async () => {
    // given: 검색 결과가 0건
    const mockSelect = vi.fn().mockReturnThis()
    const mockEq = vi.fn().mockReturnThis()
    const mockNot = vi.fn().mockReturnThis()
    const mockLte = vi.fn().mockReturnThis()
    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockEq.mockReturnValue({ not: mockNot })
    mockNot.mockReturnValue({ lte: mockLte })
    mockLte.mockReturnValue({ limit: mockLimit })

    // when
    const result = await processDailyBillingAction()

    // then
    expect(result).toEqual({ successCount: 0, failCount: 0 })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('결제 성공 시 current_period_end가 연장되고 payment_logs가 생성되어야 한다', async () => {
    // given: 1건의 대상자
    const mockSubscriptions = [
      {
        id: 'sub-1',
        user_id: 'user-1',
        billing_key: 'test_billing_key',
        customer_key: 'test_customer_key',
        amount_krw: 144000,
        plan: 'pro'
      }
    ]

    const mockLimit = vi.fn().mockResolvedValue({ data: mockSubscriptions, error: null })
    const mockLte = vi.fn().mockReturnValue({ limit: mockLimit })
    const mockNot = vi.fn().mockReturnValue({ lte: mockLte })
    const mockEq = vi.fn().mockReturnValue({ not: mockNot })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    const mockUpdate = vi.fn().mockReturnThis()
    const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'subscriptions') {
        return {
          select: mockSelect,
          update: mockUpdate,
        }
      }
      if (table === 'payment_logs') {
        return {
          insert: mockInsert
        }
      }
      return {}
    })

    mockUpdate.mockReturnValue({ eq: mockUpdateEq })

    // Fetch 모킹: Toss 성공 응답
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ paymentKey: 'payment_success_key_123' })
    })

    // when
    const result = await processDailyBillingAction()

    // then
    expect(result.successCount).toBe(1)
    expect(result.failCount).toBe(0)
    
    // Toss API 호출 검증
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.tosspayments.com/v1/billing/test_billing_key'),
      expect.objectContaining({ method: 'POST' })
    )

    // DB 업데이트 검증 (구독 연장)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_period_end: expect.any(String) // 연장된 날짜 포함
      })
    )
    expect(mockUpdateEq).toHaveBeenCalledWith('id', 'sub-1')

    // DB 결제 로그 기록 검증
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'SUCCESS',
        payment_key: 'payment_success_key_123'
      })
    )
  })

  it('결제 실패 시 status가 expired로 변경되어야 한다', async () => {
    // given: 1건의 대상자
    const mockSubscriptions = [
      {
        id: 'sub-2',
        user_id: 'user-2',
        billing_key: 'fail_billing_key',
        customer_key: 'fail_customer_key',
        amount_krw: 144000,
        plan: 'pro'
      }
    ]

    const mockLimit = vi.fn().mockResolvedValue({ data: mockSubscriptions, error: null })
    const mockLte = vi.fn().mockReturnValue({ limit: mockLimit })
    const mockNot = vi.fn().mockReturnValue({ lte: mockLte })
    const mockEq = vi.fn().mockReturnValue({ not: mockNot })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    const mockUpdate = vi.fn().mockReturnThis()
    const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'subscriptions') {
        return {
          select: mockSelect,
          update: mockUpdate,
        }
      }
      if (table === 'payment_logs') {
        return {
          insert: mockInsert
        }
      }
      return {}
    })

    mockUpdate.mockReturnValue({ eq: mockUpdateEq })

    // Fetch 모킹: 결제 한도 초과 오류
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: '카드 잔액 한도 초과', code: 'FAILED_RECURRING' })
    })

    // when
    const result = await processDailyBillingAction()

    // then
    expect(result.successCount).toBe(0)
    expect(result.failCount).toBe(1)

    // DB 다운그레이드 검증
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'expired'
      })
    )
    expect(mockUpdateEq).toHaveBeenCalledWith('id', 'sub-2')

    // 실패 로그 검증
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'FAILED',
      })
    )
  })
})
