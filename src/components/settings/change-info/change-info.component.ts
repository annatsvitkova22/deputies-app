import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AppealService } from '../../appeal/appeal.service';
import { District, ResultModel, UserAvatal, UserAvatarForm, AuthState, LoadedFile } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { SettingsService } from '../settings.service';
import { Party } from '../../../models';
import { MainState } from '../../../store/main.state';
import { AddAuth } from '../../../store/auth.action';

@Component({
    selector: 'app-change-info',
    templateUrl: './change-info.component.html',
    styleUrls: ['./change-info.component.scss']
})
export class ChangeInfoComponent implements OnInit {
    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl(''),
        date: new FormControl(''),
    });
    model: NgbDateStruct;
    districts: District[];
    parties: Party[];
    userAvatar: UserAvatal;
    userRole: string;
    userStore: AuthState;
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    class: string;

    constructor(
        private appealService: AppealService,
        private authService: AuthService,
        private settingsService: SettingsService,
        private store: Store<MainState>,
    ){}

    async ngOnInit(): Promise<void> {
        const user = await this.settingsService.getUser();
        this.userRole = await this.authService.getUserRole();
        this.userAvatar = await this.authService.getUserImage();
        // this.model = user.date;
        if (this.userRole === 'deputy') {
            this.form.addControl('patronymic', new FormControl('', Validators.required));
            this.form.addControl('description', new FormControl(null));
            this.form.addControl('district', new FormControl(null, Validators.required));
            this.form.addControl('party', new FormControl(null, Validators.required));

            this.districts = await this.appealService.getDistricts();
            this.parties = await this.settingsService.getParties();
            const party: Party = this.parties.find((part: Party) => part.id === user.party);
            const district: District = this.districts.find((distric: District) => distric.id === user.district);
            this.form.patchValue({
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
                description: user.description,
                district: district ? district : null,
                party: party ? party : null,
            });
        } else {
            const name: string[] = user.name.split(' ');
            this.form.patchValue({
                name: name[0],
                surname: name.length === 2 ? name[1] : '',
            });
        }
        this.isLoader = false;
    }

    onDeleteFile(): void {
        this.userAvatar.imageUrl = null;
    }

    async onFileChange(event): Promise<void> {
        const file: File = event.target.files[0];
        if (file) {
            const fileInfo: LoadedFile = await this.appealService.uploadFile(file);
            this.userAvatar.imageUrl = fileInfo.imageUrl;
        }
    }

    async onSubmit(data: UserAvatarForm): Promise<ResultModel> {
        let result: ResultModel;
        if (this.userRole === 'deputy') {
            result = await this.settingsService.updateDeputy(data.userForm, data.userAvatar.imageUrl);
        } else {
            result = await this.settingsService.updateUser(data.userForm, data.userAvatar.imageUrl);
        }
        let authStore ;
        this.store.select('authStore').subscribe((data: AuthState) => {
            authStore = {
                isAuth: data.isAuth,
                user: {
                    userId: data.user.userId,
                    role: data.user.role,
                    name: data.user.name,
                    email: data.user.email,
                    imageUrl: this.userAvatar ? this.userAvatar.imageUrl : null,
                    shortName: data.user.shortName,
                },
            };
        } );
        this.store.dispatch(new AddAuth(authStore));

        return result;
    }

    getForm(): UserAvatarForm {
        const data: UserAvatarForm = {
            userForm: this.form.value,
            userAvatar: this.userAvatar
        };

        return data;
    }
}
