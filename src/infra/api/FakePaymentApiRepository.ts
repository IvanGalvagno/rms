import { Payment } from "@/core/domain/entities/Payment";
import { PaymentRepository } from "@/core/domain/repositories/PaymentRepository";
import { v4 as uuid } from "uuid"; // Its a temporary solution, we will use a better id generator in the future

export class FakePaymentApiRepository implements PaymentRepository {
    private payments: Payment[] = [];
    constructor() {
        // Initialize with some fake data
        this.payments = [
            new Payment(uuid(), "lease-1", 100, new Date(), "completed"),
            new Payment(uuid(), "lease-2", 200, new Date(), "pending"),
            new Payment(uuid(), "lease-3", 300, new Date(), "failed"),
        ];
    }
    async register(payment: Payment): Promise<void> {
        this.payments.push(payment);
        console.log("Payment registered:", payment);
        return Promise.resolve();
    }
    async findByLease(leaseId: string): Promise<Payment[]> {
        return Promise.resolve(this.payments.filter(payment => payment.leaseId === leaseId));
    }

}