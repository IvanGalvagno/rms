import { PaginationOptions, PaginationResult, SortOptions } from "@/core/application/types/pagination";
import { Property, PropertyProps } from "../entities/Property";

export interface IPropertyRepository {
    /**
     * Cria um novo imóvel na fonte de dados.
     * @param property A entidade Property a ser persistida.
     * @returns Uma Promise resolvida com a entidade Property persistida (pode incluir ID gerado, etc.).
     */
    create(property: Property): Promise<Property>

    /**
     * Encontra um imóvel pelo seu ID.
     * @param id O ID único do imóvel.
     * @returns Uma Promise resolvida com a entidade Property encontrada, ou null se não existir.
     */
    findById(id: string): Promise<Property | null>;

     /**
     * Encontra todos os imóveis com suporte a paginação e ordenação.
     * @param paginationOptions Opções de paginação (página e limite).
     * @param sortOptions Opções de ordenação (campo e direção).
     * @param filters (Opcional) Critérios de filtro.
     * @returns Uma Promise resolvida com um resultado paginado de entidades Property.
     */
    findAll(
        paginationOptions: PaginationOptions,
        sortOptions?: SortOptions<PropertyProps>,
        //filters?: Partial<PropertyProps> TODO!: Implementar filtros
    ): Promise<PaginationResult<Property>>;

     /**
     * Atualiza um imóvel existente.
     * @param property A entidade Property com os dados atualizados.
     * @returns Uma Promise resolvida com a entidade Property atualizada, ou null se o imóvel não for encontrado.
     */
    update(property: Property): Promise<Property | null>;

    /**
     * Deleta um imóvel pelo seu ID.
     * @param id O ID único do imóvel a ser deletado.
     * @returns Uma Promise resolvida com true se a deleção for bem-sucedida, false caso contrário.
     */
    delete(id: string): Promise<boolean>;

}