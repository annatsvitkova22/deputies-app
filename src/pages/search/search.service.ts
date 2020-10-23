import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ResultData } from '../../models';

@Injectable()
export class SearchService {

    constructor(
        private httpClient: HttpClient,
    ) {}

    async searchData(searchText: string): Promise<ResultData> {
        let result: ResultData;
        await this.getSearchData(searchText).toPromise().then((res) => {
            result = {
                status: true,
                appeals: res.appeals,
                deputies: res.deputies
            };
        }).catch(err =>  {
            result = {
                status: false,
            };
        });

        return result;
    }

    getSearchData(searchText: string): Observable<any> {
        return this.httpClient.post(environment.searchPath, {
            searchText
        }).pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.error.message || 'Server Error');
    }

}
