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
                this.router.navigate(['/settings']);
            });
        }).catch(err => {
            success = true;
        });

        return success;
    }

    async setUser(userId: string, email: string, role: string, token = null): Promise<void> {
        const authStore: AuthState = {
            isAuth: true,
            user: { role, email, userId }
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
        const {email, password, name}: CreateUser = data;
        await this.authFire.createUserWithEmailAndPassword(email, password).then(async result => {
            await this.writeUserToCollection(result.user.uid, name, email);
            result.user.sendEmailVerification();
            this.router.navigate(['/']);
        }).catch(err => {
            success = true;
        });

        return success;
    }

    async resetPassword(email: string): Promise<string> {
        let message: string = 'Check your email';

        await this.authFire.sendPasswordResetEmail(email).catch(err => message = err.message);

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
        this.singInBySocial(provider);
    }

    async facebookSingIn(): Promise<void> {
        const provider = new auth.FacebookAuthProvider();
        this.singInBySocial(provider);
    }

    async singInBySocial(provider): Promise<void> {
        const credential = await this.authFire.signInWithPopup(provider);

        const { uid, email, displayName} = credential.user;
        if (credential.additionalUserInfo.isNewUser) {
            await this.writeUserToCollection(uid, displayName, email);
        }
        await this.setUser(uid, email, 'user');
    }

    async writeUserToCollection(userId: string, name: string, email: string): Promise<boolean> {
        try {
            await this.db.collection('users').doc(userId).set({
                name,
                email,
                role: 'user'
            });
        } catch (error) {
            return error;
        }

        return true;
    }

    async getUserId(): Promise<string>  {
        let userId: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userId = data.user.userId);

        return userId;
    }

    async getUserEmail(): Promise<string>  {
        let userEmail: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userEmail = data.user.email);

        return userEmail;
    }

    async getUserRole(): Promise<string>  {
        let userRole: string;
        this.store.select('authStore').subscribe((data: AuthState) =>  userRole = data.user.role);

        return userRole;
    }
}
