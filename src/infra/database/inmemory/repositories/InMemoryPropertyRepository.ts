import { Property } from "@/core/domain/entities/Property";
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
    findAll(): Promise<Property[]> {
        const properties = this.items.map((property) => Property.create({...property.props}, property.id));
        return Promise.resolve(properties);
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
        throw new Error("Method not implemented.");
    }

    private async verifyPropertyExists(id: string): Promise<boolean> {
        return this.items.some(item => item.id === id);
    }
}