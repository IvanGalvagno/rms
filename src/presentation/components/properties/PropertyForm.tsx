"use client";

import { createPropertyAction, CreatePropertyFormState } from "@/app/(dashboard)/properties/actions";
import { PropertyType } from "@/core/domain/entities/Property";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const initalState: CreatePropertyFormState = {
    message: null,
    errors: null,
    propertyId: undefined,
    isLoading: false,
    isSuccess: false,
};

function SubmitButton() {
    const { pending } = useFormStatus(); // Hook para saber o estado de envio do formulário
    return (
        <Button type="submit" disabled={pending} className="w-full mt-6">
            {pending ? "Salvando..." : "Salvar Imóvel"}
        </Button>
    );
}

export function PropertyForm() {
    const [state, formAction] = useFormState(createPropertyAction, initalState);
    const formRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (state.isSuccess && state.propertyId) {
            formRef.current?.reset(); // Limpa o formulário após sucesso
            // Mostrar uma notificação de sucesso, toast, ou mensagem biblioteca de notificação como react-toastify ou similar
            // ou redirecionar o usuário.
            // Por enquanto, a mensagem de sucesso será exibida abaixo do botão.
        }
    }, [state.isSuccess, state.propertyId]);
    return (
        <form
            ref={formRef}
            action={formAction}
            className="space-y-4 bg-white p-6 shadow rounded-lg shadow-md max-w-2xl mx-auto"
        >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Cadastrar Novo Imóvel</h2>

            <Input
                name="address"
                label="Endereço Completo"
                required
                error={state.errors?.address?.join(', ')}
            />

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel</label>
                <select
                id="type"
                name="type"
                required
                className={`mt-1 block w-full px-3 py-2 border ${state.errors?.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                <option value="">Selecione o tipo</option>
                {Object.values(PropertyType).map((typeValue) => (
                    <option key={typeValue} value={typeValue}>
                    {/* Você pode querer um mapeamento para nomes mais amigáveis aqui */}
                    {typeValue.charAt(0) + typeValue.slice(1).toLowerCase().replace('_', ' ')}
                    </option>
                ))}
                </select>
                {state.errors?.type && <p className="mt-1 text-xs text-red-600">{state.errors.type.join(', ')}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                <textarea
                id="description"
                name="description"
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border ${state.errors?.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {state.errors?.description && <p className="mt-1 text-xs text-red-600">{state.errors.description.join(', ')}</p>}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="bedrooms" type="number" label="Quartos" defaultValue="0" required error={state.errors?.bedrooms?.join(', ')} />
                <Input name="bathrooms" type="number" label="Banheiros" defaultValue="0" required error={state.errors?.bathrooms?.join(', ')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="area" type="number" label="Área (m²)" step="0.01" required error={state.errors?.area?.join(', ')} />
                <Input name="rentAmount" type="number" label="Valor do Aluguel (R$)" step="0.01" required error={state.errors?.rentAmount?.join(', ')} />
            </div>

            {/* <Input name="ownerName" label="Nome do Proprietário (MVP Simplificado)" error={state.errors?.ownerName?.join(', ')} /> */}

            <SubmitButton />

            {/* Exibição de mensagens de feedback */}
            {state.message && (
                <p className={`mt-4 text-sm p-3 rounded-md ${state.isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {state.message}
                </p>
            )}
        </form>
    );
}