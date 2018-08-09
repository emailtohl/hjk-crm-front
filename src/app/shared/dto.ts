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

export class Csrf {
    public headerName: string;
    public parameterName: string;
    public token: string;
}
