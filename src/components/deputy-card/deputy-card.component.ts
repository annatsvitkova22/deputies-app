import { Component, Input } from '@angular/core';

import { Deputy } from '../../models';


@Component({
    selector: 'app-deputy-card',
    templateUrl: './deputy-card.component.html',
    styleUrls: ['./deputy-card.component.scss']
})
export class DeputyCardComponent{
    @Input () deputy: Deputy;

    constructor(){}
}
