
export interface PaginatedResponse<T, M = any> {
    items: T[];
    pageInfo: PageInfo<M>;
}

export class PageInfo<M = any> {
    page: number = 1;
    pageSize: number = 0;
    totalCount: number = 0;
    totalPages: number = 0;
    metadata?: M
}