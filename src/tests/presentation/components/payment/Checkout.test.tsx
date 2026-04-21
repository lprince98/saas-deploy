import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Checkout } from '@/src/presentation/components/payment/Checkout'

describe('Checkout Component', () => {
  it('renders payment method and agreement containers', () => {
    // Red Phase: Checkout 컴포넌트가 아직 존재하지 않으므로 이 테스트는 실패함
    render(<Checkout amount={12000} orderId="test-order-123" orderName="Pro Plan" />)
    
    const paymentContainer = document.getElementById('payment-method')
    const agreementContainer = document.getElementById('agreement')
    
    expect(paymentContainer).not.toBeNull()
    expect(agreementContainer).not.toBeNull()
  })
})
