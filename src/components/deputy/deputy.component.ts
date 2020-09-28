import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { DeputyService } from './deputy.service';
import { AppealCard, CountAppeals, UserAccount } from '../../models';
import { AuthService } from '../auth/auth.service';
import { MainService } from '../../pages/main/main.service';
import { ModalComponent } from '../appeal/modal/modal.component';

@Component({
    selector: 'app-deputy',
    templateUrl: './deputy.component.html',
    styleUrls: ['./deputy.component.scss']
})
export class DeputyComponent implements OnInit {
    deputyId: string;
    deputy: UserAccount;
    shortName: string;
    appeals: AppealCard[];
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    isLoadAppeal: boolean;
    countAppeals: CountAppeals[] = [];
    isButton: boolean;
    count: number;
    type: string;
    queryParams: string;

    constructor(
        private route: ActivatedRoute,
        private deputyService: DeputyService,
        private authService: AuthService,
        private modalService: NgbModal,
        private mainService: MainService
    ){}

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.deputyId = params['id'];
        });
        this.route.queryParams.subscribe(params => {
            this.queryParams = params['id'];
        });
        if (this.queryParams) {
            this.openModal();
        }
        this.type = null;
        this.count = 3;
        this.deputy = await this.deputyService.getDeputy(this.deputyId);
        this.appeals = await this.deputyService.getAppeal(this.deputyId, this.deputy, this.count);
        this.countAppeals = await this.deputyService.getCountAppeal(this.deputyId, 'deputyId');
        const userRole: string = await this.authService.getUserRole();
        if (userRole === 'deputy') {
            this.isButton = false;
        } else {
            this.isButton = true;
        }
        this.isLoader = false;
    }

    async openModal(): Promise<void> {
        const appeal = await this.mainService.getAppealById(this.queryParams);
        const modalRef: NgbModalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.appeal = appeal;
        let statusColor: string;
        if (appeal.status === 'До виконання') {
            statusColor = 'card__status--yellow';
        } else if (appeal.status === 'Виконано') {
            statusColor = 'card__status--green';
        }
        modalRef.componentInstance.statusColor = statusColor;
    }

    async onScroll(): Promise<void> {
        this.isLoadAppeal = true;
        this.count = this.count + 3;
        this.appeals = await this.deputyService.getAppeal(this.deputyId, this.deputy, this.count, this.type);
        this.isLoadAppeal = false;
    }

    async onFilter(type): Promise<void> {
        this.isLoadAppeal = true;
        this.appeals = [];
        this.count = 3;
        const thisType = type === 'Усi' ? null : type;
        this.type = thisType;
        this.appeals = await this.deputyService.getAppeal(this.deputyId, this.deputy, this.count, thisType);
        this.isLoadAppeal = false;
    }
}
