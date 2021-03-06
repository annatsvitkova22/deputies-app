import { District, Party } from './deputies.model';

export interface AuthUser {
    userId?: string;
    role: string;
    name?: string;
    email: string;
    imageUrl: string;
    shortName: string;
}

export interface AuthState {
    isAuth: boolean;
    user: AuthUser;
}

export interface CreateUser {
    email: string;
    password: string;
    name: string;
    surname: string;
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

export interface UserAvatarForm {
    userForm: UserFormModel;
    userAvatar: UserAvatal;
}

export interface DateModel {
    day: number;
    month: number;
    year: number;
}

export interface SocialProfile {
    email: string;
    family_name?: string;
    given_name?: string;
    granted_scopes: string;
    hd: string;
    id: string;
    locale: string;
    name: string;
    picture?: string | PictureModal;
    verified_email: boolean;
}

export interface PictureModal {
    data: PictureFacebook;
}

export interface PictureFacebook {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
}

export interface UserAvatal {
    imageUrl: string;
    shortName: string;
}

export interface ChangePassword {
    oldPassword: string;
    password: string;
    repeatPassword: string;
}
