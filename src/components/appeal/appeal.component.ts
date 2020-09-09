import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppealService } from './appeal.service';
import { District, Deputy, ResultModel } from '../../models';
import { AuthService } from '../auth/auth.service';

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
        private authService: AuthService
    ){}

    async ngOnInit(): Promise<void> {
        this.districts = await this.appealService.getDistricts();
        this.allDeputies = await this.appealService.getDeputy();
        this.deputies = this.allDeputies;
    }

    onFileChange(event): void {
        console.log('event', event)
    }

    async onSubmit(): Promise<void> {
        const {title, description, deputy } = this.form.value;
        const userId: string = await this.authService.getUserId();
        const appeal = {
            title,
            description,
            deputyId: deputy.id,
            districtId: deputy.district,
            userId
        };
        const result: ResultModel = await this.appealService.createAppeal(appeal);
        this.isError = !result.status;
        this.message = result.status ? null : result.message;
    }

    onDistrictsChange(value) {
        this.deputies = this.allDeputies.filter(deputy => deputy.district === value.id);
    }

    onDeputyChange(value) {
        if (this.form.value.district === '') {
            this.districts = this.districts.filter(district => district.id === value.district);
        }
    }
}
