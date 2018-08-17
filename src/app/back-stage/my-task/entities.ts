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
    public checks = new Set<Check>();

    // 当前任务id
    public taskId: string;
    // 任务的名字
    public taskName: string;
    // 当前任务签收人的ID
    public taskAssignee: string;
    // 当前任务签收人的名字
    public taskAssigneeName: string;
    // 当前所在的活动id
    public taskDefinitionKey: string;
    // 下一个活动id
    public nextActivityId: string;
    // 下一个活动id
    public nextActivityName: string;
}

export class Check {
    // 所处节点
    public taskDefinitionKey: string;
    // 所审核的任务名
    public taskName: string;
    // 审核人id
    public checkerId: string;
    // 审核人姓名
    public checkerName: string;
    // 审核是否通过
    public checkApproved: boolean;
    // 审核意见
    public checkComment: string;
    // 审核时间
    public checkTime: string;
}
