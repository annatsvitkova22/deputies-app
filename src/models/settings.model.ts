import { District, Select, Party } from './deputies.model';

export interface Settings {
    sorting?: string;
    districts?: District[];
    statuses?: Select[];
    parties?: Party[];
    date?: number;
}
