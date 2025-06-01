import { PropertyType } from "@/core/domain/entities/Property";

/**
 * DTO para a criação de um novo imóvel.
 * Contém os dados necessários que vêm da camada de apresentação (ou API).
 */
export interface CreatePropertyDTO {
    address: string;
    type: PropertyType; // Usando o enum definido na entidade para consistência
    description?: string;
    bedrooms: number;
    bathrooms: number;
    area?: number;
    rentAmount: number;
    parkingSpaces?: number; // número de vagas de garagem
}

/**
 * DTO para representar os detalhes de um imóvel.
 * Usado como um objeto de retorno padronizado pelos casos de uso.
 * Pode ser uma versão simplificada ou formatada da entidade Property.
 */
export interface PropertyDetailsDTO {
  id: string;
  address: string;
  type: PropertyType;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  rentAmount: number;
  parkingSpaces?: number; // número de vagas de garagem
  // ownerId?: string;
  // status?: string;
  createdAt: string; // Datas podem ser strings ISO para facilitar o trânsito (ex: JSON)
  updatedAt: string;
}