import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { District, Deputy, ResultModel } from '../../models';

@Injectable()
export class AppealService {

    constructor(
        private db: AngularFirestore,
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

    async createAppeal(appeal): Promise<ResultModel> {
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
}
