import { BaseModel } from "./BaseModel.model";

export interface ApiError {
    description: string;
}

export interface PageInfo {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface EntityWithTitle {
    guid: string;
    title: string;
}