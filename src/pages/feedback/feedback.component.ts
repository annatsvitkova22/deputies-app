import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

import { DeputyService } from '../../components/deputy/deputy.service';
import { AppealCard, Comment, ResultComment, Deputy } from '../../models';
import { AuthService } from '../../components/auth/auth.service';
import { AppealService } from '../../components/appeal/appeal.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    appealId: string;
    appeal: AppealCard;
    deputy: Deputy;
    form = new FormGroup({
        comment: new FormControl('', [Validators.required]),
    });
    currentRate: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deputyService: DeputyService,
        private authService: AuthService,
        private appealService: AppealService,
        config: NgbRatingConfig
    ){
        config.max = 5;
    }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.appealId = params['id'];
        });
        this.appeal = await this.deputyService.getTitleAppeals(this.appealId);
        const userId = await this.authService.getUserId();
        if (this.appeal.userId !== userId || this.appeal.status !== 'Виконано') {
            this.router.navigate(['/']);
        } else {
            this.deputy = await this.deputyService.getDeputy(this.appeal.deputyId);
            this.isLoader = false;
        }
    }

    async onFeedback(): Promise<void> {
        //tslint:disable-next-line: no-inferrable-types
        const isBackground: boolean = true;
        const comment: Comment = {
            message: this.form.value.comment,
            isBackground,
            rating: this.currentRate
        };
        const newComment: ResultComment = await this.appealService.createComment(comment, this.appealId, 'feedback');
        if (newComment.status) {
            this.router.navigate(['/profile']);
        }
    }
}
