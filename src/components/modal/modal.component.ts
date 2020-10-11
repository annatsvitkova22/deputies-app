import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modal-content',
    templateUrl: './modal.component.html'
})
export class NgbdModalContent implements OnDestroy {
    @Input() name;
    @Input() message;

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router
    ) {}

    onClose(): void {
        this.activeModal.dismiss('Cross click');
    }

    ngOnDestroy(): void {
        this.router.navigate(['/']);
    }
}
