import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';

import { District, Deputy, ResultModel, Appeal, LoadedFile, Comment, ResultComment } from '../../models';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AppealService {

    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
        private storage: AngularFireStorage
    ) {}

    async getDistricts(): Promise<District[]> {
        const districts: District[] = [];
        await this.db.collection('districts').get().toPromise().then(async (snapshots) => {
            snapshots.forEach(snapshot => {
                const district: District = {
                    id: snapshot.id,
                    name: snapshot.data().name
                };
                districts.push(district);
            });
        });

        return districts;
    }

    async getDeputy(): Promise<Deputy[]> {
        const deputies: Deputy[] = [];
        await this.db.collection('users', ref => ref.where('role', '==', 'deputy')).get().toPromise().then(async (snapshots) => {
            snapshots.forEach(snapshot => {
                const deputy: Deputy = {
                    id: snapshot.id,
                    name: snapshot.data().surname + ' ' + snapshot.data().name + ' ' + snapshot.data().patronymic,
                    district: snapshot.data().district,
                };
                deputies.push(deputy);
            });
        });

        return deputies;
    }

    async createAppeal(data, loadedFiles: LoadedFile[] = null): Promise<ResultModel> {
        const {title, description, deputy } = data;
        const userId: string = await this.authService.getUserId();
        const urlImages: string[] = [];
        const urlFiles: string[] = [];
        if (loadedFiles && loadedFiles.length) {
            loadedFiles.map(loadedFile => {
                urlImages.push(loadedFile.imageUrl);
                urlFiles.push(loadedFile.pathFile);
            });
        }
        const appeal: Appeal = {
            title,
            description,
            deputyId: deputy.id,
            districtId: deputy.district,
            userId,
            status: 'До виконання',
            date: moment().utc().valueOf(),
            updateDate: moment().utc().valueOf(),
            fileUrl: urlFiles.length ? urlFiles : null,
            fileImageUrl: urlImages.length ? urlImages : null,
        };
        let result: ResultModel;
        await this.db.collection('appeals').add(appeal).then(async (res) => {
            if (res.id) {
                result = {
                    status: true
                };
            }
        }).catch(err => {
            result = {
                status: true,
                message: err.message
            };
        });

        return result;
    }

    async uploadFile(file: File): Promise<LoadedFile> {
        const pathFile = `appeals/${Date.now()}_${file.name}`;
        const ref = this.storage.ref(pathFile);
        await this.storage.upload(pathFile, file);
        const imageUrl: string = await ref.getDownloadURL().toPromise();
        const resultFile: LoadedFile = {
            imageUrl,
            pathFile
        };


        return resultFile;
    }

    deleteFileStore(path: string): void {
        this.storage.ref(path).delete();
    }

    async updateAppeals(id: string, status: string): Promise<boolean> {
        // tslint:disable-next-line: no-inferrable-types
        let isResult: boolean = true;
        const date: number = moment().utc().valueOf();
        try {
            await this.db.collection('appeals').doc(id).update({updateDate: date, status});
        }catch (error) {
            isResult = false;
        }

        return isResult;
    }

    async createComment(com: Comment, id: string, type: string = null): Promise<ResultComment> {
        const userId: string = await this.authService.getUserId();
        const comment: Comment = {
            type: type ? type : 'comment',
            message: com.message,
            date:  moment().utc().valueOf(),
            appealId: id,
            userId,
            rating: com.rating ? com.rating : null,
            isBackground: com.isBackground,
            loadedFiles: com.loadedFiles ? com.loadedFiles : null
        };
        let isResult: ResultComment = {
            status: true,
            comment
        };
        try {
            await this.db.collection('messages').add(comment);
            await this.db.collection('appeals').doc(id).update({updateDate: comment.date});
        }catch (error) {
            isResult = {
                status: false,
                comment: null,
            };
        }

        return isResult;
    }

    getConfirmRef(ref, id: string, type: string) {
        let resultRef = ref.where('appealId', '==', id);
        resultRef = resultRef.where('type', '==', type);

        return resultRef;
    }

    async getConfirmMessage(id: string): Promise<boolean> {
        const snapshots = await this.db.collection('messages', ref => this.getConfirmRef(ref, id, 'confirm')).get().toPromise();
        const result: boolean = snapshots.size ? true : false;

        return result;
    }

    async getFeedbackMessage(id: string): Promise<boolean> {
        const snapshots = await this.db.collection('messages', ref => this.getConfirmRef(ref, id, 'feedback')).get().toPromise();
        const result: boolean = snapshots.size ? true : false;

        return result;
    }

    getMessagesRef(ref, id: string) {
        let resultRef = ref.where('appealId', '==', id);
        resultRef = resultRef.orderBy('date', 'desc');

        return resultRef;
    }


    async getCommentsById(id: string): Promise<Comment[]> {
        const comments: Comment[] = [];
        const promises = [];
        const snapshots = await this.db.collection('messages', ref => this.getMessagesRef(ref, id)).get().toPromise();
        if (snapshots.size) {
            promises.push(new Promise((resolve) => {
                snapshots.forEach(async snapshot => {
                    const {message, date, appealId, userId, isBackground, type, rating}: firebase.firestore.DocumentData = snapshot.data();
                    if (type !== 'confirm') {
                        await this.db.collection('users').doc(userId).get().toPromise().then(span => {
                            const user: firebase.firestore.DocumentData = span.data();
                            let shortName: string;
                            if (user.role === 'deputy') {
                                shortName = user.surname.substr(0, 1).toUpperCase() + user.name.substr(0, 1).toUpperCase();
                            } else {
                                const name: string[] = user.name.split(' ');
                                shortName = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
                            }
                            const comment: Comment = {
                                type,
                                message,
                                date: moment(date).format('DD-MM-YYYY hh:mm'),
                                appealId,
                                userId,
                                isBackground,
                                imageUrl: user.imageUrl ? user.imageUrl : null,
                                shortName,
                                rating: rating ? rating : null,
                                autorName: user.role === 'deputy' ? user.surname + ' ' + user.name : user.name
                            };
                            comments.push(comment);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            }));
        }
        await Promise.all(promises);

        return comments;
    }


}
