import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/http';

export type Paste = {
    id: number;
    text: string;
    syntax: string;
    slug: string;
    createdAt: string;
    expiresAt: string;
};
export type PasteRequest = {
    text: string;
    syntax: string;
};

export type PasteResponse = ApiResponse<Paste>;

@Injectable({
    providedIn: 'root',
})
export class PastebinService {
    static readonly API_URL = environment.apiUrl + '/pastebin';

    constructor(private readonly httpClient: HttpClient) {}

    get(slug: string) {
        return this.httpClient.get<PasteResponse>(
            PastebinService.API_URL + '/paste/' + slug
        );
    }

    save(data: PasteRequest) {
        return this.httpClient.post<PasteResponse>(
            PastebinService.API_URL + '/paste',
            data
        );
    }
}
