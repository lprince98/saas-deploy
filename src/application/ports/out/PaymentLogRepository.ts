import { PaymentLog, PaymentStatus } from '@/src/domain/entities/PaymentLog';

export interface PaymentLogRepository {
  createPaymentLog(
    userId: string, 
    orderId: string, 
    amountKrw: number, 
    planName: string
  ): Promise<PaymentLog>;

  updatePaymentLogStatus(
    orderId: string, 
    status: PaymentStatus, 
    failReason?: string, 
    paymentKey?: string
  ): Promise<PaymentLog>;

  findByOrderId(orderId: string): Promise<PaymentLog | null>;
}
