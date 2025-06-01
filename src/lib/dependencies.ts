// --- Importações das Camadas de Domínio e Infraestrutura ---

// Repositório (Interface e Implementação Concreta)
import { CreatePropertyUseCase } from "@/core/application/useCases/properties/CreatePropertyUseCase";
import { ListPropertiesUseCase } from "@/core/application/useCases/properties/ListPropertiesUseCase";
import { IPropertyRepository } from "@/core/domain/repositories/IPropertyRepository";
import { InMemoryPropertyRepository } from "@/infra/database/inmemory/repositories/InMemoryPropertyRepository";

// --- Instanciação dos Repositórios ---
const propertyRepositoryInstance: IPropertyRepository = new InMemoryPropertyRepository();

// --- Instanciação dos Casos de Uso ---
export const createPropertyUseCase = new CreatePropertyUseCase(propertyRepositoryInstance);
export const listPropertyUseCase = new ListPropertiesUseCase(propertyRepositoryInstance);
// Outros casos de uso podem ser instanciados aqui, seguindo o mesmo padrão injetando as dependências necessárias:
// export const findPropertyByIdUseCase = new FindPropertyByIdUseCase(propertyRepositoryInstance);
// export const listAllPropertiesUseCase = new ListAllPropertiesUseCase(propertyRepositoryInstance);
// export const updatePropertyUseCase = new UpdatePropertyUseCase(propertyRepositoryInstance);
// export const deletePropertyUseCase = new DeletePropertyUseCase(propertyRepositoryInstance);


// --- Opcional: Exportar instâncias de repositórios se precisarem ser usadas diretamente ---
// Geralmente, é preferível que a interação com os dados passe pelos casos de uso,
// mas em algumas situações (ex: seeders, scripts administrativos) pode ser útil.
export const propertyRepository: IPropertyRepository = propertyRepositoryInstance;

console.info("Dependências configuradas. Usando Property Repository:", propertyRepositoryInstance.constructor.name);