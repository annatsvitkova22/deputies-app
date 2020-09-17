import { Action } from '@ngrx/store';

import { Settings } from '../models/settings.model';

// tslint:disable-next-line: no-namespace
export namespace SETTINGS_ACTION {
    export const EDIT_SETTINGS = 'EDIT_SETTINGS';
}

export class EditSettings implements Action {
    readonly type = SETTINGS_ACTION.EDIT_SETTINGS;

    constructor(public payload: Settings) {}
}

export type SettingsAction =  EditSettings;
