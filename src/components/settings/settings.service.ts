import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { ResultModel, ChangeEmail } from '../../models';

@Injectable()
export class SettingsService {
    private changeEmail: string = 'https://us-central1-deputy-app.cloudfunctions.net/updateEmail';

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient,
    ) {}

    async updateEmail(email): Promise<boolean> {
        try {
            const userId = await this.authService.getUserId();
            const oldUserEmail = await this.authService.getUserEmail();
            const data: ChangeEmail = {
                userId,
                oldUserEmail,
                newUserEmail: email
            };

            await this.sendEmailDeputy(data).toPromise().then((res: boolean) => {
                return res;
            });
        } catch (error) {
            return false;
        }

        return true;
    }

    sendEmailDeputy(data: ChangeEmail): Observable<any> {
        return this.httpClient.post(this.changeEmail, data)
            .pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.message || 'Server Error');
    }

    async updatePassword(password, oldPassword): Promise<ResultModel> {
        let result: ResultModel = {status: null, message: null};
        try {
            await auth().currentUser.reauthenticateWithCredential(
                auth.EmailAuthProvider.credential(
                    auth().currentUser.email,
                    oldPassword
                )
            ).then(async res => {
                await res.user.updatePassword(password);
                result = {
                    status: true
                };
            }).catch(err => {
                result = {
                    status: false,
                    message: 'Некоректний старий пароль'
                };
            });
        } catch (error) {
            result = {
                status: false,
                message: 'Помилка оновлення паролю'
            };
        }
        return result;
    }
}
