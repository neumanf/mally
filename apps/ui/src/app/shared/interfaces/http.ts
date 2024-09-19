// interface SuccessResponse<T> {
//     status: 'success';
//     message: string;
//     data: T;
//     errors: null;
// }

// interface ErrorResponse {
//     status: 'error';
//     message: string;
//     data: null;
//     errors: string[];
// }

// export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T;
    errors: string[] | null;
}

export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
    };
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    size: number;
    totalElements: number;
    totalPages: number;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
}
