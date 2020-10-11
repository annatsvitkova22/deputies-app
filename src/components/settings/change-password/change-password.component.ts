import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SettingsService } from '../settings.service';
import { ResultModel, ChangePassword } from '../../../models';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
    isError: boolean;
    message: string;
    form = new FormGroup({
        oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private settingsService: SettingsService,
    ){}

    onSubmit = async (data): Promise<ResultModel> => {
        if (data.repeatPassword === data.password) {
            const result: ResultModel = await this.settingsService.updatePassword(data.password, data.oldPassword);

            if (!result.status) {
                this.isError = !result.status;
                this.message = result.message;
            }

            return result;
        } else {
            this.isError = true;
            this.message = 'Пароли не совпадают';
            const result: ResultModel = {
                status: false
            };

            return result;
        }
    }

    getForm(): ChangePassword {
        return this.form.value;
    }
}
