import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { KeycloakService } from '../../../auth/services/keycloak.service';

export interface RequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body';
    params?: HttpParams | { [header: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    body?: unknown;
}

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private readonly API_BASE_URL = environment.apiUrl;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly keycloakService: KeycloakService,
    ) {}

    public get<T>(endPoint: string, options?: RequestOptions): Observable<T> {
        return this.httpClient.get<T>(this.API_BASE_URL + endPoint, {
            headers: this.getDefaultHeaders(),
            ...options,
        });
    }

    public post<T>(
        endPoint: string,
        params: object,
        options?: RequestOptions,
    ): Observable<T> {
        return this.httpClient.post<T>(this.API_BASE_URL + endPoint, params, {
            headers: this.getDefaultHeaders(),
            ...options,
        });
    }

    public put<T>(
        endPoint: string,
        params: object,
        options?: RequestOptions,
    ): Observable<T> {
        return this.httpClient.put<T>(this.API_BASE_URL + endPoint, params, {
            headers: this.getDefaultHeaders(),
            ...options,
        });
    }

    public delete<T>(
        endPoint: string,
        options?: RequestOptions,
    ): Observable<T> {
        return this.httpClient.delete<T>(this.API_BASE_URL + endPoint, {
            headers: this.getDefaultHeaders(),
            ...options,
        });
    }

    private getDefaultHeaders() {
        let headers = new HttpHeaders();

        const accessToken = this.keycloakService.getAccessToken();
        if (accessToken)
            headers = headers.set('Authorization', `Bearer ${accessToken}`);

        return headers;
    }
}
