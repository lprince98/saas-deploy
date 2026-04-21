'use client'

import React, { useState } from 'react'
import { Button } from '@/src/presentation/components/ui/Button'
import { cancelSubscriptionAction } from '@/src/application/actions/cancelSubscriptionAction'
import { useRouter } from 'next/navigation'

export function CancelSubscriptionButton() {
  const [isCasting, setIsCasting] = useState(false)
  const router = useRouter()

  const handleCancelClick = async () => {
    const isConfirmed = window.confirm(
      "정말로 구독을 취소하시겠습니까?\n\n남은 기간 동안은 프로 플랜 혜택이 정상적으로 유지되며, 다음 결제일에 만료되어 요금이 청구되지 않습니다."
    )

    if (!isConfirmed) return

    setIsCasting(true)
    try {
      await cancelSubscriptionAction()
      alert('정기결제 구독이 성공적으로 취소되었습니다. 혜택은 남은 기간 동안 유지됩니다.')
      router.refresh()
    } catch (error: any) {
      alert(`취소 처리 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setIsCasting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200" 
      onClick={handleCancelClick}
      disabled={isCasting}
    >
      {isCasting ? '취소 처리 중...' : '구독 취소'}
    </Button>
  )
}
