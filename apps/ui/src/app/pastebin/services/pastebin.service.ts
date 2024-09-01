import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../shared/interfaces/http';
import { HttpService } from '../../shared/services/http/http.service';

export type Paste = {
    id: number;
    text: string;
    syntax: string;
    slug: string;
    encrypted: boolean;
    createdAt: string;
    expiresAt: string;
};
export type PasteRequest = {
    text: string;
    syntax: string;
    encrypted: boolean;
};

export type PasteResponse = ApiResponse<Paste>;

@Injectable({
    providedIn: 'root',
})
export class PastebinService {
    private readonly BASE_PATH = '/pastebin';

    constructor(private readonly httpService: HttpService) {}

    get(slug: string) {
        return this.httpService.get<PasteResponse>(
            this.BASE_PATH + '/paste/' + slug,
        );
    }

    save(data: PasteRequest) {
        return this.httpService.post<PasteResponse>(
            this.BASE_PATH + '/paste',
            data,
        );
    }
}
