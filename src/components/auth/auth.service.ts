import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { MainState } from '../../store/main.state';
import { AddAuth } from '../../store/auth.action';
import { AuthState, CreateUser } from '../../models';

@Injectable()
export class AuthService {

    constructor(
        private authFire: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private store: Store<MainState>,
    ) {}

    async signIn(email: string, password: string): Promise<boolean> {
        let success: boolean = false;
        await this.authFire.signInWithEmailAndPassword(email, password).then(async result => {
            await this.db.collection('users').doc(result.user.uid).get().subscribe(async (snapshot) => {
                const user: firebase.firestore.DocumentData = snapshot.data();
                await this.setUser(result.user.uid, user.email, user.role);
            });

            this.router.navigate(['/']);
        }).catch(err => {
            success = true;
        });

        return success;
    }

    async setUser(userId: string, email: string, role: string): Promise<void> {
        const authStore: AuthState = {
            isAuth: true,
            user: { role, email, userId }
        };
        this.store.dispatch(new AddAuth(authStore));
        const getIdTokenResult = await auth().currentUser.getIdTokenResult();
        localStorage.setItem('deputies-app', getIdTokenResult.token);
    }

    async signUp(data: CreateUser): Promise<boolean> {
        let success: boolean = false;
        const {email, password, name}: CreateUser = data;
        await this.authFire.createUserWithEmailAndPassword(email, password).then(async result => {
            await this.db.collection('users').doc(result.user.uid).set({
                name,
                email,
                role: 'user'
            });
            await this.setUser(result.user.uid, email, 'user');
            this.router.navigate(['/']);
        }).catch(err => {
            success = true;
        });

        return success;
    }

    async ResetPassword(): Promise<string> {
        let message: string = 'Check your email';

        const email: string = await this.getAuthUser();
        await this.authFire.sendPasswordResetEmail(email).catch(err => message = err.message);

        return message;
    }

    async getAuthUser(): Promise<string> {
        let email: string;

        await this.authFire.onAuthStateChanged(user => {
            email = user.email;
        });

        return email;
    }
}
