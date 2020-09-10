import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SettingsService } from '../settings.service';
import { NgbdModalContent } from '../../modal/modal.component';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
    isError: boolean;
    message: string;

    constructor(
        private settingsService: SettingsService,
        private modalService: NgbModal,
    ){}

    onSubmit = async (data) => {
        if (data.repeatPassword === data.password) {
            const result = await this.settingsService.updatePassword(data.password, data.oldPassword);

            if (!result.status) {
                this.isError = !result.status;
                this.message = result.message;
            } else {
                const modalRef = this.modalService.open(NgbdModalContent, {
                    size: 'lg'
                });
                modalRef.componentInstance.name = 'Ваш пароль успiшно змiнено';
            }
        } else {
            this.isError = true;
            this.message = 'Пароли не совпадают';
        }
    }
}
