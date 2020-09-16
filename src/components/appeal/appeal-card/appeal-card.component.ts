import { Component, Input, OnInit } from '@angular/core';
import { AppealCard } from '../../../models';

@Component({
    selector: 'app-appeal-card',
    templateUrl: './appeal-card.component.html',
    styleUrls: ['./appeal-card.component.scss']
})
export class AppealCardComponent implements OnInit {
    @Input () appeal: AppealCard;
    statusColor: string;
    constructor(){}

    ngOnInit(): void {
        if (this.appeal.status === 'До виконання') {
            this.statusColor = 'card__status--yellow';
        } else if (this.appeal.status === 'Виконано') {
            this.statusColor = 'card__status--green';
        }
    }
}
