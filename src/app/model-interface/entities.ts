import { Flow } from '../shared/entities';

export class Organization {
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
    credentials: Array<any>;
    // 备注
    remark: string;
    // 对接市场人员
    receiver: string;
    // 是否通过审批
    pass: boolean;

    // 与流程相关的信息
    flows: Array<Flow> = [];
}

export class Invoice {
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

    // 下面有开票人填写
    // 开票时间
    public ticketTime: string;
    // 开票内容
    public content: string;
    // 发票编号
    public invoiceNumber: string;

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
