import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AppealCard } from '../../../models';
import { ModalComponent } from '../modal/modal.component';
import { MainService } from '../../../pages/main/main.service';


@Component({
    selector: 'app-appeal-card',
    templateUrl: './appeal-card.component.html',
    styleUrls: ['./appeal-card.component.scss']
})
export class AppealCardComponent implements OnInit {
    @Input () appeal: AppealCard;
    @Input () isMainPage: boolean;
    statusColor: string;
    rating: number;
    url: string;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private mainService: MainService,
    ){}

    async ngOnInit(): Promise<void> {
        if (this.appeal.status === 'До виконання') {
            this.statusColor = 'card__status--yellow';
        } else if (this.appeal.status === 'Виконано') {
            this.statusColor = 'card__status--green';
            this.rating = await this.mainService.getRating(this.appeal.id);
        }
    }

    async onOpenAppeal(): Promise<void> {
        this.router.navigate([], {
            queryParams: {
                id: this.appeal.id
            },
            queryParamsHandling: 'merge',
        });
        const modalRef: NgbModalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.appeal = this.appeal;
        modalRef.componentInstance.statusColor = this.statusColor;
    }
}
