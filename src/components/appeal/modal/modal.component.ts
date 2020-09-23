import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AppealCard, UserAvatal, Comment, ResultComment, AuthUser } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { AppealService } from '../appeal.service';

@Component({
    selector: 'app-modal-appeal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    @Input() appeal: AppealCard;
    @Input() statusColor: string;
    @ViewChild('txtInput') txtInput: ElementRef;
    comments: Comment[] = [];
    userAvatal: UserAvatal;
    isWriteComment: boolean;
    isDeputy: boolean;
    textButton: string;
    isLoader: boolean = true;
    comment: string;
    isHidden: boolean = true;
    isButton: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router,
        private authService: AuthService,
        private appealService: AppealService
    ) {}

    async ngOnInit(): Promise<void> {
        this.userAvatal = await this.authService.getUserImage();
        const userId = await this.authService.getUserId();
        this.comments = await this.appealService.getCommentsById(this.appeal.id);
        if (this.appeal.userId === userId) {
            this.isWriteComment = true;
        } else if (this.appeal.deputyId === userId) {
            this.isWriteComment = true;
            const isConfirm = await this.appealService.getConfirmMessage(this.appeal.id);
            this.isButton = !isConfirm;
            this.isDeputy = true;
        } else {
            this.isWriteComment = false;
        }
        this.onTextButton(this.appeal.status);
        this.isLoader = false;
    }

    onTextButton(status: string): void {
        if (status === 'До виконання') {
            this.textButton = 'Перейти до виконання';
        } else if (status === 'В роботі') {
            this.textButton = 'Підтвердити';
        }
    }

    onClose(): void {
        this.activeModal.dismiss('Cross click');
    }

    onHidden(): void {
        this.isHidden = !this.isHidden;
    }

    onComplain (id: string) {
        console.log('1111', id)
    }

    async onWork(id: string, status: string): Promise<void> {
        const newStatus = status === 'До виконання' ? 'В роботі' : 'Виконано';
        if (newStatus === 'Виконано') {
            this.router.navigate(['/confirm-appeal', this.appeal.id]);
            this.activeModal.dismiss('Cross click');
        } else {
            const result = await this.appealService.updateAppeals(id, newStatus);
            if (result) {
                this.appeal.status = newStatus;
                this.onTextButton(newStatus);
                this.statusColor = '';
            }
        }
    }

    async sendComment(): Promise<void> {
        this.txtInput.nativeElement.blur();
        const user: AuthUser = await this.authService.getUserById();
        const isBackground: boolean = this.appeal.userId === user.userId ? true : false;
        const comment: Comment = {
            message: this.comment,
            isBackground
        };
        this.comment = null;
        const newComment: ResultComment = await this.appealService.createComment(comment, this.appeal.id);
        if (newComment.status) {
            const commentModal: Comment = {
                message: newComment.comment.message,
                date: moment(newComment.comment.date).format('DD-MM-YYYY'),
                appealId: newComment.comment.appealId,
                userId: newComment.comment.userId,
                autorName: user.name,
                imageUrl: user.imageUrl,
                shortName: user.shortName,
                isBackground
            };
            this.comments = [commentModal, ...this.comments];
        }
    }
}
