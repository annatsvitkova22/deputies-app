import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Deputy, AppealCard } from '../../models';
import { AuthService } from '../../components/auth/auth.service';
import { SearchService } from './search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
    searchText: string;
    deputies: Deputy[];
    appeals: AppealCard[];
    isLoader: boolean = true;
    isCreateAppeal: boolean;
    counter: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private searchService: SearchService,
    ){
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.route.queryParams.subscribe(params => {
                    this.searchText = params['query'];
                });
                if (this.counter) {
                    this.onSearch();
                }
                this.counter = 1;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        await this.onSearch();
        const userRole: string = await this.authService.getUserRole();
        if (userRole === 'deputy') {
            this.isCreateAppeal = false;
        } else {
            this.isCreateAppeal = true;
        }

        this.isLoader = false;
    }

    async onSearch(): Promise<void> {
        this.isLoader = true;
        if (this.searchText) {
            const result = await this.searchService.searchData(this.searchText);
            if (result.status) {
                this.appeals = result.appeals;
                this.deputies = result.deputies;
            } else {
                window.alert('Щось пішло не так, перезавантажте сторінку');
            }
        }
        this.isLoader = false;
    }
}
