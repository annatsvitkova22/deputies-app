import { Component, OnInit, Input } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

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
    @Input() isButton: boolean;

    constructor(
        private meta: Meta,
        private title: Title
    ){
        this.title.setTitle('СЛУГА ПОЛТАВИ | ' + this.user.name + ' ' + this.user.patronymic);
        this.meta.updateTag({ name: 'og:url', content: this.user.imageUrl ? this.user.imageUrl : ''});
        this.meta.updateTag({ name: 'description', content: this.user.party});
    }

    async ngOnInit(): Promise<void> {}
}
