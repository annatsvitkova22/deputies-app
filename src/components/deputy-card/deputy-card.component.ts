import { Component, Input, OnInit } from '@angular/core';

import { Deputy } from '../../models';


@Component({
    selector: 'app-deputy-card',
    templateUrl: './deputy-card.component.html',
    styleUrls: ['./deputy-card.component.scss']
})
export class DeputyCardComponent implements OnInit {
    @Input () deputy: Deputy;

    constructor(){}

    ngOnInit() {
        console.log('deputydeputy', this.deputy)
    }
}
