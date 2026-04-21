import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardHeader } from '@/src/presentation/components/shared/DashboardHeader'

describe('DashboardHeader', () => {
  it('renders search input and notification button', () => {
    render(<DashboardHeader />)
    expect(screen.getByPlaceholderText(/아카이브 검색/i)).toBeDefined()
    expect(screen.getByText(/notifications/i)).toBeDefined()
  })
})
