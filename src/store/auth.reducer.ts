import { AuthAction, AUTH_ACTION } from './auth.action';
import { AuthState } from '../models';

const initialState: AuthState = {
    user: null,
    isAuth: false
};

export const authReducer = (state = initialState, action: AuthAction) => {
    switch (action.type) {
        case AUTH_ACTION.ADD_AUTH:
            const newState = {
                ...state,
                isAuth: action.payload.isAuth,
                user: action.payload.user
            };

            return newState;
        case AUTH_ACTION.DELETE_AUTH:
            const deletedState = {
                ...state,
                isAuth: false,
                user: null
            };

            return deletedState;
        default:
            return state;
    }
};
