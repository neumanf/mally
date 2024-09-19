import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { ApiResponse } from '../../shared/interfaces/http';

export type DashboardStats = {
    urlShortener: {
        total: number;
    };
    pastebin: {
        total: number;
    };
};

@Injectable()
export class StatsService {
    private readonly BASH_PATH = '/stats';

    constructor(private readonly httpService: HttpService) {}

    getDashboardStats() {
        return this.httpService.get<ApiResponse<DashboardStats>>(
            this.BASH_PATH + '/dashboard',
        );
    }
}
