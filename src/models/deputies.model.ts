export interface District {
    id: string;
    name: string;
}

export interface Party {
    id: string;
    name: string;
}

export interface Deputy {
    id: string;
    name: string;
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
}

export interface AppealCard {
    title: string;
    description: string;
    deputyName: string;
    deputyImageUrl?: string;
    shortName?: string;
    party: string;
    userName: string;
    status: string;
    date: string;
    countFiles: number;
    countComments: number;
}
