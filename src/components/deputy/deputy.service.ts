import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';

import { UserAccount, Deputy, AppealCard, CountAppeals, UserAvatal, Settings, Party } from '../../models';

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
                if (deputy.party) {
                    party = await this.getName(deputy.party, 'parties');
                    if (party !== 'Безпартiйний' && party) {
                        party = 'Партія «' + party + '»';
                    }
                }
                // tslint:disable-next-line: max-line-length
                const shortName: string = deputy.surname[1].substr(0, 1).toUpperCase() + deputy.name[0].substr(0, 1).toUpperCase();
                const findAppeal: AppealCard = {
                    id: appeal.id,
                    title: data.title,
                    description: data.description,
                    deputyId: span.id,
                    deputyName: deputy.surname + ' ' + deputy.name + ' ' + deputy.patronymic,
                    deputyImageUrl: deputy.imageUrl,
                    shortName,
                    party: party ? party : null,
                    userId: data.userId,
                    userImageUrl: userAvatar.imageUrl,
                    shortNameUser: userAvatar.shortName,
                    userName,
                    status: data.status,
                    date: moment(data.date).format('DD-MM-YYYY'),
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
                    id: appeal.id,
                    title: data.title,
                    description: data.description,
                    deputyId: deputy.id,
                    deputyName: deputy.name,
                    deputyImageUrl: deputy.imageUrl,
                    shortName: deputy.shortName,
                    party: deputy.party,
                    userId: span.id,
                    userName: user.name,
                    userImageUrl: user.imageUrl,
                    shortNameUser: shortName,
                    status: data.status,
                    date: moment(data.date).format('DD-MM-YYYY'),
                    fileUrl: data.fileUrl,
                    fileImageUrl: data.fileImageUrl,
                    countFiles: data.fileUrl ? data.fileUrl.length : 0,
                    countComments: 0
                };
                return ap;
            });
            return Promise.all(appealspans.map(fn => fn()));
        }
        return [];
    }

    async getTitleAppeals(id: string): Promise<AppealCard> {
        // tslint:disable-next-line: max-line-length
        const appealSpan: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await this.db.collection('appeals').doc(id).get().toPromise();
        const data = appealSpan.data();
        const appeal: AppealCard = {
            title: data.title,
            deputyId: data.deputyId,
            userId: data.userId,
            status: data.status
        };
        return appeal;
    }

    getCountAppeal(appeals: AppealCard[]): CountAppeals[] {
        const inProcess: AppealCard[] = appeals.filter(appeal => appeal.status === 'В роботі');
        const done: AppealCard[] = appeals.filter(appeal => appeal.status === 'Виконано');
        const countAppeals: CountAppeals[] = [
            {name: 'Запитів', count: appeals.length},
            {name: 'В роботі', count: inProcess.length},
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

    async setFilter(ref, settings: Settings) {
        let dateRef = this.sortingDeputy(ref, settings);
        let date = [];
        let promises = [];
        if (settings.districts) {
            promises = settings.districts.map((district) => async () => {
                const reserveRef = dateRef.where('district', '==', district.id);
                if (settings.statuses) {
                    promises = settings.statuses.map(status  => async () => {
                        const result = await reserveRef.where('party', '==', status.id).get();
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
        if (!settings.districts && settings.parties) {
            promises = settings.parties.map(party => async () => {
                const result = await dateRef.where('party', '==', party.id).get();
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

    async getAllDeputy(settings: Settings, type: string = null): Promise<Deputy[]> {
        let deputies;
        let snapshots;
        if (type === 'deputies') {
            const ref = this.db.collection('users').ref;
            snapshots = await this.setFilter(ref, settings);
        } else {
            deputies = await this.db.collection('users', ref => this.sortingDeputy(ref, settings)).get().toPromise();
            snapshots = deputies.docs;
        }
        if (snapshots.length) {
            deputies = snapshots.map(deputyRes => async () => {
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
        const inProcess = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId).where('status', '==', 'В роботі')).get().toPromise();
        // tslint:disable-next-line: max-line-length
        const done = await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId).where('status', '==', 'Виконано')).get().toPromise();
        const countAppeals: CountAppeals[] = [
            {name: 'Запитів', count: appeals.size},
            {name: 'В роботі', count: inProcess.size},
            {name: 'Виконано', count: done.size}
        ];

        return countAppeals;
    }

    async getParties(): Promise<Party[]> {
        const parties: Party[] = [];
        await this.db.collection('parties').get().toPromise().then(async (snapshots) => {
            snapshots.forEach(snapshot => {
                const party: Party = {
                    id: snapshot.id,
                    name: snapshot.data().name
                };
                parties.push(party);
            });
        });

        return parties;
    }
}
