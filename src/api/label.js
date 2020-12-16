import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost

// /api/Label/querylabelinfos 查询管理员标签列表
export function fetchLabelList(data) {
    return request({
        url: host + 'api/Label/querylabelinfosauth',
        method: 'post',
        data
    })
}
// /api/Label/addLabel 新增标签
export function fetchLabelAdd(data) {
    return request({
        url: host + 'api/Label/addLabelauth',
        method: 'post',
        data
    })
}
// /api/Label/updatelabelauth 修改标签权限
export function fetchLabelUpdate(data) {
    return request({
        url: host + 'api/Label/updatelabelauthauth',
        method: 'post',
        data
    })
}
// /api/Label/queryLabeluser 查询标签用户列表
export function fetchLabelQueryLabeluser(data) {
    return request({
        url: host + 'api/Label/queryLabeluserauth',
        method: 'post',
        data
    })
}
// /api/Label/updateLabelstate 修改标签状态
export function fetchLabelUpdateState(data) {
    return request({
        url: host + 'api/Label/updateLabelstateauth',
        method: 'post',
        data
    })
}
// /api/Label/querylabelauth 查询标签权限
export function fetchQuerylabelauth(LabelID) {
    return request({
        url: host + 'api/Label/querylabelauthauth',
        method: 'get',
        params: { LabelID }
    })
}
// /api/Label/querylabelinfo 查询指定标签信息
export function fetchQuerylabelinfo(LabelID) {
    return request({
        url: host + 'api/Label/querylabelinfoauth',
        method: 'get',
        params: { LabelID }
    })
}
// /api/Label/refLabelmark 生成口令
export function fetchRefLabelmark(LabelID) {
    return request({
        url: host + 'api/Label/refLabelmarkauth',
        method: 'post',
        data: { LabelID }
    })
}

// /api/Label/queryorganizaionapply 管理员流程列表查询
export function fetchQueryorganizaionapply(data) {
    return request({
        url: host + 'api/Label/queryorganizaionapplyauth',
        method: 'post',
        data
    })
}

// /api/Label/approvalLabel 流程审批
export function fetchApprovalLabel(data) {
    return request({
        url: host + 'api/Label/approvalLabelauth',
        method: 'post',
        data
    })
}
// /api/Label/queryuserorganizaionapply 用户流程列表查询
export function fetchQueryuserorganizaionapply(data) {
    return request({
        url: host + 'api/Label/queryuserorganizaionapplyauth',
        method: 'post',
        data
    })
}
// /api/Label/activationLabel 激活口令
export function fetchActivationLabel(data) {
    return request({
        url: host + 'api/Label/activationLabelauth',
        method: 'post',
        data
    })
}
// /api/Account/queryuserorganizaionrange 查询用户所属组织列表
export function fetchOrgList(data) {
    return request({
        url: host + 'api/Account/queryuserorganizaionrangeauth',
        method: 'post',
        data
    })
}
// /api/Account/deleteuserorganizaionrange 删除组织关系
export function fetchOrgRelationDel(data) {
    return request({
        url: host + 'api/Account/deleteuserorganizaionrangeauth',
        method: 'post',
        data
    })
}
