import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbDateStruct, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AppealService } from '../../appeal/appeal.service';
import { District, UserFormModel, ResultModel } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { SettingsService } from '../settings.service';
import { Party } from '../../../models';
import { NgbdModalContent } from '../../modal/modal.component';

@Component({
    selector: 'app-change-info',
    templateUrl: './change-info.component.html',
    styleUrls: ['./change-info.component.scss']
})
export class ChangeInfoComponent implements OnInit {
    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        date: new FormControl(''),
    });
    model: NgbDateStruct;
    districts: District[];
    parties: Party[];
    imageUrl: string;
    userRole: string;

    constructor(
        private appealService: AppealService,
        private authService: AuthService,
        private settingsService: SettingsService,
        private modalService: NgbModal
    ){}

    async ngOnInit(): Promise<void> {
        const user = await this.settingsService.getUser();
        this.userRole = await this.authService.getUserRole();
        this.imageUrl = user.imageUrl ? user.imageUrl : null;
        if (this.userRole === 'deputy') {
            this.form.addControl('patronymic', new FormControl('', Validators.required));
            this.form.addControl('description', new FormControl(''));
            this.form.addControl('district', new FormControl('', Validators.required));
            this.form.addControl('party', new FormControl('', Validators.required));

            this.districts = await this.appealService.getDistricts();
            this.parties = await this.settingsService.getParties();
            const party = this.parties.find(party => party.id === user.party);
            const district = this.districts.find(district => district.id === user.district);
            this.form.patchValue({
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                district: district ? district : '',
                party: party ? party : '',
                date: user.date ? user.date : ''
            });
        } else {
            const name: string[] = user.name.split(' ');
            this.form.patchValue({
                name: name[0],
                surname: name.length === 2 ? name[1] : '',
                date: user.date ? user.date : ''
            });
        }
    }

    onFileChange(event): void {
        const file = event.target.files[0];
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.imageUrl = reader.result as string;
        };
    }

    async onSubmit(): Promise<void> {
        const data: UserFormModel = this.form.value;
        let result: ResultModel;
        if (this.userRole === 'deputy') {
            result = await this.settingsService.updateDeputy(data, this.imageUrl);
        } else {
            result = await this.settingsService.updateUser(data, this.imageUrl);
        }

        const modalRef: NgbModalRef = this.modalService.open(NgbdModalContent, {
            size: 'lg'
        });
        modalRef.componentInstance.name = result.message;
    }
}