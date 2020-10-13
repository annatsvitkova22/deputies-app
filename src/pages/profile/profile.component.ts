import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meta, Title } from '@angular/platform-browser';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, UserAvatal, CountAppeals, AuthUser } from '../../models';
import { AuthService } from '../../components/auth/auth.service';
import { MainService } from '../main/main.service';
import { ModalComponent } from '../../components/appeal/modal/modal.component';

@Component({
    selector: 'app-main',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    deputies: Deputy[];
    appeals: AppealCard[];
    isLoader: boolean = true;
    isLoaderAppeal: boolean;
    user: AuthUser;
    countAppeals: CountAppeals[] = [];
    deputy: Deputy;
    isMoreText: boolean;
    count: number;
    userAvatar: UserAvatal;
    type: string;
    queryParams: string;
    counter: number;

    constructor(
        private deputyService: DeputyService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private mainService: MainService,
        private modalService: NgbModal,
        private meta: Meta,
        private title: Title
    ){}

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params['id'];
        });
        if (this.queryParams) {
            this.openModal();
        }
        this.type = null;
        this.counter = 0;
        this.count = 5;
        this.user = await this.authService.getUserById();
        if (this.user.role === 'deputy') {
            this.deputy = await this.deputyService.getDeputy(this.user.userId);
            this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy, this.count);
            this.countAppeals = await this.deputyService.getCountAppeal(this.user.userId, 'deputyId');
            this.title.setTitle('СЛУГА ПОЛТАВИ | ' + this.deputy.name + ' ' + this.deputy.patronymic);
            this.meta.updateTag({ name: 'og:url', content: this.deputy.imageUrl ? this.deputy.imageUrl : ''});
            this.meta.updateTag({ name: 'description', content: '“Партія «' +  this.deputy.party + '»'});
        } else {
            this.userAvatar = await this.authService.getUserImage();
            this.appeals = await this.deputyService.getAppealByUser(this.user.userId, this.userAvatar, this.user.name, this.count);
            this.countAppeals = await this.deputyService.getCountAppeal(this.user.userId, 'userId');
        }
        this.isLoader = false;
    }

    async openModal(): Promise<void> {
        const appeal = await this.mainService.getAppealById(this.queryParams);
        const modalRef: NgbModalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.appeal = appeal;
        let statusColor: string;
        if (appeal.status === 'До виконання') {
            statusColor = 'card__status--yellow';
        } else if (appeal.status === 'Виконано') {
            statusColor = 'card__status--green';
        }
        modalRef.componentInstance.statusColor = statusColor;
    }

    onRead(): void {
        this.isMoreText = !this.isMoreText;
    }

    async onScroll(): Promise<void> {
        if (!this.counter) {
            this.counter++;
            let count: number = 0;
            if (this.user.role === 'deputy') {
                count = await this.deputyService.getCountAllAppeals(this.user.userId, this.type);
            } else {
                count = await this.deputyService.getCountAppealByUser(this.user.userId, this.type);
            }
            if (this.appeals && this.appeals.length === count) {
                this.counter = 0;
            } else {
                this.isLoaderAppeal = true;
                this.count = this.count + 5;
                if (this.user.role === 'deputy') {
                    this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy, this.count, this.type);
                } else {
                    this.appeals = await this.deputyService.getAppealByUser(this.user.userId, this.userAvatar,
                        this.user.name, this.count, this.type);
                }
                this.isLoaderAppeal = false;
                this.counter = 0;
            }
        }
    }

    async onFilter(type): Promise<void> {
        this.isLoaderAppeal = true;
        this.appeals = [];
        this.count = 3;
        const thisType = type === 'Усi' ? null : type;
        this.type = thisType;
        if (this.user.role === 'deputy') {
            this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy, this.count, thisType);
        } else {
            this.appeals = await this.deputyService.getAppealByUser(this.user.userId, this.userAvatar,
                this.user.name, this.count, thisType);
        }
        this.isLoaderAppeal = false;
    }
}
