import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { DeputyService } from '../../components/deputy/deputy.service';
import { Deputy, AppealCard, District, Settings, Select } from '../../models';
import { MainService } from './main.service';
import { AppealService } from '../../components/appeal/appeal.service';
import { MainState } from '../../store/main.state';
import { EditSettings } from '../../store/settings.action';
import { ModalComponent } from '../../components/appeal/modal/modal.component';

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
    isLoaderAppeal: boolean;
    model: NgbDateStruct;
    form = new FormGroup({
        sort: new FormControl(null),
        date: new FormControl(null)
    });
    date: string;
    sorting: Select[] = [
        {name: 'За рейтингом', id: '1'},
        {name: 'За к-стю запитів', id: '2'},
        {name: 'За к-стю виконаних ', id: '3'}
    ];
    count: number;
    deputyCount: number;
    queryParams: string;
    selectDistricts: District[] = [];
    selectedStatus: Select[] = [];
    counter: number;

    constructor(
        private deputyService: DeputyService,
        private mainService: MainService,
        private appealService: AppealService,
        private store: Store<MainState>,
        private route: ActivatedRoute,
        private modalService: NgbModal,
    ){}

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params['id'];
        });
        if (this.queryParams) {
            this.openModal();
        }
        this.count = 5;
        this.deputyCount = 10;
        this.counter = 0;
        this.settings = await this.mainService.getSettings();
        this.selectedFilters();
        this.districts = await this.appealService.getDistricts();
        const sortValue = Number(this.settings.sorting);
        this.form.controls['sort'].patchValue(this.sorting[sortValue - 1]);
        this.deputies = await this.deputyService.getAllDeputy(this.settings, this.deputyCount);
        this.appeals = await this.mainService.getAppeal(this.settings, this.count);
        this.isLoader = false;
    }

    selectedFilters(): void {
        if (this.settings.districts && this.settings.districts.length) {
            this.settings.districts.map(district => {
                this.selectDistricts.push(district);
            });
        }
        if (this.settings.statuses && this.settings.statuses.length) {
            this.settings.statuses.map(status => {
                this.selectedStatus.push(status);
            });
        }
    }

    async openModal(): Promise<void> {
        const appeal = await this.mainService.getAppealById(this.queryParams);
        const modalRef: NgbModalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.appeal = appeal;
        let statusColor: string;
        if (appeal.status === 'До виконання') {
            statusColor = 'card__status--yellow';
        } else if (appeal.status === 'Виконано') {
            statusColor = 'card__status--green';
        }
        modalRef.componentInstance.statusColor = statusColor;
    }

    async onScroll(): Promise<void> {
        if (!this.counter) {
            this.counter++;
            const settings: Settings = await this.mainService.getSettings();
            const countAppeal = await this.mainService.getCountgetAppeal(settings);
            if (this.appeals && this.appeals.length === countAppeal) {
                this.counter = 0;
            } else {
                this.isLoaderAppeal = true;
                this.count = this.count + 5;
                this.appeals = await this.mainService.getAppeal(settings, this.count);
                this.counter = 0;
                this.isLoaderAppeal = false;
            }
        }
    }

    async onDeputyScroll(): Promise<void> {
        if (!this.counter) {
            this.counter++;
            const countAllDeputy = await this.deputyService.getCountDeputy(this.settings);
            if (this.deputies && this.deputies.length === countAllDeputy) {
                this.counter = 0;
            } else {
                this.deputyCount = this.deputyCount + 5;
                this.deputies = await this.deputyService.getAllDeputy(this.settings, this.deputyCount);
                this.counter = 0;
            }
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
            this.deputies = await this.deputyService.getAllDeputy(settingsStore, this.deputyCount);
        }
    }

    async onSaveDate(): Promise<void> {
        this.isLoaderAppeal = true;
        this.appeals = null;
        let date = this.form.value.date;
        date = date.year + '-' + date.month + '-' + date.day + 'T00:00:00';
        date = moment(date, 'YYYY-MM-DDTHH:mm:ss').utc().valueOf();
        const settings: Settings = {
            date
        };
        this.store.dispatch(new EditSettings(settings));
        const setting = await this.mainService.getSettings();
        this.appeals = await this.mainService.getAppeal(setting, this.count);
        this.isLoaderAppeal = false;
    }

    async changeAppeals(settings: Settings): Promise<void> {
        this.isLoaderAppeal = true;
        this.appeals = null;
        this.count = 5;
        this.appeals = await this.mainService.getAppeal(settings, this.count);
        this.isLoaderAppeal = false;
    }
}
