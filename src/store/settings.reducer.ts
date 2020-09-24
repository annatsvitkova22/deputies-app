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
                sorting: payload.sorting !== undefined  ? payload.sorting : state.sorting,
                districts: payload.districts !== undefined ? payload.districts : state.districts,
                statuses: payload.statuses !== undefined ? payload.statuses : state.statuses,
                date: payload.date !== undefined ? payload.date : state.date,
                parties: payload.parties !== undefined ? payload.parties : state.parties,
            };

            return newState;
        default:
            return state;
    }
}
