import { AuthUser } from '../models';

export interface MainState {
    authStore: {
        user: AuthUser;
        isAuth: boolean;
    };
}
