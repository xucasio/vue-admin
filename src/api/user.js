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
// /api/Role/queryrolelist 查询角色范围列表
export function fetchRoleList(data) {
    return request({
        url: host + 'api/Role/queryrolelist',
        method: 'post',
        data
    })
}

// /api/Account/accountadd 新增账户信息
export function fetchUserAdd(data) {
    return request({
        url: host + 'api/Account/accountadd',
        method: 'post',
        data
    })
}
// /api/Account/accountallinfo 获取账户相关信息
export function fetchUserInfo(userid) {
    return request({
        url: host + 'api/Account/accountallinfo',
        method: 'get',
        params: {
            userid
        }
    })
}
// 修改个人信息
export function updateUserExtenInfo(data) {
    return request({
        url: host + 'api/Account/accountupdate',
        method: 'post',
        data
    })
}
// 修改密码
export function fetchUpdatePwd(data) {
    return request({
        url: host + 'api/Account/useruppass',
        method: 'post',
        data
    })
}

// /api/System/queryuserextendparambyuserid 通过UserID查询用户扩展参数
export function fetchUserExtenInfo(UserID, ApplicaitonMark) {
    return request({
        url: host + 'api/System/queryuserextendparambyuserid',
        method: 'get',
        params: {
            UserID,
            ApplicaitonMark
        }
    })
}
// /api/Account/loginout 强制下线
export function fetchUserLoginout(userid) {
    return request({
        url: host + 'api/Account/loginoutauth',
        method: 'get',
        params: {
            userid
        }
    })
}
// /api/Account/setuserrole 后台设置用户角色
export function fetchUserSetUserRole(data) {
    return request({
        url: host + 'api/Account/setuserrole',
        method: 'post',
        data
    })
}
// /api/Account/setuserright 后台设置用户权限
export function fetchUserSetUserRight(data) {
    return request({
        url: host + 'api/Account/setuserright',
        method: 'post',
        data
    })
}
// /api/Account/deluserrole  删除用户角色
export function fetchUserDeleteUserRole(UserId, RoleId) {
    return request({
        url: host + 'api/Account/deluserrole',
        method: 'get',
        params: {
            UserId, RoleId
        }
    })
}
// /api/Account/deluserright 删除用户权限
export function fetchUserDeleteUserRight(UserId, RightId, Primarykey) {
    return request({
        url: host + 'api/Account/deluserright',
        method: 'get',
        params: {
            UserId, RightId, Primarykey
        }
    })
}
// /api/Account/renewaluserrole 续期用户角色
export function fetchUserDelayRole(data) {
    return request({
        url: host + 'api/Account/renewaluserrole',
        method: 'post',
        data
    })
}
// /api/Account/renewaluserrole 续期用户权限
export function fetchUserDelayRight(data) {
    return request({
        url: host + 'api/Account/renewaluserright',
        method: 'post',
        data
    })
}

