export type PaymentStatus = 'pending' | 'completed' | 'failed';

export class Payment {
    constructor(
        public readonly id: string,
        public readonly leaseId: string,
        public readonly amount: number,
        public readonly date: Date,
        public readonly status: PaymentStatus,
        public readonly description?: string,
    ) { }
}