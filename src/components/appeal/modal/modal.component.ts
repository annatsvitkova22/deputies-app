import { Component, Input, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Slick } from 'ngx-slickjs';
import { MapsAPILoader } from '@agm/core';


import { AppealCard, UserAvatal, Comment, ResultComment, AuthUser } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { AppealService } from '../appeal.service';
import { FBCommentsComponent, FacebookService } from 'ngx-facebook';

@Component({
    selector: 'app-modal-appeal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() appeal: AppealCard;
    @Input() statusColor: string;
    @ViewChild('txtInput') txtInput: ElementRef;
    @ViewChild('map') mapElementRef: ElementRef;
    @ViewChild('smallMap') smallMapElementRef: ElementRef;
    @ViewChild(FBCommentsComponent) fbComments: FBCommentsComponent;
    map: google.maps.Map;
    smallMap: google.maps.Map;
    comments: Comment[] = [];
    userAvatal: UserAvatal;
    isWriteComment: boolean;
    isDeputy: boolean;
    textButton: string;
    isLoader: boolean = true;
    comment: string;
    isHidden: boolean = true;
    isButton: boolean;
    isBlockAppeal: boolean = false;
    isLoaderBlock: boolean = false;
    config: Slick.Config = {
        infinite: true,
        slidesToShow: 1,
        swipeToSlide: true,
        arrows: false,
        variableWidth: true,
        slidesToScroll: 1,
        dots: false,
        autoplaySpeed: 500 ,
    };
    url: string;
    constructor(
        public activeModal: NgbActiveModal,
        private router: Router,
        private authService: AuthService,
        private appealService: AppealService,
        config: NgbRatingConfig,
        private mapsAPILoader: MapsAPILoader,
        private fb: FacebookService
    ) {
        config.max = 5;
        config.readonly = true;
    }

    async ngOnInit(): Promise<void> {
        this.url = 'http://localhost:4200/?id=dz1Ia7jys6XUpT1fDtLS';
        this.userAvatal = await this.authService.getUserImage();
        const userId = await this.authService.getUserId();
        this.comments = await this.appealService.getCommentsById(this.appeal.id);
        if (this.appeal.userId === userId) {
            this.isWriteComment = true;
            if (this.appeal.status === 'Виконано') {
                const isFeedback = await this.appealService.getFeedbackMessage(this.appeal.id);
                if (!isFeedback) {
                    this.activeModal.dismiss('Cross click');
                    this.router.navigate(['/feedback', this.appeal.id]);
                }
            }
        } else if (this.appeal.deputyId === userId) {
            this.isWriteComment = true;
            const isConfirm = await this.appealService.getConfirmMessage(this.appeal.id);
            this.isButton = !isConfirm;
            this.isDeputy = true;
        } else {
            this.isWriteComment = false;
        }
        this.onTextButton(this.appeal.status);
        this.loadMap();
        this.isLoader = false;
    }

    loadMap(): void {
        if (this.appeal.location) {
            this.mapsAPILoader.load().then(() => {
                this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
                    center: this.appeal.location,
                    zoom: 15,
                    disableDefaultUI: true
                });
                // tslint:disable-next-line: no-unused-expression
                new google.maps.Marker({
                    position: this.appeal.location,
                    map: this.map,
                });
                this.smallMap = new google.maps.Map(this.smallMapElementRef.nativeElement, {
                    center: this.appeal.location,
                    zoom: 15,
                    disableDefaultUI: true
                });
                // tslint:disable-next-line: no-unused-expression
                new google.maps.Marker({
                    position: this.appeal.location,
                    map: this.smallMap,
                });
            });
        }
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

    ngOnDestroy(): void {
        this.router.navigate([], {
            queryParams: {
                id: null
            },
            queryParamsHandling: 'merge',
        });
    }

    onHidden(): void {
        this.isHidden = !this.isHidden;
    }

    async onComplain(id: string): Promise<void> {
        this.isLoaderBlock = true;
        this.isBlockAppeal = await this.appealService.blockAppeal(id);
        if (this.isBlockAppeal) {
            this.isLoaderBlock = false;
            window.alert('Ваша скарга в обробці');
        } else {
            this.isLoaderBlock = false;
            window.alert('Виникла помилка, спробуйте ще раз.');
        }
    }

    async onWork(id: string, status: string): Promise<void> {
        const newStatus = status === 'До виконання' ? 'В роботі' : 'Виконано';
        if (newStatus === 'Виконано') {
            await this.router.navigate(['/confirm-appeal', this.appeal.id]);
            this.activeModal.dismiss('Cross click');
        } else {
            const result = await this.appealService.updateAppeals(id, newStatus, this.appeal.id, this.appeal.deputyId);
            if (result) {
                this.appeal.status = newStatus;
                this.onTextButton(newStatus);
                this.statusColor = '';
                const commentModal = {
                    date: moment().format('DD-MM-YYYY hh:mm'),
                    appealId: this.appeal.id,
                    imageUrl: this.userAvatal.imageUrl,
                    shortName: this.userAvatal.shortName,
                    type: 'inProgress',
                    isBackground: false
                }
                this.comments = [commentModal, ...this.comments];
            }
        }
    }

    async sendComment(): Promise<void> {
        if (this.comment) {
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
                    date: moment(newComment.comment.date).format('DD-MM-YYYY hh:mm'),
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
}
