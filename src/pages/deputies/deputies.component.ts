import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Deputy, Settings, Party, District, Select } from '../../models';
import { DeputyService } from '../../components/deputy/deputy.service';
import { MainService } from '../main/main.service';
import { MainState } from '../../store/main.state';
import { EditSettings } from '../../store/settings.action';
import { AppealService } from '../../components/appeal/appeal.service';
import { AuthService } from '../../components/auth/auth.service';


@Component({
    selector: 'app-deputies',
    templateUrl: './deputies.component.html',
})
export class DeputiesComponent implements OnInit {
    deputies: Deputy[];
    parties: Party[];
    districts: District[];
    isLoader: boolean = true;
    settings: Settings;
    form = new FormGroup({
        sort: new FormControl(null)
    });
    sorting: Select[] = [
        {name: 'За рейтингом', id: '1'},
        {name: 'За к-стю запитів', id: '2'},
        {name: 'За к-стю виконаних ', id: '3'}
    ];
    isCreateAppeal: boolean;

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private store: Store<MainState>,
        private appealService: AppealService,
        private authService: AuthService,
    ){}

    async ngOnInit(): Promise<void> {
        this.settings = await this.mainService.getSettings();
        const sortValue = Number(this.settings.sorting);
        this.form.controls['sort'].patchValue(this.sorting[sortValue - 1]);
        this.deputies = await this.deputyService.getAllDeputy(this.settings, 'deputies');
        this.districts = await this.appealService.getDistricts();
        this.parties = await this.deputyService.getParties();
        const userRole: string = await this.authService.getUserRole();
        if (userRole === 'deputy') {
            this.isCreateAppeal = false;
        } else {
            this.isCreateAppeal = true;
        }
        this.isLoader = false;
    }

    async onSaveSorting(): Promise<void> {
        const sort = this.form.value.sort;
        if (sort) {
            const settings: Settings = {
                sorting: sort.id
            };
            this.store.dispatch(new EditSettings(settings));
            const settingsStore = await this.mainService.getSettings();
            this.deputies = await this.deputyService.getAllDeputy(settingsStore, 'deputies');
        }
    }

    async changeAppeals(settings: Settings): Promise<void> {
        this.deputies = await this.deputyService.getAllDeputy(settings, 'deputies');
    }
}
