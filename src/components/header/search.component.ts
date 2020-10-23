import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-search-header',
    templateUrl: './search.component.html',
    styleUrls: ['./header.component.scss']
})
export class SearchHeaderComponent implements OnInit {
    isSearch: boolean = false;
    serchText: string;

    constructor(
        private router: Router,
    ){ }

    handleSearch() {
        this.isSearch = !this.isSearch;
    }

    async ngOnInit(): Promise<void> {
    }

    onSearch(): void {
        this.router.navigate(['search'], {
            queryParams: {
                query: this.serchText
            },
            queryParamsHandling: 'merge',
        });
    }
}
