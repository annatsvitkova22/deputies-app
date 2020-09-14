import { Component, Input } from '@angular/core';
import { AppealCard } from '../../../models';

@Component({
    selector: 'app-appeal-card',
    templateUrl: './appeal-card.component.html',
    styleUrls: ['./appeal-card.component.scss']
})
export class AppealCardComponent {
    @Input () appeal: AppealCard;
    constructor(){}

}
