import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { MainState } from '../../store/main.state';
import { AddAuth, DeleteAuth } from '../../store/auth.action';
import { AuthState, CreateUser, SocialProfile, UserAvatal, AuthUser, ResultModel, PictureModal } from '../../models';

@Injectable()
export class AuthService {

    constructor(
        private authFire: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private store: Store<MainState>,
        private httpClient: HttpClient,
    ) {}

    async signIn(email: string, password: string): Promise<ResultModel> {
        let success: ResultModel = {
            status: false,
            message: ''
        };
        await this.authFire.signInWithEmailAndPassword(email, password).then(async result => {
            await this.db.collection('users').doc(result.user.uid).get().subscribe(async (snapshot) => {
                const user: firebase.firestore.DocumentData = snapshot.data();
                const name: string[] = user.name.split(' ');
                const shortName: string = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
                await this.setUser(result.user.uid, user.email, user.role, user.imageUrl, shortName);
                this.router.navigate(['/']);
            });
        }).catch(err => {
            const message: string = err.code === 'auth/user-not-found' ?  'Неправильний логин' : 'Неправильний пароль';
            success = {
                status: true,
                message
            };
        });

        return success;
    }

    async setUser(userId: string, email: string, role: string, imageUrl: string, shortName: string, token = null): Promise<void> {
        const authStore: AuthState = {
            isAuth: true,
            user: { role, email, userId, imageUrl, shortName }
        };
        this.store.dispatch(new AddAuth(authStore));
        let getIdTokenResult: auth.IdTokenResult;
        if (!token) {
            getIdTokenResult = await auth().currentUser.getIdTokenResult();
        }
        localStorage.setItem('deputies-app', token ? token : getIdTokenResult.token);
    }

    async signUp(data: CreateUser): Promise<boolean> {
        let success: boolean = false;
        const {email, password, name, surname}: CreateUser = data;
        const fullName: string = surname + ' ' + name;
        await this.authFire.createUserWithEmailAndPassword(email, password).then(async result => {
            await this.writeUserToCollection(result.user.uid, fullName, email);
            result.user.sendEmailVerification();
            this.router.navigate(['/sign-in']);
        }).catch(() => {
            success = true;
        });

        return success;
    }

    async resetPassword(email: string): Promise<string> {
        let message: string = 'Запит пройшов успішно, перевірте Вашу пошту';

        await this.authFire.sendPasswordResetEmail(email).catch(err => message = 'Користувача з такою поштою не знайдено');

        return message;
    }

    async getAuthUser(): Promise<string> {
        let email: string;

        await this.authFire.onAuthStateChanged(user => {
            if (user) {
                email = user.email;
            } else {
                email = null;
            }
        });

        return email;
    }

    async googleSingIn(): Promise<void> {
        const provider = new auth.GoogleAuthProvider();
        this.singInBySocial(provider, 'google');
    }

    async facebookSingIn(): Promise<void> {
        const provider = new auth.FacebookAuthProvider();
        this.singInBySocial(provider, 'facebook');
    }

    async singInBySocial(provider, type: string): Promise<void> {
        const credential = await this.authFire.signInWithPopup(provider);
        const { uid, email, displayName} = credential.user;
        const name: string[] = displayName.split(' ');
        const shortName: string = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
        const profile: SocialProfile = credential.additionalUserInfo.profile as SocialProfile;
        let pictureUrl: string;
        if (type === 'facebook') {
            const pictureObj: PictureModal = profile.picture as PictureModal;
            pictureUrl = pictureObj.data.url;
        } else {
            pictureUrl = profile.picture as string;
        }
        if (credential.additionalUserInfo.isNewUser) {
            await this.writeUserToCollection(uid, displayName, email, pictureUrl);
        }
        await this.setUser(uid, email, 'user', pictureUrl, shortName);
        this.router.navigate(['/']);
    }

    async writeUserToCollection(userId: string, name: string, email: string, imageUrl: string = null): Promise<boolean> {
        try {
            await this.db.collection('users').doc(userId).set({
                name,
                email,
                role: 'user',
                imageUrl
            });
        } catch (error) {
            return error;
        }

        return true;
    }

    async getUserId(): Promise<string>  {
        let userId: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userId = data.user ? data.user.userId : null);

        return userId;
    }

    async getUserEmail(): Promise<string>  {
        let userEmail: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userEmail = data.user.email);

        return userEmail;
    }

    async getUserRole(): Promise<string>  {
        let userRole: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userRole = data.user ? data.user.role : null);

        return userRole;
    }

    async getUserImage(): Promise<UserAvatal>  {
        let userImage: UserAvatal;
        this.store.select('authStore').subscribe((data: AuthState) =>  {
            if (data.user) {
                userImage = {
                    imageUrl: data.user.imageUrl ? data.user.imageUrl : null,
                    shortName: data.user.shortName ? data.user.shortName : null
                };
            }
        });

        return userImage;
    }

    async getUserById(): Promise<AuthUser> {
        let userInfo: AuthUser;
        const userId: string = await this.getUserId()
        // tslint:disable-next-line: max-line-length
        await this.db.collection('users').doc(userId).get().toPromise().then(async span => {
            const data: firebase.firestore.DocumentData = span.data();
            const userImage = await this.getUserImage();
            userInfo = {
                userId,
                name: data.role === 'deputy' ? data.surname + ' ' + data.name : data.name,
                role: data.role,
                email: data.email,
                imageUrl: userImage.imageUrl,
                shortName: userImage.shortName
            };
        });

        return userInfo;
    }

    async checkToken(): Promise<boolean> {
        let isValid: boolean;
        const token: string = localStorage.getItem('deputies-app');
        if (token) {
            await this.getTokenResponse(token).toPromise().then((res) => {
                isValid = true;
            }).catch(err =>  {
                isValid = false;
                this.signOut();
            });
        } else {
            isValid = false;
        }

        return isValid;
    }

    getTokenResponse(token: string): Observable<any> {
        return this.httpClient.post(environment.checkTokenPath, {
            token
        }).pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.error.message || 'Server Error');
    }

    signOut(): void {
        this.authFire.signOut();
        this.store.dispatch(new DeleteAuth());
        localStorage.removeItem('deputies-app');
    }
}
