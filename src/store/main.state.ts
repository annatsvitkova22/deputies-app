import { AuthUser, District, Select } from '../models';

export interface MainState {
    authStore: {
        user: AuthUser;
        isAuth: boolean;
    };
    settingsStore: {
        sorting: string;
        districts: District[];
        statuses: Select[];
        date: number;
    };
}
