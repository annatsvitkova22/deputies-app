import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeputyService } from './deputy.service';
import { Deputy, AppealCard } from '../../models';

@Component({
    selector: 'app-deputy',
    templateUrl: './deputy.component.html',
    styleUrls: ['./deputy.component.scss']
})
export class DeputyComponent implements OnInit {
    deputyId: string;
    deputy: Deputy;
    shortName: string;
    appeals: AppealCard[];
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;

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
        console.log('this.deputy', this.deputy);
        console.log('this.appeals', this.appeals);
        this.isLoader = false;
    }

}
