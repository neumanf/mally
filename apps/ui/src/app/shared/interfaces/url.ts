export interface Url {
    id: number;
    url: string;
    slug: string;
    custom: boolean;
    userId: string | null;
    createdAt: string;
    expiresAt: string;
}
