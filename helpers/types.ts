type Mode = 'trending' | 'random' | 'search';

type FetchOptions = {
    q?: string,
    limit: number,
    offset: number,
}

type Pagination = {
    current: number,
    total: number,
    offset?: number,
}

export type {
    Mode,
    FetchOptions,
    Pagination,
}