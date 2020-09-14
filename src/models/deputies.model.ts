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

export interface Appeal {
    title: string;
    description: string;
    deputyId: string;
    districtId: string;
    userId: string;
    status: string;
    date: string;
}