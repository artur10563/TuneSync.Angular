export interface ApiError {
    description: string;
}

export interface PageInfo {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}