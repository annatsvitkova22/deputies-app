import { District } from './deputies.model';

export interface Settings {
    sorting?: string;
    districts?: District[];
    statuses?: string[];
    date?: number;
}
