import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DeputyService } from '../../components/deputy/deputy.service';
import { AppealCard, LoadedFile, ResultComment } from '../../models';
import { AuthService } from '../../components/auth/auth.service';
import { AppealService } from '../../components/appeal/appeal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-confirm-appeal',
    templateUrl: './confirm-appeal.component.html',
    styleUrls: ['./confirm-appeal.component.scss']
})
export class ConfirmAppealComponent implements OnInit {
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    appealId: string;
    title: string;
    loadedFiles: LoadedFile[] = [];
    comment: string;
    deputyId: string;
    form = new FormGroup({
        comment: new FormControl('', [Validators.required]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deputyService: DeputyService,
        private authService: AuthService,
        private appealService: AppealService
    ){}

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.appealId = params['id'];
        });

        const appeal: AppealCard = await this.deputyService.getTitleAppeals(this.appealId);
        this.deputyId = await this.authService.getUserId();

        if (appeal.deputyId !== this.deputyId) {
            this.router.navigate(['/']);
        } else {
            const isConfirm = await this.appealService.getConfirmMessage(this.appealId);
            if (!isConfirm) {
                this.title = appeal.title;
                this.isLoader = false;
            } else {
                this.router.navigate(['/deputy', this.deputyId]);
            }
        }
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

    deleteFile(path: string): void {
        this.loadedFiles = this.loadedFiles.filter(file => file.pathFile !== path);
        this.appealService.deleteFileStore(path);
    }

    async onSave(): Promise<void> {
        // tslint:disable-next-line: no-inferrable-types
        const isBackground: boolean = false;
        const comment = {
            message: this.form.value.comment,
            loadedFiles: this.loadedFiles,
            isBackground,
        };
        const newComment: ResultComment = await this.appealService.createComment(comment, this.appealId, 'confirm');
        if (newComment.status) {
            this.router.navigate(['/deputy', this.deputyId]);
        }
    }

    onReturn(): void {
        this.router.navigate(['/deputy', this.deputyId]);
    }
}
