import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import { ResultModel, ChangeEmail, Party, UserModel, UserFormModel } from '../../models';

@Injectable()
export class SettingsService {
    private changeEmail: string = 'https://us-central1-deputy-app.cloudfunctions.net/updateEmail';

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient,
        private db: AngularFirestore,
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

    async getParties(): Promise<Party[]> {
        const parties: Party[] = [];
        await this.db.collection('parties').get().toPromise().then(async (snapshots) => {
            snapshots.forEach(snapshot => {
                const district: Party = {
                    id: snapshot.id,
                    name: snapshot.data().name
                };
                parties.push(district);
            });
        });

        return parties;
    }

    async getUser(): Promise<UserModel> {
        let user: UserModel;
        const userId: string = await this.authService.getUserId();
        await this.db.collection('users').doc(userId).get().toPromise().then(async (snapshot) => {
            const data = snapshot.data();
            if (data.role === 'deputy') {
                user = {
                    id: snapshot.id,
                    name: data.name,
                    surname: data.surname,
                    patronymic: data.patronymic,
                    party: data.party,
                    district: data.district,
                    imageUrl: data.imageUrl,
                    date: data.date,
                };
            } else {
                user = {
                    id: snapshot.id,
                    name: data.name,
                    imageUrl: data.imageUrl,
                    date: data.date,
                };
            }
        });
        return user;
    }

    async updateDeputy(data: UserFormModel, imageUrl: string = null): Promise<ResultModel> {
        let result: ResultModel;
        const { name, surname, patronymic, district, party, description, date} = data;
        const userId: string = await this.authService.getUserId();
        await this.db.collection('users').doc(userId).update({
            name,
            surname,
            patronymic,
            district: district.id,
            party: party.id,
            description,
            imageUrl,
            date
        }).then(async (snapshot) => {
            result = {
                status: true,
                message: 'Вашу сторiнку оновлено'
            };
        }).catch(err => {
            result = {
                status: false,
                message: 'Вибачте, оновлення не застосувались, спробуйте ще раз'
            };
        }) ;
        return result;
    }

    async updateUser(data: UserFormModel, imageUrl: string = null): Promise<ResultModel> {
        let result: ResultModel;
        const { name, surname, date} = data;
        const userId: string = await this.authService.getUserId();
        await this.db.collection('users').doc(userId).update({
            name: name + ' ' + surname,
            date,
            imageUrl
        }).then(async (snapshot) => {
            result = {
                status: true,
                message: 'Вашу сторiнку оновлено'
            };
        }).catch(err => {
            result = {
                status: false,
                message: 'Вибачте, оновлення не застосувались, спробуйте ще раз'
            };
        }) ;
        return result;
    }
}