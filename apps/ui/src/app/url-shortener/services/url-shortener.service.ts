import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ApiResponse } from '../../shared/interfaces/http';

export type ShortenResponse = ApiResponse<{
    id: number;
    url: string;
    slug: string;
    createdAt: string;
    expiresAt: string;
}>;

export type RedirectResponse = ApiResponse<{ url: string }>;

@Injectable()
export class UrlShortenerService {
    static readonly SHORTEN_URL = environment.apiUrl + '/url-shortener';

    constructor(private readonly httpClient: HttpClient) {}

    shorten(url: string) {
        return this.httpClient.post<ShortenResponse>(
            UrlShortenerService.SHORTEN_URL + '/shorten',
            { url },
        );
    }

    redirect(slug: string) {
        return this.httpClient.get<RedirectResponse>(
            UrlShortenerService.SHORTEN_URL + '/redirect/' + slug,
        );
    }
}
