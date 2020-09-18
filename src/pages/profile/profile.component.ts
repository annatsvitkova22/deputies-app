import { Component, OnInit } from '@angular/core';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, UserAvatal, CountAppeals, AuthUser } from '../../models';
import { MainService } from '../main/main.service';
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
    user: AuthUser;
    countAppeals: CountAppeals[] = [];
    deputy: Deputy;

    constructor(
        private deputyService: DeputyService,
        private authService: AuthService
    ){}

    async ngOnInit(): Promise<void> {
        this.user = await this.authService.getUserById();
        if (this.user.role === 'deputy') {
            this.deputy = await this.deputyService.getDeputy(this.user.userId);
            this.appeals = await this.deputyService.getAppeal(this.user.userId, this.deputy);
            this.user = null;
        } else {
            const userAvatar: UserAvatal = await this.authService.getUserImage();
            this.appeals = await this.deputyService.getAppealByUser(this.user.userId, userAvatar, this.user.name);
        }
        this.countAppeals = await this.deputyService.getCountAppeal(this.appeals);
        this.isLoader = false;
    }
}
