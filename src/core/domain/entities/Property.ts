import crypto from 'node:crypto';

export enum PropertyType {
    APARTMENT = 'APARTMENT',	
    HOUSE = 'HOUSE'
}

// Interface para as propriedades (atributos) de um Imóvel.
export interface PropertyProps {
    id?: string; // O ID é opcional na criação, pois pode ser gerado.
    address: string;
    type: PropertyType;
    description?: string;
    bedrooms: number;
    bathrooms: number;
    area?: number; // metros quadrados
    parkingSpaces?: number; // número de vagas de garagem
    rentAmount: number; // valor do aluguel
    status: 'AVAILABLE' | 'RENTED' | 'UNAVAILABLE' | 'UNDER_MAINTENANCE'; // status do imóvel
    createdAt?: Date;
    updatedAt?: Date;
}

// Imovel
export class Property {
    public readonly id: string;
    public props: Omit<PropertyProps, 'id'> & { createdAt: Date; updatedAt: Date };

    private constructor(props: PropertyProps, id?: string) {
        this.id = id ?? crypto.randomUUID();
        const now = new Date();
        this.props = {
            ...props,
            createdAt: props.createdAt ?? now,
            updatedAt: props.updatedAt ?? now,
        };
    }

     /**
     * Método estático para criar uma nova instância de Property.
     * Útil para encapsular a lógica de criação e validação inicial.
     * @param props - As propriedades para criar o imóvel, sem o ID.
     * @param id - Opcional: um ID existente, se estiver recriando um objeto (ex: do banco de dados).
     */
    public static create(props: Omit<PropertyProps, 'id' | 'createdAt' | 'updatedAt'>, id?: string): Property {
        this.validate(props);
        // Remove 'id' explicitamente das props para garantir que o construtor lide com isso.
        const { id: _, ...restOfProps } = props as PropertyProps;
        return new Property(restOfProps, id);
    }

    private static validate(props: PropertyProps): void {
        // Validações de negócio básicas que devem ser verdadeiras para qualquer imóvel.
        if (!props.address || props.address.trim().length < 5) {
            throw new Error("O endereço é obrigatório e deve ter pelo menos 5 caracteres.");
        }
        if (!props.type || !Object.values(PropertyType).includes(props.type)) {
            throw new Error("O tipo do imóvel é inválido ou não foi fornecido.");
        }
        if (props.bedrooms < 0) {
            throw new Error("O número de quartos não pode ser negativo.");
        }
        if (props.bathrooms < 0) {
            throw new Error("O número de banheiros não pode ser negativo.");
        }
        if (props.area && props.area <= 0) {
            throw new Error("A área do imóvel deve ser um valor positivo.");
        }
        if (props.rentAmount <= 0) {
            throw new Error("O valor do aluguel deve ser positivo.");
        }
        if (props.parkingSpaces && props.parkingSpaces < 0) {
            throw new Error("O número de vagas de garagem não pode ser negativo.");
        }
    }

    // --- Getters para acesso controlado às propriedades ---
    get address(): string { return this.props.address; }
    get type(): PropertyType { return this.props.type; }
    get description(): string | undefined { return this.props.description; }
    get bedrooms(): number { return this.props.bedrooms; }
    get bathrooms(): number { return this.props.bathrooms; }
    get area(): number | undefined { return this.props.area ?? undefined; }
    get rentAmount(): number { return this.props.rentAmount; }
    get parkingSpaces(): number | undefined { return this.props.parkingSpaces ?? undefined; }
    get status(): string { return this.props.status; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }
    // get ownerId(): string { return this.props.ownerId; }

    public markAsRented(): void {
        if (this.props.status !== 'AVAILABLE') {
            throw new Error("O imóvel só pode ser marcado como alugado se estiver disponível.");
        }
        this.props.status = 'RENTED';
        this.props.updatedAt = new Date();
    }

    public markAsAvailable(): void {
        if (this.props.status !== 'RENTED') {
            throw new Error("O imóvel só pode ser marcado como disponível se estiver alugado.");
        }
        this.props.status = 'AVAILABLE';
        this.props.updatedAt = new Date();
    }

    // Método para atualizar o imóvel
    public update(props: Partial<Omit<PropertyProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
        Property.validate({ ...this.props, ...props } as PropertyProps);
        const now = new Date();
        // Atualiza as propriedades do imóvel, mantendo o ID e os timestamps
        this.props = {
            ...this.props,
            ...props,
            updatedAt: now, // Atualiza o timestamp de modificação
        };
    }
}