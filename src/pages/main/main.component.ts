import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, District, Settings } from '../../models';
import { MainService } from './main.service';
import { AppealService } from '../../components/appeal/appeal.service';
import { Store } from '@ngrx/store';
import { MainState } from '../../store/main.state';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    deputies: Deputy[];
    appeals: AppealCard[];
    districts: District[];
    settings: Settings;
    isLoader: boolean = true;

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private appealService: AppealService,
        private store: Store<MainState>,
    ){}

    async ngOnInit(): Promise<void> {
        this.settings = await this.mainService.getSettings();
        console.log('this.settings', this.settings)
        this.districts = await this.appealService.getDistricts();
        this.deputies = await this.deputyService.getAllDeputy();
        this.appeals = await this.mainService.getAppeal(this.settings);
        this.isLoader = false;
    }
}
