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
    district: string;
}
