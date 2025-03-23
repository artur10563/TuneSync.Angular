import { PageInfo } from "../shared.models";

export interface PaginatedResponse<T> {
    items: T[];
    pageInfo: PageInfo;
}