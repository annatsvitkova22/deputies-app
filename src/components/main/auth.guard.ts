import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private auth: AngularFireAuth,
    ) {}

    async canActivate(): Promise<boolean> {
        await this.auth.authState.subscribe(res => {
            if (res && res.uid) {
                return true;
            } else {
                this.router.navigate(['/login']);

                return false;
            }
        });

        return false;
    }
}
