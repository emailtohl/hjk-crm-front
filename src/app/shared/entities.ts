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
    public authenticated: boolean;
    public authorities: Array<any>;
    public credentials: any;
    public details: { remoteAddress: string, sessionId: string };
    public name: string;
    public principal: {
        accountNonExpired: boolean,
        accountNonLocked: boolean,
        authorities: Array<any>;
        credentialsNonExpired: boolean;
        enabled: boolean;
        password: string;
        username: string;
    };

    public static getUserId(principal: Principal): string {
        if (!principal.name) {
            return '';
        }
        return principal.name.split(':')[0];
    }

    public static getUserName(principal: Principal): string {
        if (!principal.name) {
            return '';
        }
        const arr = principal.name.split(':');
        return arr[1] ? arr[1] : '';
    }

    public static getUserGroups(principal: Principal): Array<string> {
        if (!principal.name) {
            return [];
        }
        const arr = principal.name.split(':');
        if (!arr[2]) {
            return [];
        }
        return arr[2].split(',');
    }
}

export class Check {
    // 所处节点
    public taskDefinitionKey: string;
    // 所审核的任务名
    public taskName: string;
    // 审核人id
    public checkerId: string;
    // 审核是否通过
    public checkApproved: boolean;
    // 审核意见
    public checkComment: string;
    // 审核时间
    public checkTime: string;
}

export class Flow {
    // 业务主键
    public businessKey: string;
    // 关联Activiti的流程id
    public processInstanceId: string;
    // 表单号
    public flowNum: string;
    // 流程类型
    public flowType: string;
    // 申请人id
    public applyUserId: string;
    // 申请人姓名
    public applyUserName: string;
    // 历史的审核信息
    public checks: Array<Check> = [];
    // 是否成功完成还是终止
    public pass: Boolean;

    /* 下面与过程中的状态有关，不做存储 */
    // 当前任务id
    public taskId: string;
    // 任务的名字
    public taskName: string;
    // 当前任务签收人id
    public taskAssignee: string;
    // 当前任务签收人名字
    public taskAssigneeName: string;
    // 当前所在的活动id
    public taskDefinitionKey: string;
    // 下一个活动id
    public nextActivityId: string;
    // 下一个活动id
    public nextActivityName: string;
}
