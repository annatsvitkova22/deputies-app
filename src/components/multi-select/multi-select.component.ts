import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Select, Settings } from '../../models';
import { EditSettings } from '../../store/settings.action';
import { MainState } from '../../store/main.state';
import { MainService } from '../../pages/main/main.service';

@Component({
    selector: 'app-multi',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

    @Input() dropdownList: Select[];
    @Input() type: string;
    @Input() selectedItems: Select[];
    @Input() text: string;
    dropdownSettings = {};
    @Output() changes = new EventEmitter<Settings>();
    // tslint:disable-next-line: no-inferrable-types
    isDrop: boolean = false;
    buttonText: string;
    counter: number;

    constructor(
        private store: Store<MainState>,
        private mainService: MainService
    ) { }

    ngOnInit(): void {
        this.counter = 0;
        this.buttonText = 'Очистити';
        if (this.type === 'statuses') {
            this.dropdownList = [
                {id: 'До виконання', name: 'До виконання'},
                {id: 'В Роботі', name: 'В Роботі'},
                {id: 'Виконано', name: 'Виконано'},
            ];
        }
        this.dropdownSettings = {
            singleSelection: false,
            text: this.text,
            enableCheckAll: false,
            enableSearchFilter: false,
            labelKey: 'name',
            classes: 'multi-select',
            badgeShowLimit: 1
        };
    }

    handlerOpen(): void {
        this.isDrop = true;
    }

    handlerClose(): void {
        this.isDrop = false;
    }

    onItemSelect(item: any): void {
        this.counter++;
        this.buttonText = 'Очистити(' + this.counter + ')';
    }
    OnItemDeSelect(item: any): void {
        this.counter--;
        if (this.selectedItems.length) {
            this.buttonText = 'Очистити(' + this.counter + ')';
        } else {
            this.buttonText = 'Очистити';
        }
    }

    async resetForm(f: NgForm): Promise<void> {
        f.reset();
        this.buttonText = 'Очистити';
        this.counter = 0;
        this.dispatchToStore();
    }

    async dispatchToStore(): Promise<void> {
        let settings: Settings;
        const settingsStore = await this.mainService.getSettings();
        if (this.type === 'districts') {
            const districts: Select[] = []
            this.selectedItems.map(item => {
                districts.push(item);
            });
            settings = {
                sorting: settingsStore.sorting,
                districts,
                statuses: settingsStore.statuses,
                date: settingsStore.date
            };
        } else if (this.type === 'statuses') {
            const statuses: Select[] = [];
            if (this.selectedItems) {
                this.selectedItems.map(item => {
                    statuses.push(item);
                });
            }
            settings = {
                sorting: settingsStore.sorting,
                districts: settingsStore.districts,
                statuses: statuses.length ? statuses : null,
                date: settingsStore.date
            };
        }
        this.changes.emit(settings);
        this.store.dispatch(new EditSettings(settings));
    }

    saveOptions(): void {
        this.dispatchToStore();
    }
}
