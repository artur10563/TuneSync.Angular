import { BaseModel } from "./BaseModel.model";

export interface ApiError {
    description: string;
}

export class PageInfo {
    page: number = 1;
    pageSize: number = 0;
    totalCount: number = 0;
    totalPages: number = 0;
}

export interface EntityWithTitle {
    guid: string;
    title: string;
}