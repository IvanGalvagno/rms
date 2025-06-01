"use server"

import { CreatePropertyDTO } from "@/core/application/dto/PropertyDTO";
import { createPropertyUseCase } from "@/lib/dependencies";
import { propertySchema } from "@/lib/validations/propertySchema";
import { revalidatePath } from "next/cache";

export interface CreatePropertyFormState {
    message: string | null;
    errors?: {
        address?: string[];
        type?: string[];
        description?: string[];
        bedrooms?: string[];
        bathrooms?: string[];
        area?: string[];
        rentAmount?: string[];
        _form?: string[]; // Erros gerais do formulário
    } | null;
    propertyId?: string; // ID do imóvel criado, se aplicável
    isLoading: boolean;
    isSuccess: boolean;
}

const initialState: CreatePropertyFormState = {
    message: null,
    errors: null,
    propertyId: undefined,
    isLoading: false,
    isSuccess: false,
};

export async function createPropertyAction(
    prevState: CreatePropertyFormState, // Estado anterior, util para useFormState
    formData: FormData
): Promise<CreatePropertyFormState> {
    // 1. Extrair e validar os dados do formulário
    const rawFormData = Object.fromEntries(formData.entries());
    const validationResult = propertySchema.safeParse(rawFormData);

    if (!validationResult.success) {
        const fieldError = validationResult.error.flatten().fieldErrors;
        console.error("Erro de validação:", fieldError);
        return {
            message: "Erro de validação nos dados do formulário.",
            errors: fieldError,
            isLoading: false,
            isSuccess: false,
            propertyId: undefined,
        }
    }

    // 2. Preparar o DTO para o caso de uso
    // Os dados já foram coagidos para os tipos corretos pelo Zod (ex: bedrooms para number)
    const propertyDataForUseCase: CreatePropertyDTO = {
        address: validationResult.data.address,
        type: validationResult.data.type,
        description: validationResult.data.description || undefined, // Pode ser undefined se não for fornecido
        bedrooms: validationResult.data.bedrooms,
        bathrooms: validationResult.data.bathrooms,
        area: validationResult.data.area || undefined, // Pode ser undefined se não for fornecido
        rentAmount: validationResult.data.rentAmount,
        parkingSpaces: validationResult.data.parkingSpaces || undefined, // Pode ser undefined se não for fornecido
    };

    // 3. Executar o Caso de Uso
    try {
        const newProperty = await createPropertyUseCase.execute(propertyDataForUseCase);
        // 4. Revalidar o cache da rota onde a lista de imóveis é exibida (antecipando)
        revalidatePath('/(dashboard)/properties'); // Ajuste o path se for diferente
        return {
            message: `Propriedade criada com sucesso!`,
            errors: null,
            isLoading: false,
            isSuccess: true,
            propertyId: newProperty.id, // Retorna o ID do imóvel criado
        }
    } catch (error: any) {
        console.error("Erro ao criar propriedade:", error);
        return {
            message: error.message || "Erro ao criar a propriedade. Tente novamente mais tarde.",
            errors: { _form: [error.message || "Erro desconhecido ao tentar criar propriedade."] },
            isLoading: false,
            isSuccess: false,
            propertyId: undefined,
        };
        
    }
}