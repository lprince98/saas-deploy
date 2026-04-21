import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Checkout } from '@/src/presentation/components/payment/Checkout'

describe('Checkout Component', () => {
  it('renders cards and setup button', () => {
    render(<Checkout amount={12000} orderId="test-order-123" orderName="Pro Plan" />)
    
    expect(screen.getByText('안전한 정기결제 등록')).toBeInTheDocument()
    expect(screen.getByText(/정기구독 시작하기|불러오는 중/)).toBeInTheDocument()
  })
})
