export type UserPlan = 'free' | 'pro' | 'enterprise'

export interface UserSubscriptionInfo {
  userId: string
  plan: UserPlan
  status: 'active' | 'canceled' | 'expired' | 'trialing'
}

export interface UserRepository {
  getUserSubscription(userId: string): Promise<UserSubscriptionInfo | null>
}
