import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.host
const adminhost = api.adminhost
const upmshost = api.upmshost

export function fetchLoginByUserName(username, password) {
    return request({
        url: host + '/api/Login',
        method: 'post',
        params: {
            userName: username,
            password: password,
            mac: '1'
        }
    })
}
export function fetchLoginByToken(token) {
    return request({
        url: host + '/api/Login/LoginByToken',
        method: 'post',
        params: {
            token
        }
    })
}

// 登出
export function fetchLoginOut() {
    return request({
        url: upmshost + '/api/User/logout',
        method: 'get'
    })
}

// 登出
export function fetchUpmsLogin(data) {
    return request({
        url: upmshost + 'api/User/loginredirect',
        method: 'get',
        params: data
    })
}

// 登出
export function fetchUpmsSendCode(phone, id) {
    return request({
        url: upmshost + 'api/user/SendPhoneCode',
        method: 'get',
        params: {
            phone,
            verificationType: id
        }
    })
}

// LoginByPhoneCode
export function fetchUpmsLoginByPhoneCode(mobilePhone, phoneCode, applicationMark) {
    return request({
        url: upmshost + 'api/User/loginbyphonecode',
        method: 'get',
        params: {
            mobilePhone,
            phoneCode,
            applicationMark
        }
    })
}
// /user/existsnameorphone
export function fetchUpmsExistsnameorphone(name) {
    return request({
        url: upmshost + 'api/user/existsnameorphone',
        method: 'get',
        params: {
            name
        }
    })
}

// /user/existsnameorphone
export function fetchUpmsChangePassword(data) {
    return request({
        url: upmshost + 'api/user/ChangePassWordByPhone',
        method: 'post',
        data
    })
}
// /api/User/getreqip 获取请求IP
export function fetchUpmsGetIP() {
    return request({
        url: upmshost + 'api/User/getreqip',
        method: 'get'

    })
}
// isexistencephonecode
export function fetchUpmsPhoneAndCode(data) {
    return request({
        url: upmshost + 'api/User/isexistencephonecode',
        method: 'post',
        data

    })
}
// 判断用户名是否已经被用
export function fetchUpmsCheckUserName(name) {
    return request({
        url: upmshost + 'api/User/existsname',
        method: 'get',
        params: {
            name
        }

    })
}

// /api/User/isexistsloginnamecode 校验用户名是否存在，验证码是否匹配
export function fetchUpmsCheckPhoneReg(name, code) {
    return request({
        url: upmshost + 'api/User/isexistsloginnamecode',
        method: 'get',
        params: {
            LoginName: name,
            PhoneCode: code,
            verificationType: 1
        }

    })
}
// /api/User/register 用户注册
export function fetchUpmsRegisterUser(data) {
    return request({
        url: upmshost + 'api/User/register',
        method: 'post',
        data
    })
}

// /api/User/bindingweixinuser
export function fetchUpmsBindingweixinuser(data) {
    return request({
        url: upmshost + 'api/User/bindingweixinuser',
        method: 'post',
        data

    })
}

// /api/User/changepasswordbyphone 通过手机验证码修改对应手机帐号密码
export function fetchUpmsChangepasswordbyphone(data) {
    return request({
        url: upmshost + 'api/User/changepasswordbyphone',
        method: 'post',
        data

    })
}

// /api/Account/adminlogin 管理后台登录
export function fetchUpmsAdminLogin(data) {
    return request({
        url: upmshost + 'api/Account/adminlogin',
        method: 'post',
        data
    })
}
// /api/Account/getadmintypeinfolistbytoken 根据token获取 管理身份列表
export function fetchUpmsAdminIndList(token) {
    return request({
        url: upmshost + 'api/Account/getadmintypeinfolistbytoken',
        method: 'get',
        params: {
            token
        }
    })
}
// 通过token绑定，更新手机号码
export function changemobilephone(data) {
    return request({
        url: adminhost + 'api/User/changemobilephone',
        method: 'post',
        data
    })
}

// 通过token绑定，更新手机号码
export function getadminmobilephone(data) {
    return request({
        url: upmshost + 'api/Account/getadminmobilephone',
        method: 'get',
        params: data
    })
}
