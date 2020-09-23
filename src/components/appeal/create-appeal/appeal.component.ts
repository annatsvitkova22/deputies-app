import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AppealService } from '.././appeal.service';
import { District, Deputy, ResultModel, LoadedFile } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { NgbdModalContent } from '../../modal/modal.component';

@Component({
    selector: 'app-appeal',
    templateUrl: './appeal.component.html',
    styleUrls: ['./appeal.component.scss']
})
export class AppealComponent implements OnInit {
    form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        district: new FormControl(null, [Validators.required]),
        deputy: new FormControl(null, [Validators.required])
    });

    isError: boolean;
    message: string;
    districts: District[];
    allDeputies: Deputy[];
    deputies: Deputy[];
    loadedFiles: LoadedFile[] = [];
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;

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
        this.isLoader = false;
    }

    async onFileChange(event): Promise<void> {
        const file: File = event.target.files[0];
        if (file) {
            const size: string = (event.target.files[0].size * 0.001).toFixed(1) + ' mb';
            const fileInfo: LoadedFile = await this.appealService.uploadFile(file);
            if (file.type !== 'image/png' && file.type !== 'image/x-png' && file.type !== 'image/gif' && file.type !== 'image/jpeg') {
                fileInfo.imageUrl = 'assets/images/file.png';
            }
            const loadedFile: LoadedFile = {
                name: file.name,
                size,
                imageUrl: fileInfo.imageUrl,
                pathFile: fileInfo.pathFile,
            };
            this.loadedFiles.push(loadedFile);
        }
    }

    async onSubmit(): Promise<void> {
        const result: ResultModel = await this.appealService.createAppeal(this.form.value, this.loadedFiles);
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

    deleteFile(path: string): void {
        this.loadedFiles = this.loadedFiles.filter(file => file.pathFile !== path);
        this.appealService.deleteFileStore(path);
    }
}
