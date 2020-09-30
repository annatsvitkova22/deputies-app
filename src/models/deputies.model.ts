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
    date: number;
    updateDate: number;
    fileUrl?: string[];
    fileImageUrl?: string[];
    isBlock?: boolean;
    location?: Location;
}

export interface AppealCard {
    id?: string;
    title: string;
    description?: string;
    deputyId?: string;
    deputyName?: string;
    deputyImageUrl?: string;
    shortName?: string;
    party?: string;
    userName?: string;
    shortNameUser?: string;
    userImageUrl?: string;
    userId?: string;
    status?: string;
    date?: string;
    countFiles?: number;
    countComments?: number;
    fileUrl?: string[];
    fileImageUrl?: string[];
    location?: Location;
}

export interface LoadedFile {
    imageUrl?: string;
    pathFile?: string;
    name?: string;
    size?: string;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Select {
    id: string;
    name: string;
}

export interface CountAppeals {
    name: string;
    count: number;
}

export interface Comment {
    type?: string;
    message?: string;
    date?: number | string;
    rating?: number;
    appealId?: string;
    userId?: string;
    imageUrl?: string;
    shortName?: string;
    autorName?: string;
    isBackground?: boolean;
    loadedFiles?: LoadedFile[];
}

export interface ResultComment {
    status: boolean;
    comment?: Comment;
}

export interface BlockAppeal {
    id: string;
}
