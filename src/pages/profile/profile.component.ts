import { Component, OnInit } from '@angular/core';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, UserAvatal, CountAppeals, AuthUser } from '../../models';
import { AuthService } from '../../components/auth/auth.service';

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

    constructor(
        private deputyService: DeputyService,
        private authService: AuthService
    ){}

    async ngOnInit(): Promise<void> {
        this.type = null;
        this.count = 3;
        this.user = await this.authService.getUserById();
        if (this.user.role === 'deputy') {
            this.deputy = await this.deputyService.getDeputy(this.user.userId);
            this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy, this.count);
            this.countAppeals = await this.deputyService.getCountAppeal(this.user.userId, 'deputyId');
        } else {
            this.userAvatar = await this.authService.getUserImage();
            this.appeals = await this.deputyService.getAppealByUser(this.user.userId, this.userAvatar, this.user.name, this.count);
            this.countAppeals = await this.deputyService.getCountAppeal(this.user.userId, 'userId');
        }
        this.isLoader = false;
    }

    onRead(): void {
        this.isMoreText = !this.isMoreText;
    }

    async onScroll(): Promise<void> {
        this.isLoaderAppeal = true;
        this.count = this.count + 3;
        if (this.user.role === 'deputy') {
            this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy, this.count, this.type);
        } else {
            this.appeals = await this.deputyService.getAppealByUser(this.user.userId, this.userAvatar,
                this.user.name, this.count, this.type);
        }
        this.isLoaderAppeal = false;
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
