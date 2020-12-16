
import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost
// 查询登陆日志
export function fetchLoginLog(data) {
    return request({
        url: host + 'api/System/queryloginlog',
        method: 'post',
        data
    })
}
// 查询登陆日志
export function fetchOperationmodelLog(data) {
    return request({
        url: host + 'api/System/queryoperationmodellog',
        method: 'post',
        data
    })
}
// 更新登录来源
export function fetchUpdateLoginlog(params) {
    return request({
        url: host + 'api/System/updateloginlog',
        method: 'get',
        params
    })
}

// 消息通知
export function fetchSystemMessage(params) {
    return request({
        url: host + 'api/System/querysystemmessage',
        method: 'get',
        params
    })
}
// 消息通知
export function readMessage(params) {
    return request({
        url: host + 'api/System/updatesystemmessagestate',
        method: 'get',
        params
    })
}
