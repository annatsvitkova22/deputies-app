import { AuthUser, District, Select, Party } from '../models';

export interface MainState {
    authStore: {
        user: AuthUser;
        isAuth: boolean;
    };
    settingsStore: {
        sorting: string;
        districts: District[];
        statuses: Select[];
        parties: Party[];
        date: number;
    };
}
