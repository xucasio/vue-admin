import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost

export function fetchUserList(data) {
    return request({
        url: host + 'api/Account/queryuseraccount',
        method: 'post',
        data
    })
}
// /api/System/queryadminlist 超管获取管理员列表 关键字查询
export function fetchAdminList(data) {
    return request({
        url: host + 'api/System/queryadminlist',
        method: 'post',
        data
    })
}
// /api/System/deluseradmin 超管删除管理员
export function fetchAdminDel(UserAdminId) {
    return request({
        url: host + 'api/System/deluseradmin',
        method: 'post',
        data: UserAdminId
    })
}
// /api/System/adduseradmin 超管添加管理员
export function fetchAdminAdd(data) {
    return request({
        url: host + 'api/System/adduseradmin',
        method: 'post',
        data
    })
}

// /api/System/queryapplicationlist 获取所有产品
export function fetchAppList(data) {
    return request({
        url: host + 'api/System/queryapplicationlist',
        method: 'post',
        data
    })
}
// /api/System/addapplication 超管添加产品
export function fetchAppAdd(data) {
    return request({
        url: host + 'api/System/addapplication',
        method: 'post',
        data
    })
}
// /api/System/updateapplication 超管修改产品
export function fetchAppUpdate(data) {
    return request({
        url: host + 'api/System/updateapplication',
        method: 'post',
        data
    })
}
// /api/System/delapplication 超管删除产品
export function fetchAppDel(ApplicationId) {
    return request({
        url: host + 'api/System/delapplication',
        method: 'post',
        data: ApplicationId
    })
}

// //api/Account/queryuserinfo 查询账号列表 无分页 用户模糊搜索
export function fetchSearchUserList(params) {
    return request({
        url: host + 'api/Account/queryuserinfo',
        method: 'get',
        params
    })
}
// /api/System/queryadmintype 查询管理员类型
export function fetchAdminTypeList(data) {
    return request({
        url: host + 'api/System/queryadmintype',
        method: 'get'
    })
}
// /api/System/getapplicationlist 获取所有产品
export function fetchApplicationList(data) {
    return request({
        url: host + 'api/System/getapplicationlist',
        method: 'get'

    })
}

// /api/Admin/querybclientuser 查询B端管理员列表 关键字查询
export function fetchBClientUser(data) {
    return request({
        url: host + 'api/Admin/querybclientuser',
        method: 'post',
        data

    })
}
// /api/Admin/delbclientmanager 管理员删除B端管理员，但不踢出组织
export function fetchDelBclientManager(params) {
    return request({
        url: host + 'api/Admin/delbclientmanager',
        method: 'get',
        params
    })
}

// /api/System/getmenupoint 获取当前管理员类型的菜单功能树
export function fetchGetMenus(params) {
    return request({
        url: host + 'api/System/getmenupoint',
        method: 'get',
        params
    })
}
// /api/Account/setbclient B端管理员 将组织内的用户提升为管理
export function fetchBSetManager(data) {
    return request({
        url: host + 'api/Account/setbclient',
        method: 'post',
        data
    })
}
// /api/Account/deleteuserorganizaionrange 删除组织关系
export function fetchBDelOrgRelation(id) {
    return request({
        url: host + 'api/Account/delbclientuser',
        method: 'post',
        data: id
    })
}
// /api/Admin/querylikebclientuser 查询B端管理员列表, 默认查20条-用于实时输入匹配
export function fetchBQueryLike(params) {
    return request({
        url: host + 'api/Admin/querylikebclientuser',
        method: 'post',
        params
    })
}

// /api/System/queryextendparam 分页查询扩展参数列表
export function fetchQueryextendparam(data) {
    return request({
        url: host + 'api/System/queryextendparam',
        method: 'post',
        data
    })
}
// /api/System/deleteextendparam
export function fetchDelextendparam(id) {
    return request({
        url: host + 'api/System/deleteextendparam',
        method: 'post',
        data: { EXTENDPARAMID: id }
    })
}
// /api/System/addextendparam 扩展字段添加
export function fetchAddextendparam(data) {
    return request({
        url: host + 'api/System/addextendparam',
        method: 'post',
        data
    })
}
// /api/System/updateextendparam
export function fetchUpdateextendparam(data) {
    return request({
        url: host + 'api/System/updateextendparam',
        method: 'post',
        data
    })
}
// /api/System/queryapplicationextendparaminfos 查询产品扩展参数关系
export function fetchAppExtList(data) {
    return request({
        url: host + 'api/System/queryapplicationextendparaminfos',
        method: 'post',
        data
    })
}
// /api/System/eeleteapplicaitonextendparam 删除产品扩展参数关系
export function fetchDelAppExt(data) {
    return request({
        url: host + 'api/System/eeleteapplicaitonextendparam',
        method: 'post',
        data
    })
}
// /api/System/addapplicaitonextendparam  增加产品扩展参数关系
export function fetchAddAppExt(data) {
    return request({
        url: host + 'api/System/addapplicaitonextendparam',
        method: 'post',
        data
    })
}
// /api/System/updateapplicaitonextendparam  xiugai 产品扩展参数关系
export function fetchUpdateAppExt(data) {
    return request({
        url: host + 'api/System/updateapplicaitonextendparam',
        method: 'post',
        data
    })
}
