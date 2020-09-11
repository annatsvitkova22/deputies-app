import { District, Party } from "./deputies.model";

export interface AuthUser {
    userId: string;
    role: string;
    email: string;
}

export interface AuthState {
    isAuth: boolean;
    user: AuthUser;
}

export interface CreateUser {
    email: string;
    password: string;
    name: string;
}

export interface ChangeEmail {
    userId: string;
    oldUserEmail: string;
    newUserEmail: string;
}

export interface UserModel {
    id: string;
    name: string;
    surname?: string;
    patronymic?: string;
    district?: string ;
    party?: string;
    description?: string;
    imageUrl?: string;
    date?: DateModel;
}

export interface UserFormModel {
    id: string;
    name: string;
    surname?: string;
    patronymic?: string;
    district?: District;
    party?: Party;
    description?: string;
    date?: DateModel;
}

export interface DateModel {
    day: number;
    month: number;
    year: number;
}
