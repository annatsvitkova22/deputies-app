import { Component, OnInit, Input } from '@angular/core';

import { UserAccount, CountAppeals } from '../../../models';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent implements OnInit {
    @Input() user: UserAccount;
    @Input() countAppeals: CountAppeals[] = [];
    @Input() link: string;
    @Input() linkName: string;

    constructor(){}

    async ngOnInit(): Promise<void> {
    }
}
