export interface RegisterPaymentDTO {
    leaseId: string;
    amount: number;
    date: Date;
    description?: string;
}