import { Injectable } from '@angular/core';
import { ApiResponse, Page } from '../../shared/interfaces/http';
import { HttpService } from '../../shared/services/http/http.service';
import { ObjectUtils } from '../../shared/utils/object';
import { PaginationParams } from '../../url-shortener/services/url-shortener.service';

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
    expiration: string;
};

export type PasteResponse = ApiResponse<Paste>;
export type PastesReponse = Page<Paste>;

@Injectable({
    providedIn: 'root',
})
export class PastebinService {
    private readonly BASE_PATH = '/pastebin';

    constructor(private readonly httpService: HttpService) {}

    findAll(options: PaginationParams = {}) {
        const params = ObjectUtils.filterDefinedValues(options);

        return this.httpService.get<PastesReponse>(this.BASE_PATH + '/', {
            params,
        });
    }

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

    delete(id: number) {
        return this.httpService.delete(this.BASE_PATH + '/' + id);
    }

    deleteMany(ids: number[]) {
        return this.httpService.delete(this.BASE_PATH + '/bulk', {
            params: {
                id: ids.map((id) => id.toString()),
            },
        });
    }
}
