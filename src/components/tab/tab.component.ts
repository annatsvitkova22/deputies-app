import { Component, Input, OnInit } from '@angular/core';
import { AppealCard } from '../../models';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
    @Input() appeals: AppealCard[];
    allAppeals: AppealCard[];
    type: string;
    tabs = ['Усi', 'До виконання', 'В Роботі', 'Виконано'];

    constructor(){}

    ngOnInit(): void {
        this.allAppeals = this.appeals;
        this.type = 'Усi';
    }

    handlerFilter(type: string): void {
        this.type = type;
        if (type === 'Усi') {
            this.appeals = this.allAppeals;
        } else {
            this.appeals = this.allAppeals.filter(appeal => appeal.status === type);
        }
    }
}
