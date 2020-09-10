import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modal-content',
    template: `
        <div class="modal-header">
            <button type="button" class="close" aria-label="Close" (click)="onClose()">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <h1>{{name}}</h1>
        </div>
        <div class="modal-footer">
        </div>
    `
})
export class NgbdModalContent {
    @Input() name;

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router
    ) {}

    onClose(): void {
        this.router.navigate(['/signIn']);
        this.activeModal.dismiss('Cross click');
    }
}
