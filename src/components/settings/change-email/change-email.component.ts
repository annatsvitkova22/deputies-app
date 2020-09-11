import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SettingsService } from '../settings.service';
import { NgbdModalContent } from '../../modal/modal.component';

@Component({
    selector: 'app-change-email',
    templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {
    isError: boolean;
    message: string;

    constructor(
        private settingsService: SettingsService,
        private modalService: NgbModal,
    ){}

    onSubmit = async (data) => {
        const result: boolean = await this.settingsService.updateEmail(data.email);
        if (!result) {
            this.isError = !result;
            this.message = 'Помилка! Перевiрьте пошту, можливо строрiнка з таким email вже iснує';
        } else {
            const modalRef: NgbModalRef = this.modalService.open(NgbdModalContent, {
                size: 'lg'
            });
            modalRef.componentInstance.name = 'Ваш email успiшно змiнено';
            modalRef.componentInstance.message = 'Вам прийшло повiдомлення на пошту';
        }
    }
}
