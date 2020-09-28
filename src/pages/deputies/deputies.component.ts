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
import { iif } from 'rxjs';


@Component({
    selector: 'app-deputies',
    templateUrl: './deputies.component.html',
})
export class DeputiesComponent implements OnInit {
    deputies: Deputy[];
    parties: Party[];
    districts: District[];
    isLoader: boolean = true;
    isLoaderDeputy: boolean;
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
    count: number;
    selectDistricts: District[] = [];
    selectParties: Party[] = [];

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private store: Store<MainState>,
        private appealService: AppealService,
        private authService: AuthService,
    ){}

    async ngOnInit(): Promise<void> {
        this.count = 5;
        this.settings = await this.mainService.getSettings();
        this.selectedFilters();
        const sortValue = Number(this.settings.sorting);
        this.form.controls['sort'].patchValue(this.sorting[sortValue - 1]);
        this.deputies = await this.deputyService.getAllDeputy(this.settings, this.count, 'deputies');
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

    selectedFilters(): void {
        if (this.settings.districts && this.settings.districts.length) {
            this.settings.districts.map(district => {
                this.selectDistricts.push(district);
            });
        }
        if (this.settings.parties && this.settings.parties.length) {
            this.settings.parties.map(party => {
                this.selectParties.push(party);
            });
        }
    }

    async onSaveSorting(): Promise<void> {
        const sort = this.form.value.sort;
        if (sort) {
            const settings: Settings = {
                sorting: sort.id
            };
            this.store.dispatch(new EditSettings(settings));
            const settingsStore = await this.mainService.getSettings();
            this.deputies = await this.deputyService.getAllDeputy(settingsStore, this.count, 'deputies');
        }
    }

    async changeAppeals(settings: Settings): Promise<void> {
        this.isLoaderDeputy = true;
        this.deputies = null;
        this.count = 5;
        this.deputies = await this.deputyService.getAllDeputy(settings, this.count, 'deputies');
        this.isLoaderDeputy = false;
    }

    async onScroll(): Promise<void> {
        this.isLoaderDeputy = true;
        this.count = this.count + 3;
        const settings = await this.mainService.getSettings();
        this.deputies = await this.deputyService.getAllDeputy(settings, this.count, 'deputies');
        this.isLoaderDeputy = false;
    }
}
