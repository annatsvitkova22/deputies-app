export interface District {
    id: string;
    name: string;
}

export interface Party {
    id: string;
    name: string;
}

export interface UserAccount {
    id: string;
    name: string;
    email?: string;
    patronymic?: string;
    description?: string;
    district?: string;
    party?: string;
    imageUrl?: string;
    date?: CustomDate;
    rating?: number;
    shortName?: string;
}
export interface Deputy {
    id: string;
    name: string;
    patronymic?: string;
    description?: string;
    district?: string;
    party?: string;
    imageUrl?: string;
    date?: CustomDate;
    rating?: number;
    shortName?: string;
}

export interface CustomDate {
    day: number;
    month: number;
    year: number;
}

export interface Appeal {
    title: string;
    description: string;
    deputyId: string;
    districtId: string;
    userId: string;
    status: string;
    date: string;
    fileUrl?: string[];
    fileImageUrl?: string[];
}

export interface AppealCard {
    title: string;
    description: string;
    deputyName: string;
    deputyImageUrl?: string;
    shortName?: string;
    party: string;
    userName?: string;
    shortNameUser?: string;
    userImageUrl?: string;
    status: string;
    date: string;
    countFiles: number;
    countComments: number;
}

export interface LoadedFile {
    imageUrl?: string;
    pathFile?: string;
    name?: string;
    size?: string;
}

export interface Select {
    id: string;
    name: string;
}

export interface CountAppeals {
    name: string;
    count: number;
}
