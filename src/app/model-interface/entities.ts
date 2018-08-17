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
