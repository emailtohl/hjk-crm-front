export class Flow {
    processInstanceId: string;
    // 表单号
    flowNum: string;
    // 流程类型
    flowType: string;
    // 申请人id
    applyUserId: string;
    // 申请人姓名
    applyUserName: string;
    // 历史的审核信息
    checks = new Set<Check>();
}

export class Check {
    // 所处节点
    taskDefinitionKey: string;
    // 所审核的任务名
    taskName: string;
    // 审核人id
    checkerId: string;
    // 审核人姓名
    checkerName: string;
    // 审核是否通过
    checkApproved: boolean;
    // 审核意见
    checkComment: string;
    // 审核时间
    checkTime: string;
}
