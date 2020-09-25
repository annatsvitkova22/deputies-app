import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ChangeInfoComponent } from '../../components/settings/change-info/change-info.component';
import { ChangeEmailComponent } from '../../components/settings/change-email/change-email.component';
import { ChangePasswordComponent } from '../../components/settings/change-password/change-password.component';
import { UserAvatarForm, ChangePassword, ResultModel } from '../../models';
import { NgbdModalContent } from '../../components/modal/modal.component';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    @ViewChild('infoChild') infoChild: ChangeInfoComponent;
    @ViewChild('emailChild') emailChild: ChangeEmailComponent;
    @ViewChild('passwordChild') passwordChild: ChangePasswordComponent;

    constructor(
        private modalService: NgbModal,
    ){}

    async ngOnInit(): Promise<void> {
        this.isLoader = false;
    }

    async onSave(): Promise<void> {
        const mainInfo: UserAvatarForm = this.infoChild.getForm();
        const email: string = this.emailChild.getForm();
        const passwords: ChangePassword = this.passwordChild.getForm();
        const {oldPassword, password, repeatPassword}: ChangePassword = passwords;
        // tslint:disable-next-line: no-inferrable-types
        let isError: boolean = false;
        let isChangePas: boolean = false;
        let isEmailPas: boolean = false;
        if (email) {
            // tslint:disable-next-line: no-shadowed-variable
            const changeInfoResult: boolean = await this.emailChild.onSubmit(email);
            if (changeInfoResult) {
                isEmailPas = true;
            } else {
                isError = true;
            }
        }
        if (oldPassword && password && repeatPassword) {
            if (!isError) {
                const changePasswordResult: ResultModel = await this.passwordChild.onSubmit(passwords);
                if (changePasswordResult.status) {
                    isChangePas = true;
                } else {
                    isError = true;
                }
            }
        }
        if (!isError) {
            const changeInfoResult: ResultModel = await this.infoChild.onSubmit(mainInfo);
            if (isEmailPas && changeInfoResult.status) {
                const modalRef: NgbModalRef = this.modalService.open(NgbdModalContent);
                modalRef.componentInstance.name = 'Вашу сторiнку успiшно оновлено';
                modalRef.componentInstance.message = 'Вам вiдправлено повiдомлення на пошту';
            } else if (changeInfoResult.status) {
                const modalRef: NgbModalRef = this.modalService.open(NgbdModalContent);
                modalRef.componentInstance.name = changeInfoResult.message;
            } else {
                const modalRef: NgbModalRef = this.modalService.open(NgbdModalContent);
                modalRef.componentInstance.name = 'Помилка оновлення, спробуйте ще раз.';
            }
        }
    }
}
