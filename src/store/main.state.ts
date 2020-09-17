import { AuthUser, District } from '../models';

export interface MainState {
    authStore: {
        user: AuthUser;
        isAuth: boolean;
    };
    settingsStore: {
        sorting: string;
        districts: District[];
        statuses: string[];
        date: number;
    };
}
