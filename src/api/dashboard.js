import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost

// 用户分析统计
export function fetchUserinfoStatistic(params) {
    return request({
        url: host + 'api/Statistics/queryuserinfostatistic',
        method: 'get',
        params
    })
}

// 用户分析图表
export function queryUserStatistics(params) {
    return request({
        url: host + 'api/Statistics/queryuserstatistics',
        method: 'get',
        params
    })
}
// 用户权限统计
export function fetchAuthorityTotal(params) {
    return request({
        url: host + 'api/Statistics/queryauthoritytotal',
        method: 'get',
        params
    })
}
// 查询B端管理员组织个数

export function fetchBclientOrganizaiontotal(params) {
    return request({
        url: host + 'api/Statistics/querybclientorganizaiontotal',
        method: 'get',
        params
    })
}
// 查询标签统计结果
export function fetchLabelStatisticinfo(params) {
    return request({
        url: host + 'api/Statistics/querylabelstatisticinfo',
        method: 'get',
        params
    })
}

// 查询统计结果
export function fetchStatisticinfo(data) {
    return request({
        url: host + 'api/Statistics/querystatisticinfo',
        method: 'post',
        data
    })
}

// 查询统计权限 (不分页)(规则)
export function fetchStatisticsauthorityinfos(params) {
    return request({
        url: host + 'api/Statistics/querystatisticsauthorityinfos',
        method: 'get',
        params
    })
}
// 查询统计权限 (分页)
export function querystatisticsauthorityinfosdata(data) {
    return request({
        url: host + 'api/Statistics/querystatisticsauthorityinfosdata',
        method: 'post',
        data
    })
}
// 新增统计权限信息
export function addstatisticsauthorityinfo(data) {
    return request({
        url: host + 'api/Statistics/addstatisticsauthorityinfo',
        method: 'post',
        data
    })
}
// 修改统计权限信息
export function updatestatisticsauthorityinfo(data) {
    return request({
        url: host + 'api/Statistics/updatestatisticsauthorityinfo',
        method: 'post',
        data
    })
}
// 修改统计权限信息（用于删除和禁用）
export function updatestatisticsauthoritystatus(data) {
    return request({
        url: host + 'api/Statistics/updatestatisticsauthoritystatus',
        method: 'post',
        data
    })
}

// 查询统计详情
export function fetchStatisticdetails(data) {
    return request({
        url: host + 'api/Statistics/querystatisticdetails',
        method: 'post',
        data
    })
}
// 查找指定统计权限详情
export function querystatisticsauthorityinfobyid(params) {
    return request({
        url: host + 'api/Statistics/querystatisticsauthorityinfobyid',
        method: 'get',
        params
    })
}
// 权限id获取角色列表
export function getroleinfosbyauthoriytid(data) {
    return request({
        url: host + 'api/Role/getroleinfosbyauthoriytid',
        method: 'post',
        data
    })
}

