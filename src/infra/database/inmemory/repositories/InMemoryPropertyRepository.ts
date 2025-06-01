import { PaginationOptions, PaginationResult, SortOptions } from "@/core/application/types/pagination";
import { Property, PropertyProps } from "@/core/domain/entities/Property";
import { IPropertyRepository } from "@/core/domain/repositories/IPropertyRepository";

export class InMemoryPropertyRepository implements IPropertyRepository {
    private items: Property[] = [];

    /**
     * Cria um novo imóvel na memória.
     * Para simular um ambiente real e evitar mutações diretas do objeto original,
     * uma nova instância da entidade é criada (ou clonada) antes de ser adicionada.
     */
    async create(property: Property): Promise<Property> {
        const existingProperty = await this.verifyPropertyExists(property.id);
        if (existingProperty) {
            throw new Error(`Property with id ${property.id} already exists.`);
        }
        this.items.push(property);
        return Promise.resolve(property);
    }
    findById(id: string): Promise<Property | null> {
         const foundProperty = this.items.find(item => item.id === id);
        if (!foundProperty) {
            return Promise.resolve(null);
        }
        // Retorna uma nova instância da entidade baseada nas props do objeto encontrado
        // para simular a desserialização de um banco de dados e garantir imutabilidade.
        // Ou, se a entidade Property for projetada para ser imutável após a criação (exceto por métodos específicos),
        // retornar foundProperty diretamente pode ser aceitável para um InMemory, mas clonar é mais seguro.
        const instance = Property.create({...foundProperty.props}, foundProperty.id);
        return Promise.resolve(instance);
    }
    findAll(
        paginationOptions: PaginationOptions,
        sortOptions?: SortOptions<PropertyProps>
    ): Promise<PaginationResult<Property>> {
        let sortedItems = [...this.items]; // Começa com uma cópia para não modificar o original

        // Aplicar Filtros (a ser implementado no futuro)
        // if (filters) { ... }

        // Aplicar Ordenação
        if (sortOptions && sortOptions.sortBy) {
        const { sortBy, order } = sortOptions;
        type PropsKeys = keyof (Omit<PropertyProps, "id"> & { createdAt: Date; updatedAt: Date; });
        const sortKey = sortBy as PropsKeys;
        sortedItems.sort((a, b) => {
            // Acessa as props da entidade para ordenação
            const valA = a.props[sortKey];
            const valB = b.props[sortKey];

            // Tratamento básico para diferentes tipos de dados
            if (typeof valA === 'string' && typeof valB === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
            return order === 'asc' ? valA - valB : valB - valA;
            }
            if (valA instanceof Date && valB instanceof Date) {
            return order === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
            }
            // Fallback para outros tipos ou se um for nulo/undefined
            if (valA === undefined && valB !== undefined) return order === 'asc' ? -1 : 1;
            if (valA !== undefined && valB === undefined) return order === 'asc' ? 1 : -1;
            if (valA === undefined && valB === undefined) return 0;
            if (valA !== undefined && valB !== undefined && valA < valB) return order === 'asc' ? -1 : 1;
            if (valA !== undefined && valB !== undefined && valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
        }

        // Aplicar Paginação
        const { page, limit } = paginationOptions;
        const totalItems = sortedItems.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedItems = sortedItems.slice(startIndex, endIndex);

        return Promise.resolve({
            data: paginatedItems.map(item => Property.create({...item.props}, item.id)), // Retorna cópias das entidades
            totalItems,
            currentPage: page,
            totalPages,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        });
    }

    update(property: Property): Promise<Property | null> {
        const itemIndex = this.items.findIndex(item => item.id === property.id);

        if (itemIndex === -1) {
        return Promise.resolve(null); // Imóvel não encontrado para atualização.
        }

        // Substitui o imóvel antigo pela nova versão atualizada.
        // A entidade 'property' já deve conter as props atualizadas e um 'updatedAt' novo.
        this.items[itemIndex] = property;
        return Promise.resolve(property); // Retorna a instância atualizada. 
    }
    delete(id: string): Promise<boolean> {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex === -1) {
        return Promise.resolve(false); // Imóvel não encontrado, nada para deletar.
        }

        this.items.splice(itemIndex, 1); // Remove o item do array.
        return Promise.resolve(true); // Retorna true indicando que a deleção foi bem-sucedida.
    }

    private async verifyPropertyExists(id: string): Promise<boolean> {
        return this.items.some(item => item.id === id);
    }
}