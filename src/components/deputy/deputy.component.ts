import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeputyService } from './deputy.service';
import { AppealCard, CountAppeals, UserAccount } from '../../models';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-deputy',
    templateUrl: './deputy.component.html',
    styleUrls: ['./deputy.component.scss']
})
export class DeputyComponent implements OnInit {
    deputyId: string;
    deputy: UserAccount;
    shortName: string;
    appeals: AppealCard[];
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    countAppeals: CountAppeals[] = [];
    isButton: boolean;

    constructor(
        private route: ActivatedRoute,
        private deputyService: DeputyService,
        private authService: AuthService
    ){}

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.deputyId = params['id'];
        });

        this.deputy = await this.deputyService.getDeputy(this.deputyId);
        this.appeals = await this.deputyService.getAppeal(this.deputyId, this.deputy);
        this.countAppeals = await this.deputyService.getCountAppeal(this.appeals);
        const userRole: string = await this.authService.getUserRole();
        if (userRole === 'deputy') {
            this.isButton = false;
        } else {
            this.isButton = true;
        }
        this.isLoader = false;
    }
}
