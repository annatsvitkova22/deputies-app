import { Component, OnInit } from '@angular/core';

import { Deputy } from '../../models';
import { DeputyService } from '../../components/deputy/deputy.service';


@Component({
    selector: 'app-deputies',
    templateUrl: './deputies.component.html',
})
export class DeputiesComponent implements OnInit {
    deputies: Deputy[];
    isLoader: boolean = true;

    constructor(
        private deputyService: DeputyService,
    ){}

    async ngOnInit(): Promise<void> {
        this.deputies = await this.deputyService.getAllDeputy();
        this.isLoader = false;
    }
}