// /api/Account/renewaluserrole 续期用户角色 角色范围
export function fetchUserAdminDelayRole(data) {
    return request({
        url: host + 'api/Admin/renewaladminuserrole',
        method: 'post',
        data
    })
}
// /api/Account/renewaluserrole 续期用户权限 权限范围
export function fetchUserAdminDelayRight(data) {
    return request({
        url: host + '/api/Admin/renewaladminuserright',
        method: 'post',
        data
    })
}
// /api/Auth/queryadmintypeinfoauhtrange 查找指定管理员权限范围
export function fetchUserRightList(data) {
    return request({
        url: host + 'api/Auth/queryadmintypeinfoauhtrangeauth',
        method: 'post',
        data
    })
}
// /api/Account/downloadfile 下载Excel批量导入用户模板
export function fetchUserDownloadfile(data) {
    return request({
        url: host + 'api/Account/downloadfile',
        method: 'get',
        data
    })
}
// /api/Account/batchadduser Excel 批量新增用户
export function fetchUserImports(data) {
    return request({
        url: host + 'api/Account/batchadduser',
        method: 'post',
        data,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 2 * 60 * 1000 // 单独设置超时
    })
}
// /api/Account/batchbclientuserorganizaionrange 批量导入新用户 同时加入组织
export function fetchBUserImports(data) {
    return request({
        url: host + 'api/Account/batchbclientuserorganizaionrange',
        method: 'post',
        data,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 2 * 60 * 1000 // 单独设置超时
    })
}
// /api/Account/exportqueryuser 账户列表导出
export function fetchUserExport(data) {
    return request({
        url: host + 'api/Account/exportqueryuser',
        method: 'post',
        data
    })
}
// /api/Account/resetuserpass 重置密码
export function fetchUserResetPwd(data) {
    return request({
        url: host + 'api/Account/resetuserpassauth',
        method: 'post',
        data
    })
}
// 查询B端管理员列表
export function fetchBUserList(data) {
    return request({
        url: host + 'api/Admin/querybclientuser',
        method: 'post',
        data
    })
}
// 查询B端产品身份列表 - B端超管权柄
export function fetchBUserListAdmin(data) {
    return request({
        url: host + 'api/Admin/querybclientadmin',
        method: 'post',
        data
    })
}
// 新增B端管理
export function addBUser(data) {
    return request({
        url: host + 'api/Account/setbclienttoadmin',
        method: 'post',
        data
    })
}
// 删除B端管理员
export function deleteBUser(params) {
    return request({
        url: host + 'api/Admin/delbclientmanager',
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}
// B端管理员设置信息
export function detailBUser(userId, adminTypeInfoId) {
    return request({
        url: host + 'api/Admin/adminallinfo',
        method: 'get',
        params: {
            userId,
            adminTypeInfoId
        }
    })
}
// 管理员 后台设置用户角色
export function fetchUserSetBUserRole(data) {
    return request({
        url: host + 'api/Admin/setadminuserrolerange',
        method: 'post',
        data
    })
}
// 管理员 后台设置用户权限
export function fetchUserSetBUserRight(data) {
    return request({
        url: host + 'api/Admin/setadminuserrightrange',
        method: 'post',
        data
    })
}
// 管理员  删除用户角色
export function fetchUserDeleteBUserRole(AdminTypeInfoId, RoleId) {
    return request({
        url: host + 'api/Admin/deladminuserrole',
        method: 'get',
        params: {
            AdminTypeInfoId, RoleId
        }
    })
}
// 管理员 删除用户权限
export function fetchUserDeleteBUserRight(AdminTypeInfoId, RightId) {
    return request({
        url: host + 'api/Admin/deladminuserright',
        method: 'get',
        params: {
            AdminTypeInfoId, RightId
        }
    })
}
// 管理员详情列表
export function fetchUserDeleteBUserDetail(data) {
    return request({
        url: host + 'api/Admin/getorguserlist',
        method: 'post',
        data
    })
}

// 管理员变更

export function fetchAdminUserChange(data) {
    return request({
        url: host + 'api/Admin/adminuserchange',
        method: 'post',
        data
    })
}
// /api/Admin/adminuserchangeaccount B端超管 管理账号数量修改
export function fetchAdminUserCountChange(data) {
    return request({
        url: host + 'api/Admin/adminuserchangeaccount',
        method: 'post',
        data
    })
}
// api/Account/queryuserinfo 查询账号列表 无分页,默认查20条-用于实时输入匹配
export function queryUserInfo(params) {
    return request({
        url: host + 'api/Account/queryuserinfo',
        method: 'get',
        params
    })
}

// /api/Account/accountupdate 修改账户信息 不涉及到角色权限
export function queryUserUpdate(data) {
    return request({
        url: host + 'api/Account/accountupdate',
        method: 'post',
        data
    })
}
// /api/Account/accountaddandjoinorgan 添加新账户 同时加入组织
export function queryAddBuser(data) {
    return request({
        url: host + 'api/Account/accountaddandjoinorgan',
        method: 'post',
        data
    })
}

// /api/User/existsname 校验用户名是否存在
export function fetchExistsname(name) {
    return request({
        url: host + 'api/User/existsname',
        method: 'get',
        params: {
            name
        }
    })
}

// api/User/existsphone 校验手机号码是否存在
export function fetchExistsphone(phone) {
    return request({
        url: host + 'api/User/existsphone',
        method: 'get',
        params: {
            phone
        }
    })
}
// /api/Account/adduserorganizaionrange 增加用户组织关系
export function fetchAddBuserToOrg(data) {
    return request({
        url: host + 'api/Account/adduserorganizaionrangeauth',
        method: 'post',
        data
    })
}
// /api/Account/batchimportuserorganizaionrange  批量导入用户组织关系
export function fetchBUserImportsOrg(data) {
    return request({
        url: host + 'api/Account/batchimportuserorganizaionrange',
        method: 'post',
        data,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 2 * 60 * 1000 // 单独设置超时
    })
}
// api/Admin/deladmintypeinfo   删除B端超管身份
export function fetchDeleteBuserAdmin(data) {
    return request({
        url: host + 'api/Admin/deladmintypeinfo',
        method: 'post',
        data
    })
}
// api/Admin/querylikebadminclientuser 添加B端超管 模糊匹配组织、学校 -用于实时输入匹配
export function fetchUserOrganizaionRange(params) {
    return request({
        url: host + 'api/Admin/querylikebadminclientuser',
        method: 'get',
        params,
        header: {
            'Content-Type': 'text/plain;charset=UTF-8'
        }
    })
}

// /api/Account/accountsetstatus 禁用启用，可批量
export function fetchUserState(data) {
    return request({
        url: host + 'api/Account/accountsetstatus',
        method: 'post',
        data
    })
}
// 查询管理员密钥列表
export function fetchInfoSecretkeyList(params) {
    return request({
        url: host + 'api/Admin/getinfosecretkeylist',
        method: 'get',
        params
    })
}
// 生成密钥
export function addInfoSecretkey(data) {
    return request({
        url: host + 'api/Admin/insertinfosecretkey',
        method: 'post',
        data
    })
}
// 删除密钥
export function delInfoSecretkey(params) {
    return request({
        url: host + 'api/Admin/delinfosecretkey',
        method: 'post',
        params
    })
}
// 激活密钥
export function activeInfoSecretkey(data) {
    return request({
        url: host + 'api/Admin/activesecretkey',
        method: 'post',
        data
    })
}
// /api/Account/cancelbindweixin 微信解绑
export function fetchCancelWx() {
    return request({
        url: host + 'api/Account/cancelbindweixin',
        method: 'get'

    })
}
// 查询管理员标签列表

export function fetchLabelList(data) {
    return request({
        url: host + 'api/Label/querylabelinfosauth',
        method: 'post',
        data
    })
}
// 设置账号标签
export function fetchUserSetUserLabel(data) {
    return request({
        url: host + 'api/Label/batchadduserLabelrelationauth',
        method: 'post',
        data
    })
}
// 删除账号标签
export function fetchUserDeleteUserLabel(UserID, LabelID) {
    return request({
        url: host + 'api/Label/deleteuserLabelrelationauth',
        method: 'post',
        data: {
            UserID, LabelID

        }
    })
}

// /api/System/queryuserupdatepasswordmessage
export function fetchUpdatePWDTip(UserID) {
    return request({
        url: host + 'api/System/queryuserupdatepasswordmessage',
        method: 'get',
        params: {
            UserID

        }
    })
}
