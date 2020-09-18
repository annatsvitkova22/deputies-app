import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeputyService } from './deputy.service';
import { AppealCard, CountAppeals, UserAccount } from '../../models';

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

    constructor(
        private route: ActivatedRoute,
        private deputyService: DeputyService
    ){}

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.deputyId = params['id'];
        });

        this.deputy = await this.deputyService.getDeputy(this.deputyId);
        this.appeals = await this.deputyService.getAppeal(this.deputyId, this.deputy);
        this.countAppeals = await this.deputyService.getCountAppeal(this.appeals);
        this.isLoader = false;
    }
}
