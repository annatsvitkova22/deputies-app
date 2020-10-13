import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-sing-up',
    templateUrl: './sing-up.component.html',
    styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent {
    isError: boolean;
    message: string;

    constructor(
        private authService: AuthService,
    ){}

    onSubmit = async (data) => {
        if (data.repeatPassword === data.password) {
            const isError: boolean = await this.authService.signUp(data);
            if (isError) {
                window.alert('Користувач з таким email вже існує');
            }
        } else {
            window.alert('Паролі не співпадають');
        }
    }

    onGoogleLogin = async () => {
        await this.authService.googleSingIn();
    }

    onFacebookLogin = async () => {
        await this.authService.facebookSingIn();
    }
}
