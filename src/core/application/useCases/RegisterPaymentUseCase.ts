import { Payment } from "@/core/domain/entities/Payment";
import { PaymentRepository } from "@/core/domain/repositories/PaymentRepository";
import { RegisterPaymentDTO } from "../dto/RegisterPaymentDTO";
import { v4 as uuidv4 } from 'uuid';

export class RegisterPaymentUseCase {
    constructor(private paymentRepository: PaymentRepository) {}

    async execute(dto: RegisterPaymentDTO): Promise<void> {
        const { leaseId, amount, date, description } = dto;

        this.validateInput(dto);

        // Create a new payment entity
        const payment = new Payment(
            this.generateId(),
            leaseId,
            amount,
            date,
            'pending', // Default status for new payments for now
            description
        );

        // Register the payment using the repository
        await this.paymentRepository.register(payment);
    }

    private generateId(): string {
        return uuidv4();
    }

    private validateInput(dto: RegisterPaymentDTO): void {
        // TODO: IMPROVE: Add more validation logic as needed
        if (!dto.leaseId || !dto.amount || dto.amount < 0 || !dto.date) {
            throw new Error("Invalid input data");
        }
    }
}