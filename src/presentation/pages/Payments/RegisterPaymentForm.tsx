"use client";
import { RegisterPaymentUseCase } from '@/core/application/useCases/RegisterPaymentUseCase';
import { FakePaymentApiRepository } from '@/infra/api/FakePaymentApiRepository';
import React, { useState } from 'react';

export const RegisterPaymentForm = () => {
    const [form, setForm] = useState({
        leaseId: '',
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        description: ''
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const repository = new FakePaymentApiRepository();
        const useCase = new RegisterPaymentUseCase(repository);
        try {
            await useCase.execute({
                ...form,
                date: new Date(form.date),
            });
            alert('Payment registered successfully!');
        } catch (error) {
            if (error instanceof Error) {
                alert('Error registering payment: ' + error.message);
            } else {
                alert('Error registering payment: ' + String(error));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Pagamento</h2>
            <div>
                <label>Contrato (Lease ID):</label>
                <input
                type="text"
                value={form.leaseId}
                onChange={(e) => setForm({ ...form, leaseId: e.target.value })}
                required
                />
            </div>
            <div>
                <label>Valor:</label>
                <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                required
                />
            </div>
            <div>
                <label>Data:</label>
                <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                />
            </div>
            <div>
                <label>Descrição (opcional):</label>
                <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>
            <button type="submit">Registrar</button>
        </form>
    )
}