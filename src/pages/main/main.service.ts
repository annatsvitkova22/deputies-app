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
        let dateRef = ref.orderBy('updateDate', 'desc');
        let date = [];
        let promises = [];
        if (settings.date) {
            const newDate: number = settings.date + 86400000;
            dateRef = dateRef.where('updateDate', '>=', settings.date);
            dateRef = dateRef.where('updateDate', '<=', newDate);
            dateRef = dateRef;
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

    async getCountMessage(id): Promise<number> {
        let counter: number = 0;
        const promises = [];
        const dataRef = await this.db.collection('messages', ref => ref.where('appealId', '==', id)).get().toPromise();
        if (dataRef.size) {
            promises.push(new Promise((resolve) => {
                dataRef.forEach(span => {
                    const data = span.data();
                    if (data.type !== 'confirm') {
                        counter++;
                    }
                    resolve();
                });
            }));
        }
        await Promise.all(promises);

        return counter;
    }


    async getAppeal(settings): Promise<AppealCard[]> {
        const ref = this.db.collection('appeals').ref;
        let snapshots = await this.setFilter(ref, settings);
        if (snapshots.length) {
            snapshots = snapshots.map(snapshot => async () =>  {
                const data: firebase.firestore.DocumentData = snapshot.data();
                const deputy: Deputy = await this.deputyService.getDeputy(data.deputyId);
                const messageSnaps: number = await this.getCountMessage(snapshot.id);
                const span = await this.db.collection('users').doc(data.userId).get().toPromise();
                const user: firebase.firestore.DocumentData = span.data();
                const name: string[] = user.name.split(' ');
                // tslint:disable-next-line: max-line-length
                const shortName: string = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
                const appeal: AppealCard = {
                    id: snapshot.id,
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
                    countComments: messageSnaps
                };

                return appeal;
            });
            return Promise.all(snapshots.map(fn => fn()));
        }
        return [];
    }
}
