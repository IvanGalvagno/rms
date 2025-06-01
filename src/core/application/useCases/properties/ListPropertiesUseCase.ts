import { IPropertyRepository } from "@/core/domain/repositories/IPropertyRepository";
import { ListPropertiesResponseDTO } from "../../dto/PropertyDTO";
import { PaginationOptions, SortOptions } from "../../types/pagination";
import { PropertyProps } from "@/core/domain/entities/Property";

export class ListPropertiesUseCase {
    constructor(private propertyRepository: IPropertyRepository) {}

    async execute(
        paginationOptions: PaginationOptions,
        sortOptions?: SortOptions<PropertyProps>,
        // filters?: Partial<PropertyProps>
    ): Promise<ListPropertiesResponseDTO> {
        // Validações básicas para paginação TODO: Melhorar com validações mais robustas em arquivo separado
        if (paginationOptions.page < 1) paginationOptions.page = 1;
        if (paginationOptions.limit < 1) paginationOptions.limit = 10; // Default limit
        if (paginationOptions.limit > 100) paginationOptions.limit = 100; // Max limit

        // Validações para ordenação (ex: verificar se sortBy é um campo válido)
        // Por simplicidade, vamos assumir que o repositório lida com campos inválidos ou o frontend envia corretamente.
        // Em um sistema real, você adicionaria validação para os valores de sortOptions.sortBy.

         const paginatedResult = await this.propertyRepository.findAll(
            paginationOptions,
            sortOptions
            // filters
        );

        // Mapear as entidades Property para PropertyDetailsDTO
        const propertyDTOs = paginatedResult.data.map(property => ({
            id: property.id,
            address: property.address,
            type: property.type,
            description: property.description,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            rentAmount: property.rentAmount,
            createdAt: property.createdAt.toISOString(),
            updatedAt: property.updatedAt.toISOString(),
        }));

            return {
                data: propertyDTOs,
                totalItems: paginatedResult.totalItems,
                currentPage: paginatedResult.currentPage,
                totalPages: paginatedResult.totalPages,
                itemsPerPage: paginatedResult.itemsPerPage,
                hasNextPage: paginatedResult.hasNextPage,
                hasPreviousPage: paginatedResult.hasPreviousPage,
            };
    }
    
}