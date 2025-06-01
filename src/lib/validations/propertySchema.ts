import { PropertyType } from '@/core/domain/entities/Property';
import { z } from 'zod';

export const propertySchema = z.object({
    address: z.string()
        .min(5, { message: "O endereço é obrigatório e deve ter pelo menos 5 caracteres." }),
    type: z.nativeEnum(PropertyType, { errorMap: () => ({ message: "O tipo do imóvel é inválido ou não foi fornecido." }) }),
    description: z.string()
        .max(1000, { message: "A descrição deve ter no máximo 1000 caracteres." })
        .optional()
        .or(z.literal('')), // Permite string vazia ou undefined
    bedrooms: z.coerce.number({ invalid_type_error: "O número de quartos deve ser um número." })
        .int({ message: "O número de quartos deve ser um número inteiro." })
        .min(0, { message: "O número de quartos não pode ser negativo." }),
    bathrooms: z.coerce.number({ invalid_type_error: "O número de banheiros deve ser um número." })
        .int({ message: "O número de banheiros deve ser um número inteiro." })
        .min(0, { message: "O número de banheiros não pode ser negativo." }),
    area: z.coerce.number({ invalid_type_error: "A área deve ser um número." })
        .positive({ message: "A área do imóvel deve ser um valor positivo." })
        .optional(),
    rentAmount: z.coerce.number({ invalid_type_error: "O valor do aluguel deve ser um número." })
        .positive({ message: "O valor do aluguel deve ser positivo." }),
});

export type PropertyFormData = z.infer<typeof propertySchema>;