
import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost
// 权限通知组织列表
export function fetchNoticeOrgList(data) {
    return request({
        url: host + 'api/Label/queryorganizaionexpireauthority',
        method: 'post',
        data
    })
}
// 权限通知个人列表
export function fetchNoticePersonalList(data) {
    return request({
        url: host + 'api/Label/queryorganizaionexpireuserauthority',
        method: 'post',
        data
    })
}
