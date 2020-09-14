import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';

import { MainState } from '../../store/main.state';
import { AuthState } from '../../models';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: Store<MainState>,
        private db: AngularFirestore,
        private authService: AuthService,
    ) {}

    async canActivate(): Promise<boolean> {
        let isAuth: boolean;
        try {
            const isValidToken: boolean = await this.authService.checkToken();
            if (isValidToken) {
                const idTokenResult: auth.IdTokenResult = await new Promise((resolve) => {
                    auth().onAuthStateChanged(user => {
                        if (user) {
                            resolve(user.getIdTokenResult());
                        } else {
                            this.router.navigate(['/signIn']);
                            resolve(null);
                        }
                    });
                });
                if (idTokenResult) {
                    let userStore;
                    const userId: string = idTokenResult.claims.user_id;
                    this.store.select('authStore').subscribe((data: AuthState) => userStore = data );

                    if (!userStore.isAuth) {
                        await this.db.collection('users').doc(userId).get().toPromise().then(async (snapshot) => {
                            const user: firebase.firestore.DocumentData = snapshot.data();
                            await this.authService.setUser(userId, user.email, user.role, idTokenResult.token);
                        });
                    } else {
                        localStorage.setItem('deputies-app', idTokenResult.token);
                    }
                    isAuth = true;
                }
            } else {
                auth().signOut();
                this.router.navigate(['/signIn']);
                isAuth = false;
            }
        } catch (error) {
            this.router.navigate(['/signIn']);
            isAuth = false;
        }
        return isAuth;
    }
}
