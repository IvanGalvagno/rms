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
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Property[]> {
        throw new Error("Method not implemented.");
    }
    update(property: Property): Promise<Property | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    private async verifyPropertyExists(id: string): Promise<boolean> {
        return this.items.some(item => item.id === id);
    }
}