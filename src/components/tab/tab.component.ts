import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AppealCard } from '../../models';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
    @Input() appeals: AppealCard[];
    @Output() selectType = new EventEmitter<string>();
    type: string;
    allAppeals: AppealCard[];
    tabs = ['Усi', 'До виконання', 'В роботі', 'Виконано'];

    constructor(){}

    ngOnInit(): void {
        this.allAppeals = this.appeals;
        this.type = 'Усi';
    }

    handlerFilter(type: string): void {
        this.type = type;
        this.selectType.emit(type);
        // this.type = type;
        // if (type === 'Усi') {
        //     this.appeals = this.allAppeals;
        // } else {
        //     this.selectType.emit(type);
        //     // this.appeals = this.allAppeals.filter(appeal => appeal.status === type);
        // }
    }
}
