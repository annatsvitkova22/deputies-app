import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

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
        this.store.select('settingsStore').subscribe((data: Settings) =>  result = data);

        return result;
    }

    async getAppeal(settings): Promise<AppealCard[]> {
        const appeals: AppealCard[] = [];
        const promises = [];
        // tslint:disable-next-line: max-line-length
        await this.db.collection('appeals', ref => ref.where('date', '>', settings.date) && ref.orderBy('date', 'asc')).get().toPromise().then(async (snapshots) => {
            if (snapshots.size) {
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
                                deputyName: deputy.name,
                                deputyImageUrl: deputy.imageUrl,
                                shortName: deputy.shortName,
                                party: deputy.party,
                                userName: user.name,
                                userImageUrl: user.imageUrl,
                                shortNameUser: shortName,
                                status: data.status,
                                date: data.date,
                                countFiles: 0,
                                countComments: 0
                            };
                            appeals.push(appeal);
                            resolve();
                        });
                    });
                }));
            }
        }).catch(err => {
            console.log('err', err);
        });
        await Promise.all(promises);

        return appeals;
    }
}
