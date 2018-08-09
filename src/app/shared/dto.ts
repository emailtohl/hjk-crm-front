export class BaseEntity {
    public id: number;
    public createDate: string;
    public modifyDate: string;
    public version: number;
}

export class Group {
    public id: string;
    public name: string;
    public type: string;
}

export class User {
    public accountNonExpired: Boolean;
    public accountNonLocked: Boolean;
    public address: string;
    public age: number;
    public birthday: Date;
    public cellPhone: string;
    public createDate: Date;
    public credentialsNonExpired: Boolean;
    public description: string;
    public email: string;
    public enabled: Boolean;
    public gender: string;
    public groups: Group[];
    public id: number;
    public idNumber: string;
    public identityType: string;
    public image: Object;
    public lastChangeCredentials: Boolean;
    public lastLogin: Date;
    public modifyDate: Date;
    public name: string;
    public nickname: string;
    public password: string;
    public serialNumber: string;
}

export class Csrf {
    public headerName: string;
    public parameterName: string;
    public token: string;
}
