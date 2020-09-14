import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AppealService } from './appeal.service';
import { District, Deputy, ResultModel } from '../../models';
import { AuthService } from '../auth/auth.service';
import { NgbdModalContent } from '../modal/modal.component';

@Component({
    selector: 'app-appeal',
    templateUrl: './appeal.component.html',
    styleUrls: ['./appeal.component.scss']
})
export class AppealComponent implements OnInit {
    form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        deputy: new FormControl('', [Validators.required]),
        confirmation: new FormControl(null, [Validators.required])
    });

    isError: boolean;
    message: string;
    districts: District[];
    allDeputies: Deputy[];
    deputies: Deputy[];

    constructor(
        private appealService: AppealService,
        private authService: AuthService,
        private modalService: NgbModal,
        private router: Router,
    ){}

    async ngOnInit(): Promise<void> {
        const userRole = await this.authService.getUserRole();
        if (userRole !== 'deputy') {
            this.districts = await this.appealService.getDistricts();
            this.allDeputies = await this.appealService.getDeputy();
            this.deputies = this.allDeputies;
        } else {
            this.router.navigate(['/']);
        }
    }

    onFileChange(event): void {
        console.log('event', event);
    }

    async onSubmit(): Promise<void> {
        const result: ResultModel = await this.appealService.createAppeal(this.form.value);
        if (result.status) {
            const modalRef = this.modalService.open(NgbdModalContent, {
                size: 'lg'
            });
            modalRef.componentInstance.name = 'Вашу заявку успiшно створено';
        } else {
            this.isError = !result.status;
            this.message = result.message;
        }
    }

    onDistrictsChange(value): void {
        this.deputies = this.allDeputies.filter(deputy => deputy.district === value.id);
    }

    onDeputyChange(value): void {
        if (this.form.value.district === '') {
            this.districts = this.districts.filter(district => district.id === value.district);
        }
    }
}
