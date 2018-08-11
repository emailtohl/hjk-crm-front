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

export class User extends BaseEntity {
    public accountNonExpired: Boolean;
    public accountNonLocked: Boolean;
    public address: string;
    public age: number;
    public birthday: Date;
    public cellPhone: string;
    public credentialsNonExpired: Boolean;
    public description: string;
    public email: string;
    public enabled: Boolean;
    public gender: string;
    public groups: string[];
    public id: number;
    public idNumber: string;
    public identityType: string;
    public image: Object;
    public lastChangeCredentials: Boolean;
    public lastLogin: Date;
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

export class Principal {
    authenticated: boolean;
    authorities: Array<any>;
    credentials: any;
    details: {remoteAddress: string, sessionId: string};
    name: string;
    principal: {
        accountNonExpired: boolean,
        accountNonLocked: boolean,
        authorities: Array<any>;
        credentialsNonExpired: boolean;
        enabled: boolean;
        password: string;
        username: string;
    };
}
