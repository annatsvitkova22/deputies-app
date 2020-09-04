import { Action } from '@ngrx/store';
import { AuthState } from '../models';

// tslint:disable-next-line: no-namespace
export namespace AUTH_ACTION {
    export const ADD_AUTH = 'ADD_AUTH';
    export const DELETE_AUTH = 'DELETE_AUTH';
}

export class AddAuth implements Action {
    readonly type = AUTH_ACTION.ADD_AUTH;

    constructor(public payload: AuthState) {}
}

export class DeleteAuth implements Action {
    readonly type = AUTH_ACTION.DELETE_AUTH;
}

export type AuthAction = AddAuth | DeleteAuth;
