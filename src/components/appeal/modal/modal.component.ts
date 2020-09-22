import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { AppealCard, UserAvatal } from '../../../models';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-modal-appeal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    @Input() appeal: AppealCard;
    @Input() statusColor: string;
    userAvatal: UserAvatal;
    isWriteComment: boolean;
    form = new FormGroup({
        comment: new FormControl(null)
    });

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router,
        private authService: AuthService
    ) {}

    async ngOnInit(): Promise<void> {
        console.log('this', this.appeal)
        this.userAvatal = await this.authService.getUserImage();
        const userId = await this.authService.getUserId();
        if (this.appeal.deputyId === userId || this.appeal.userId === userId) {
            this.isWriteComment = true;
        } else {
            this.isWriteComment = false;
        }
    }

    onClose(): void {
        this.activeModal.dismiss('Cross click');
    }
}
