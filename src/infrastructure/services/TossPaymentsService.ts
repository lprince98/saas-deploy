const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_XjExPeJWYVQR12P55agr49R5gvNL";
const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');

export const TossPaymentsService = {
  /**
   * 빌링키 발급 API 호출
   */
  async issueBillingKey(authKey: string, customerKey: string) {
    const issueRes = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey
      }),
    });

    if (!issueRes.ok) {
      const errorData = await issueRes.json()
      console.error('Toss Payments Issue Billing Key Error:', errorData)
      throw new Error(`빌링키 발급 실패: ${errorData.message || '알 수 없는 오류'}`)
    }

    const data = await issueRes.json()
    return data.billingKey
  },

  /**
   * 발급받은 빌링키로 결제 승인 API 호출
   */
  async executeBilling(billingKey: string, payload: {
    customerKey: string;
    amount: number;
    orderId: string;
    orderName: string;
    customerEmail?: string;
    taxFreeAmount?: number;
  }) {
    const executeRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        taxFreeAmount: payload.taxFreeAmount || 0
      }),
    });

    if (!executeRes.ok) {
      const errorData = await executeRes.json()
      console.error('Toss Payments Execute Billing Error:', errorData)
      
      // TDD 등에서 rejection 처리를 위해 Throw
      // fetch의 Response 형태를 맞추지 않고 직접 예외를 던집니다
      const error = new Error(errorData.message || 'Payment execution failed');
      (error as any).code = errorData.code;
      throw error;
    }

    return await executeRes.json();
  }
}
