import { Component, Input, OnInit } from '@angular/core';

import { Deputy, CountAppeals } from '../../../models';
import { DeputyService } from '../deputy.service';

@Component({
    selector: 'app-small-card',
    templateUrl: './small-card.component.html',
    styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
    @Input() deputy: Deputy;
    @Input() isSearch: boolean;
    @Input() isCreateAppeal: boolean;
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    countAppeals: CountAppeals[];

    constructor(
        private deputyService: DeputyService
    ){}

    async ngOnInit(): Promise<void> {
        this.countAppeals = await this.deputyService.getCountAppeal(this.deputy.id, 'deputyId');
        this.isLoader = false;
    }
}
