import * as moment from 'moment';

import { Settings } from '../models';
import { SETTINGS_ACTION, SettingsAction, EditSettings } from './settings.action';

const initialState: Settings = {
    sorting: null,
    districts: null,
    statuses: null,
    date: null,
    parties: null,
};

export const settingsReducer = (state = initialState, action: SettingsAction) => {
    switch (action.type) {
        case SETTINGS_ACTION.EDIT_SETTINGS:
            const {payload}: EditSettings = action;
            const newState = {
                ...state,
                sorting: payload.sorting ? payload.sorting : state.sorting,
                districts: payload.districts ? payload.districts : state.districts,
                statuses: payload.statuses ? payload.statuses : state.statuses,
                date: payload.date ? payload.date : state.date,
                parties: payload.parties ? payload.parties : state.parties,
            };

            return newState;
        default:
            return state;
    }
}
