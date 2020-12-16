import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost
// 权限树
export function fetchAuthTree(data) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangetree',
        method: 'post',
        data
    })
}

// 权限列表
export function fetchAuthList(data) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangeauth',
        method: 'post',
        data
    })
}
// 新增的权限列表(用于B端和普通用户)
export function fetchAuthnewList(data) {
    return request({
        url: host + 'api/Auth/querybclientauthlist',
        method: 'post',
        data
    })
}

// 按节点id获取下级树
export function getchildsById(id) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangetreebyparent',
        method: 'get',
        params: {
            AuthId: id
        }
    })
}
// 角色列表
export function fetchRoleList(data) {
    return request({
        url: host + 'api/Role/queryrolelist',
        method: 'post',
        data
    })
}
// 新增角色
export function createRole(data) {
    return request({
        url: host + 'api/Role/addorupdaterole',
        method: 'post',
        data
    })
}
// 删除角色
export function deleterole(id) {
    return request({
        url: host + '/api/Role/deleterole',
        method: 'post',
        data: id,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}
// 管理员列表
export function fetchAdminlist() {
    return request({
        url: host + 'api/Role/getadmintypeinfobytype',
        method: 'get'
    })
}
// 默认权限列表
export function fetchDefaultAuthlist(data) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfodefaultauth',
        method: 'post',
        data
    })
}
// 批量新增默认权限
export function addAdminDefaultAuth(data) {
    return request({
        url: host + 'api/Auth/addAdmindefaultauht',
        method: 'post',
        data
    })
}
// 删除权限
export function deleteDefaultAuth(id) {
    return request({
        url: host + 'api/Auth/delAdmindefaultauth',
        method: 'post',
        data: id,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}

// 新增权限
export function createAuth(data) {
    return request({
        url: host + 'api/Auth/addorupdateauth',
        method: 'post',
        data
    })
}
// 删除权限
export function deleteAuth(id) {
    return request({
        url: host + 'api/Auth/delauth',
        method: 'post',
        data: id,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}

// 获取所有产品
export function fecthApplicationList() {
    return request({
        url: host + 'api/System/getapplicationlist',
        method: 'get'
    })
}

// 特殊管理员 新增权限
export function fetchUserSetBUserRight(data) {
    return request({
        url: host + 'api/Admin/setadminuserrightrange',
        method: 'post',
        data
    })
}

// 特殊管理员 删除权限
export function fetchUserDeleteBUserRight(AdminTypeInfoId, RightId) {
    return request({
        url: host + 'api/Admin/deladminuserright',
        method: 'get',
        params: {
            AdminTypeInfoId, RightId
        }
    })
}
// 失焦校验权限标识

export function validMark(params) {
    return request({
        url: host + 'api/Auth/checkliveinputmark',
        method: 'get',
        params
    })
}

// 获取角色权限信息
export function getRoleAuths(params) {
    return request({
        url: host + 'api/Role/getroleauthinfo',
        method: 'get',
        params
    })
}
// 获取批量导入角色
export function fetchRoleImports(data) {
    return request({
        url: host + 'api/Role/batchaddrole',
        method: 'post',
        data,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 2 * 60 * 1000 // 单独设置超时
    })
}
// api/Role/getroledtlinfo 获取角色详情
export function getRoleinfoById(id) {
    return request({
        url: host + 'api/Role/getroledtlinfo',
        method: 'get',
        params: {
            RoleId: id
        }
    })
}
// 权限列表转树统一接口

export function fetchAuthListNew(data) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangetree',
        method: 'post',
        data
    })
}
// 权限列表转树统一节点懒加载接口

export function queryadmintypeinfoauhtrangetreebyparent(params) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangetreebyparent',
        method: 'get',
        params
    })
}
