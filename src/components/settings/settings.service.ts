import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { AuthService } from '../auth/auth.service';
import { ResultModel } from '../../models';

@Injectable()
export class SettingsService {
    httpClient: any;

    constructor(
        private db: AngularFirestore,
        private authService: AuthService
    ) {}

    async updateEmail(email): Promise<boolean> {
        try {
            await auth().currentUser.updateEmail(email).then(async () => {
                auth().currentUser.sendEmailVerification();
                // const userId = await this.authService.getUserId();
                // await this.db.collection('users').doc(userId).update({email});
            });
        } catch (error) {
            return false;
        }

        return true;
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
        console.log('result', result)
        return result;
    }
}
