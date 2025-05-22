import { Payment } from "../entities/Payment";

export interface PaymentRepository {
    register(payment: Payment): Promise<void>;
    findByLease(leaseId: string): Promise<Payment[]>;
}