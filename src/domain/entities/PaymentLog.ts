export type PaymentStatus = 'STARTED' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaymentLog {
  id: string;
  userId: string;
  orderId: string;
  amountKrw: number;
  planName: string;
  status: PaymentStatus;
  failReason?: string;
  paymentKey?: string;
  createdAt: Date;
  updatedAt: Date;
}
