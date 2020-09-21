import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, District, Settings } from '../../models';
import { MainService } from './main.service';
import { AppealService } from '../../components/appeal/appeal.service';
import { Store } from '@ngrx/store';
import { MainState } from '../../store/main.state';
import { EditSettings } from '../../store/settings.action';

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
    model: NgbDateStruct;
    form = new FormGroup({
        sort: new FormControl(null),
        date: new FormControl(null)
    });
    sorting = [
        {name: 'За рейтингом', id: '1'},
        {name: 'За к-стю запитів', id: '2'},
        {name: 'За к-стю виконаних ', id: '3'}
    ];

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private appealService: AppealService,
        private store: Store<MainState>,
    ){}

    async ngOnInit(): Promise<void> {
        this.settings = await this.mainService.getSettings();
        this.districts = await this.appealService.getDistricts();
        this.deputies = await this.deputyService.getAllDeputy(this.settings);
        this.appeals = await this.mainService.getAppeal(this.settings);
        this.isLoader = false;
    }

    async onSaveSorting(): Promise<void> {
        const sort = this.form.value.sort;
        const settingsStore = await this.mainService.getSettings();
        const settings: Settings = {
            sorting: sort.id,
            districts: settingsStore.districts,
            statuses: settingsStore.statuses,
            date: settingsStore.date
        };
        this.store.dispatch(new EditSettings(settings));
        this.deputies = await this.deputyService.getAllDeputy(settings);
    }

    async onSaveDate(): Promise<void> {
        let date = this.form.value.date;
        date = date.year + '-' + date.month + '-' + date.day + 'T00:00:00';
        date = moment(date, 'YYYY-MM-DDTHH:mm:ss').utc().valueOf();
        const settingsStore = await this.mainService.getSettings();
        const settings: Settings = {
            sorting: settingsStore.sorting,
            districts: settingsStore.districts,
            statuses: settingsStore.statuses,
            date
        };
        this.store.dispatch(new EditSettings(settings));
        this.appeals = await this.mainService.getAppeal(settings);
    }

    async changeAppeals(settings: Settings): Promise<void> {
        this.appeals = await this.mainService.getAppeal(settings);
    }
}
