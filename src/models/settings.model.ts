import { District, Select } from './deputies.model';

export interface Settings {
    sorting?: string;
    districts?: District[];
    statuses?: Select[];
    date?: number;
}
