import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Deputy, CountAppeals } from '../../../models';
import { DeputyService } from '../deputy.service';

@Component({
    selector: 'app-small-card',
    templateUrl: './small-card.component.html',
    styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
    @Input() deputy: Deputy;
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    countAppeals: CountAppeals[];

    constructor(
        private deputyService: DeputyService
    ){}

    async ngOnInit(): Promise<void> {
        this.countAppeals = await this.deputyService.getAppealsCountById(this.deputy.id);
        this.isLoader = false;
    }
}
