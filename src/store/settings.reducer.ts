import * as moment from 'moment';

import { Settings } from '../models';
import { SETTINGS_ACTION, SettingsAction, EditSettings } from './settings.action';

const initialState: Settings = {
    sorting: null,
    districts: null,
    statuses: null,
    date: moment({h: 0, m: 0, s: 0, ms: 0}).valueOf()
};

export const settingsReducer = (state = initialState, action: SettingsAction) => {
    switch (action.type) {
        case SETTINGS_ACTION.EDIT_SETTINGS:
            const {payload}: EditSettings = action;
            const newState = {
                ...state,
                sorting: payload.sorting ? payload.sorting : null,
                districts: payload.districts ? payload.districts : null,
                statuses: payload.statuses ? payload.statuses : null,
                date: payload.date ? payload.date : moment({h: 0, m: 0, s: 0, ms: 0}).valueOf(),
            };

            return newState;

        default:
            return state;
    }
}
