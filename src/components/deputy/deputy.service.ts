import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { UserAccount, Deputy, AppealCard, CountAppeals, UserAvatal, Settings } from '../../models';

@Injectable()
export class DeputyService {
    constructor(
        private db: AngularFirestore,
    ) {}

    async getDeputy(deputyId: string): Promise<Deputy> {
        let deputy: Deputy;
        await this.db.collection('users').doc(deputyId).get().toPromise().then(async (snapshot) => {
            const data: firebase.firestore.DocumentData = snapshot.data();
            const shortName: string = data.surname.substr(0, 1).toUpperCase() + data.name.substr(0, 1).toUpperCase();
            let party: string;
            let district: string;
            if (data.party) {
                party = await this.getName(data.party, 'parties');
            }
            if (data.district) {
                district = await this.getName(data.district, 'districts');
            }
            if (party !== 'Безпартiйний' && party) {
                party = 'Партія «' + party + '»';
            }

            deputy = {
                id: deputyId,
                name: data.surname + ' ' + data.name + ' ' + data.patronymic,
                district: district ? district : null,
                description: data.description ? data.description : null,
                party: party ? party : null,
                date: data.date ? data.date : null,
                imageUrl: data.imageUrl ? data.imageUrl : null,
                shortName: data.imageUrl ? null : shortName,
                rating: data.rating ? data.rating : 0,
            };
        }).catch(err => {
            console.log('err', err);
        });

        return deputy;
    }

    async getName(partyId: string, type: string): Promise<string> {
        let name: string;
        await this.db.collection(type).doc(partyId).get().toPromise().then(async (snapshot) => {
            const data: firebase.firestore.DocumentData = snapshot.data();
            name = data.name;
        }).catch(err => {
            console.log('err', err);
        });

        return name;
    }


    async getAppealByUser(userId: string, userAvatar: UserAvatal, userName: string ): Promise<AppealCard[]> {
        let appealspans: any = await this.db.collection('appeals', ref => ref.where('userId', '==', userId)).get().toPromise();
        if (appealspans.size) {
            appealspans = appealspans.docs.map(appeal => async () => {
                const data = appeal.data();
                const span = await this.db.collection('users').doc(data.deputyId).get().toPromise();
                const deputy: firebase.firestore.DocumentData = span.data();
                let party: string;
                if (data.party) {
                    party = await this.getName(data.party, 'parties');
                }
                // tslint:disable-next-line: max-line-length
                const shortName: string = deputy.surname[1].substr(0, 1).toUpperCase() + deputy.name[0].substr(0, 1).toUpperCase();
                const findAppeal: AppealCard = {
                    title: data.title,
                    description: data.description,
                    deputyName: deputy.surname + ' ' + deputy.name + ' ' + deputy.patronymic,
                    deputyImageUrl: deputy.imageUrl,
                    shortName,
                    party: party ? party : null,
                    userImageUrl: userAvatar.imageUrl,
                    shortNameUser: userAvatar.shortName,
                    userName,
                    status: data.status,
                    date: data.date,
                    countFiles: 0,
                    countComments: 0
                };
                return findAppeal;
            });
            return Promise.all(appealspans.map(fn => fn()));
        }
        return [];
    }

    async getAppeal(deputyId: string, deputy: UserAccount): Promise<AppealCard[]> {
        // tslint:disable-next-line: max-line-length
        let appealspans: any = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId)).get().toPromise();
        if (appealspans.size) {
            appealspans = appealspans.docs.map(appeal => async () => {
                const data = appeal.data();
                const span = await this.db.collection('users').doc(data.userId).get().toPromise();
                const user: firebase.firestore.DocumentData = span.data();
                const name: string[] = user.name.split(' ');
                // tslint:disable-next-line: max-line-length
                const shortName: string = name[1] ? name[1].substr(0, 1).toUpperCase() : '' + name[0].substr(0, 1).toUpperCase();
                const ap: AppealCard = {
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
                return ap;
            });
            return Promise.all(appealspans.map(fn => fn()));
        }
        return [];
    }

    getCountAppeal(appeals: AppealCard[]): CountAppeals[] {
        const inProcess: AppealCard[] = appeals.filter(appeal => appeal.status === 'В Роботі');
        const done: AppealCard[] = appeals.filter(appeal => appeal.status === 'Виконано');
        const countAppeals: CountAppeals[] = [
            {name: 'Запитів', count: appeals.length},
            {name: 'В Роботі', count: inProcess.length},
            {name: 'Виконано', count: done.length},
        ];

        return countAppeals;
    }

    sortingDeputy(ref, settings: Settings) {
        let deputyRef = ref.where('role', '==', 'deputy');
        if (settings && settings.sorting && settings.sorting === '1') {
            deputyRef = deputyRef.orderBy('rating', 'desc');
        }
        if (settings && settings.sorting && settings.sorting === '2') {
            deputyRef = deputyRef.orderBy('countAppeals', 'desc');
        }
        if (settings && settings.sorting && settings.sorting === '3') {
            deputyRef = deputyRef.orderBy('countConfirmAppeals', 'desc');
        }

        return deputyRef;
    }

    async getAllDeputy(settings: Settings = null): Promise<Deputy[]> {
        let deputies: any = await this.db.collection('users', ref => this.sortingDeputy(ref, settings)).get().toPromise();
        if (deputies.size) {
            deputies = deputies.docs.map(deputyRes => async () => {
                const data = deputyRes.data();
                const shortName: string = data.surname.substr(0, 1).toUpperCase() + data.name.substr(0, 1).toUpperCase();
                let party: string;
                let district: string;
                if (data.party) {
                    party = await this.getName(data.party, 'parties');
                }
                if (data.district) {
                    district = await this.getName(data.district, 'districts');
                }
                if (party !== 'Безпартiйний' && party) {
                    party = 'Партія «' + party + '»';
                }
                const name: string =  data.surname + ' ' + data.name;
                const deputy: Deputy = {
                    id: deputyRes.id,
                    name,
                    patronymic: data.patronymic,
                    party: party ? party : null,
                    rating: data.rating ? data.rating : 0,
                    district: district ? district : null,
                    imageUrl: data.imageUrl ? data.imageUrl : null,
                    shortName
                };
                return deputy;
            });
            return Promise.all(deputies.map(fn => fn()));
        }
        return [];
    }

    async getAppealsCountById(deputyId: string): Promise<CountAppeals[]> {
        const appeals = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId)).get().toPromise();
        // tslint:disable-next-line: max-line-length
        const inProcess = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId).where('status', '==', 'В Роботі')).get().toPromise();
        // tslint:disable-next-line: max-line-length
        const done = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId).where('status', '==', 'Виконано')).get().toPromise();
        const countAppeals: CountAppeals[] = [
            {name: 'Запитів', count: appeals.size},
            {name: 'В Роботі', count: inProcess.size},
            {name: 'Виконано', count: done.size}
        ];

        return countAppeals;
    }
}
