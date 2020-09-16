import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, District } from '../../models';
import { MainService } from './main.service';
import { AppealService } from '../../components/appeal/appeal.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    deputies: Deputy[];
    appeals: AppealCard[];
    districts: District[];
    settings = {
        date: moment({h: 0, m: 0, s: 0, ms: 0}).valueOf()
    };
    isLoader: boolean = true;

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private appealService: AppealService,
    ){}

    async ngOnInit(): Promise<void> {
        this.districts = await this.appealService.getDistricts();
        this.deputies = await this.deputyService.getAllDeputy();
        this.appeals = await this.mainService.getAppeal(this.settings);
        this.isLoader = false;
    }
}
