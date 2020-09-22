import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AppealCard } from '../../../models';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-appeal-card',
    templateUrl: './appeal-card.component.html',
    styleUrls: ['./appeal-card.component.scss']
})
export class AppealCardComponent implements OnInit {
    @Input () appeal: AppealCard;
    statusColor: string;

    constructor(
        private modalService: NgbModal,
    ){}

    ngOnInit(): void {
        if (this.appeal.status === 'До виконання') {
            this.statusColor = 'card__status--yellow';
        } else if (this.appeal.status === 'Виконано') {
            this.statusColor = 'card__status--green';
        }
    }

    onOpenAppeal(): void {
        const modalRef: NgbModalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.appeal = this.appeal;
        modalRef.componentInstance.statusColor = this.statusColor;
    }
}
