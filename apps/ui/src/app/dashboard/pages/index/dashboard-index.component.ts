import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';

@Component({
    selector: 'app-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrl: './dashboard-index.component.scss',
})
export class DashboardIndexComponent implements OnInit {
    constructor(private readonly httpService: HttpService) {}

    ngOnInit() {
        this.httpService.get('/url-shortener/').subscribe((res) => {
            console.log(res);
        });
    }
}
