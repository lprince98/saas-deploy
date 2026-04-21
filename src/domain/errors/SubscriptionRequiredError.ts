export class SubscriptionRequiredError extends Error {
  constructor(message: string = '이 작업을 수행하려면 프로 플랜으로 업그레이드가 필요합니다.') {
    super(message)
    this.name = 'SubscriptionRequiredError'
  }
}
