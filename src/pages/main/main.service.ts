import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AppealCard, Deputy, Settings } from '../../models';
import { DeputyService } from '../../components/deputy/deputy.service';
import { MainState } from '../../store/main.state';

@Injectable()
export class MainService {

    constructor(
        private db: AngularFirestore,
        private deputyService: DeputyService,
        private store: Store<MainState>,
    ) {}

    async getSettings(): Promise<Settings> {
        let result: Settings;
        this.store.select('settingsStore').subscribe(data => result = data);

        return result;
    }

    async setFilter(ref, settings: Settings) {
        let dateRef = ref.orderBy('date', 'desc');
        let date = [];
        let promises = [];
        if (settings.date) {
            const newDate: number = settings.date + 86400;
            dateRef = dateRef.where('date', '>=', settings.date);
            dateRef = dateRef.where('date', '<=', newDate);
        }
        if (settings.districts) {
            promises = settings.districts.map((district) => async () => {
                const reserveRef = dateRef.where('districtId', '==', district.id);
                if (settings.statuses) {
                    promises = settings.statuses.map(status  => async () => {
                        const result = await reserveRef.where('status', '==', status.name).get();
                        date = date.concat(result.docs);
                        return date;
                });
                    await Promise.all(promises.map(fn => fn()));
                    return date;
                } else {
                    const result = await reserveRef.get();
                    date = date.concat(result.docs);
                    return date;
                }
            });
            await Promise.all(promises.map(fn => fn()));
            return date;
        }
        if (!settings.districts && settings.statuses) {
            promises = settings.statuses.map(status => async () => {
                const result = await dateRef.where('status', '==', status.name).get();
                date = date.concat(result.docs);
                return date;
            });
            await Promise.all(promises.map(fn => fn()));
            return date;
        }
        const resultSpans = await dateRef.get();
        date = date.concat(resultSpans.docs);
        return date;
    }


    async getAppeal(settings): Promise<AppealCard[]> {
        const appeals: AppealCard[] = [];
        const promises = [];
        const ref = this.db.collection('appeals').ref;
        const snapshots = await this.setFilter(ref, settings);
        if (snapshots.length) {
            promises.push(new Promise((resolve) => {
                snapshots.forEach(async snapshot => {
                    const data: firebase.firestore.DocumentData = snapshot.data();
                    const deputy: Deputy = await this.deputyService.getDeputy(data.deputyId);
                    await this.db.collection('users').doc(data.userId).get().toPromise().then(span => {
                        const user: firebase.firestore.DocumentData = span.data();
                        const name: string[] = user.name.split(' ');
                        // tslint:disable-next-line: max-line-length
                        const shortName: string = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
                        const appeal: AppealCard = {
                            title: data.title,
                            description: data.description,
                            deputyId: data.deputyId,
                            deputyName: deputy.name,
                            deputyImageUrl: deputy.imageUrl,
                            shortName: deputy.shortName,
                            party: deputy.party,
                            userName: user.name,
                            userImageUrl: user.imageUrl,
                            userId: data.userId,
                            shortNameUser: shortName,
                            status: data.status,
                            date: moment(data.date).format('DD-MM-YYYY'),
                            fileUrl: data.fileUrl,
                            fileImageUrl: data.fileImageUrl,
                            countFiles: data.fileUrl ? data.fileUrl.length : 0,
                            countComments: 0
                        };
                        appeals.push(appeal);
                        resolve();
                    });
                });
            }));
        }
        await Promise.all(promises);

        return appeals;
    }
}
