import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Deputy, AppealCard } from '../../models';

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
                rating: data.rating ? data.rating : null,
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

    async getAppeal(deputyId: string, deputy: Deputy): Promise<AppealCard[]> {
        const appeals: AppealCard[] = [];
        const promises = [];
        // tslint:disable-next-line: max-line-length
        await this.db.collection('appeals', ref => ref.where('deputyId', '==', deputyId) && ref.orderBy('date', 'asc')).get().toPromise().then(async (snapshots) => {
            console.log('sdfsdfsdfdsf', snapshots.size)
            if (snapshots.size) {
                promises.push(new Promise((resolve) => {
                    snapshots.forEach(async snapshot => {
                        const data: firebase.firestore.DocumentData = snapshot.data();
                        await this.db.collection('users').doc(data.userId).get().toPromise().then(span => {
                            const user: firebase.firestore.DocumentData = span.data();
                            const appeal: AppealCard = {
                                title: data.title,
                                description: data.description,
                                deputyName: deputy.name,
                                deputyImageUrl: deputy.imageUrl,
                                shortName: deputy.shortName,
                                party: deputy.party,
                                userName: user.name,
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
