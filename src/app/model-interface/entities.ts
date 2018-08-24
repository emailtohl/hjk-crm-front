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
    // 身份类型
    public identityType: string;
    public idNumber: string;
    public name: string;
    // 可存储第三方昵称
    public nickname: string;
    // 编号
    public serialNumber: string;
    // 唯一识别、不能为空
    public email: string;
    public cellPhone: string;
    public password: string;
    public enabled: boolean;
    public accountNonExpired: boolean;
    public credentialsNonExpired: boolean;
    public accountNonLocked: boolean;
    // 最后一次登录时间
    public lastLogin: string;
    // 最后更改密码时间
    public lastChangeCredentials: string;
    public address: string;
    public birthday: string;
    public age: number;
    public gender: string;
    public image: { id: number };
    public description: string;
    public groups = new Set<string>();
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

export class Organization extends BaseEntity {
    // 创建人ID
    creatorId: string;
    // 创建人姓名
    creatorName: string;
    // 公司名
    name: string;
    // 税号
    taxNumber: string;
    // 公司注册地址
    address: string;
    // 公司电话
    telephone: string;
    // 开户行
    depositBank: string;
    // 开户行账号
    account: string;
    // 联系人，财务负责人
    principal: string;
    // 联系人，财务负责人联系电话
    principalPhone: string;
    // 收票地址，若不填写，则取公司所在地址
    deliveryAddress: string;
    // 上传的凭证
    credentials: Array<any> = [];
    // 备注
    remark: string;
    // 对接市场人员
    receiver: string;
    // 是否通过审批
    pass: boolean;
    // 干系人，他们都可以使用本公司信息
    stakeholders: Array<User> = [];

    // 与流程相关的信息
    flows: Array<Flow> = [];
}

export class Invoice extends BaseEntity {
    public type: string;
    // 开票公司
    public organization: Organization;

    // 下面是财务填写
    // 收款金额
    public income: number;
    // 收款时间
    public receiveTime: string;
    // 差旅费扣除
    public deduct: number;
    // 开票金额
    public ticketfee: number;
    // 税金
    public tax: number;
    // 明细
    public detail: string;

    // 下面由开票人填写
    // 开票时间
    public ticketTime: string;
    // 开票内容
    public content: string;
    // 发票编号
    public invoiceNumber: string;

    // 快递时间
    public expressTime: string;
    // 快递公司
    public expressCompany: string;
    // 快递单号
    public expressNumber: string;
    // 快递费
    public expressFee: number;
    // 垫付款
    public paymentOn: number;
    // 备注
    public remark: string;
    // 流程
    public flow: Flow;
}
