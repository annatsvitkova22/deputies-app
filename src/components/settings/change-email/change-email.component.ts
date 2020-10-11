import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-change-email',
    templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {
    isError: boolean;
    message: string;
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    constructor(
        private settingsService: SettingsService,
    ){}

    onSubmit = async (email: string): Promise<boolean> => {
        const result: boolean = await this.settingsService.updateEmail(email);
        if (!result) {
            this.isError = !result;
            this.message = 'Помилка! Перевiрьте пошту, можливо строрiнка з таким email вже iснує';
        }

        return result;
    }

    getForm(): string {
        return this.form.value.email;
    }
}
