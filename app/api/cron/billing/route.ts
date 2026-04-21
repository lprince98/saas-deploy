import { NextResponse } from 'next/server'
import { processDailyBillingAction } from '@/src/application/actions/processDailyBillingAction'

/**
 * Vercel Cron Job 시스템을 위한 전용 라우트 (GET 요청)
 * 엔드포인트: /api/cron/billing
 */
export async function GET(request: Request) {
  // 보안 정책: Vercel Cron 요청이 올바른 시크릿을 가졌는지 검증합니다.
  const authHeader = request.headers.get('authorization')
  // CRON_SECRET 환경 변수는 Vercel 대시보드에서 등록하거나 .env에서 구성해야 합니다.
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: '허가되지 않은 접근입니다. 유효한 인증 토큰을 제공해주세요.' }, 
      { status: 401 }
    )
  }

  try {
    // 1. 방금 구현한 일일 정기결제 액션 수행
    const result = await processDailyBillingAction()
    
    // 2. 결과 리턴
    return NextResponse.json({ 
      success: true, 
      message: '일일 정기결제 일괄 승인 작업이 정상 종료되었습니다.',
      data: result 
    }, { status: 200 })

  } catch (error: any) {
    console.error('[API/Cron] 빌링 자동결제 배치 작업 실패:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'CronJob 실행 중 시스템 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
