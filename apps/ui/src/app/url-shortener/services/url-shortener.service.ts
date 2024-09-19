import { Injectable } from '@angular/core';
import { ApiResponse, Page } from '../../shared/interfaces/http';
import { HttpService } from '../../shared/services/http/http.service';
import { Url } from '../../shared/interfaces/url';
import { ObjectUtils } from '../../shared/utils/object';

export type ShortenResponse = ApiResponse<{
    id: number;
    url: string;
    slug: string;
    createdAt: string;
    expiresAt: string;
}>;

export type RedirectResponse = ApiResponse<{ url: string }>;

export type UrlsResponse = Page<Url>;

export type PaginationParams = {
    search?: string;
    sortBy?: string;
    orderBy?: string;
    pageNumber?: string;
    pageSize?: string;
};

@Injectable()
export class UrlShortenerService {
    private readonly BASE_PATH = '/url-shortener';

    constructor(private readonly httpService: HttpService) {}

    findAll(options: PaginationParams = {}) {
        const params = ObjectUtils.filterDefinedValues(options);

        return this.httpService.get<UrlsResponse>(this.BASE_PATH + '/', {
            params,
        });
    }

    shorten(url: string) {
        return this.httpService.post<ShortenResponse>(
            this.BASE_PATH + '/shorten',
            { url },
        );
    }

    redirect(slug: string) {
        return this.httpService.get<RedirectResponse>(
            this.BASE_PATH + '/redirect/' + slug,
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
