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
