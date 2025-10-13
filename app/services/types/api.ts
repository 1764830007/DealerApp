export interface ApiResponse<T> {
    success: boolean;
    result: T;
    error?: {
        code: number;
        message: string;
        details?: string;
    };
}

export class ApiError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

export class NetworkError extends ApiError {
    constructor(message: string = 'Network error') {
        super(message, 0);
        this.name = 'NetworkError';
    }
}