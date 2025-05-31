import { Property } from "@/core/domain/entities/Property";
import { IPropertyRepository } from "@/core/domain/repositories/IPropertyRepository";
import { CreatePropertyDTO, PropertyDetailsDTO } from "../../dto/PropertyDTO";

export class CreatePropertyUseCase {
    constructor(private propertyRepository: IPropertyRepository) {}

    /**
     * Executa o caso de uso de criação de um novo imóvel.
     * @param data Os dados para criar o imóvel, conforme definido em CreatePropertyDTO.
     * @returns Uma Promise resolvida com os detalhes do imóvel criado (PropertyDetailsDTO).
     * @throws Error se a criação da entidade falhar (ex: validações de negócio na entidade).
     * @throws Error se a persistência no repositório falhar.
     */
    async execute(propertyData: CreatePropertyDTO): Promise<PropertyDetailsDTO> {
        // Cria uma nova instância de Property usando o método estático 'create'
        const propertyEntity = Property.create({
            address: propertyData.address,
            type: propertyData.type,
            description: propertyData.description,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            area: propertyData.area,
            rentAmount: propertyData.rentAmount,
            parkingSpaces: propertyData.parkingSpaces,
        });

        // Persiste a nova propriedade no repositório
        const createdProperty = await this.propertyRepository.create(propertyEntity);

        // Converte a entidade Property para o DTO de detalhes
        return this.toPropertyDetailsDTO(createdProperty);
    }
    toPropertyDetailsDTO(createdProperty: Property): PropertyDetailsDTO | PromiseLike<PropertyDetailsDTO> {
        return {
            id: createdProperty.id,
            address: createdProperty.address,
            type: createdProperty.type,
            description: createdProperty.description,
            bedrooms: createdProperty.bedrooms,
            bathrooms: createdProperty.bathrooms,
            area: createdProperty.area || undefined,
            parkingSpaces: createdProperty.parkingSpaces || undefined,
            rentAmount: createdProperty.rentAmount,
            createdAt: createdProperty.createdAt.toISOString(),
            updatedAt: createdProperty.updatedAt.toISOString(),
        }
    }
}