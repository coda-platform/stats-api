export interface ResponseError extends Error {
    status?: number;
    query? : string;
}