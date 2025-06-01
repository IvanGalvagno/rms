export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface SortOptions<T> {
    sortBy: keyof T | string; // usar keyof T para segurança de tipo se possível
    order: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;   
}
