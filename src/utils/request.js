import axios from 'axios'
import { Message } from 'element-ui'
import { getStorage, clearStorage } from '@/utils/auth'
import common from './common.js'
import Router from '@/pages/index/router'
// create an axios instance
const service = axios.create({
    baseURL: '', // api的base_url
    timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // 兼容ie请求不走缓存的
        if (config.url.indexOf('?') > -1) {
            config.url = config.url + '&t=' + Date.now()
        } else {
            config.url = config.url + '?t=' + Date.now()
        }
        var url = config.url
        const Token = getStorage('TOKEN')
        const typeid = getStorage('TYPEID')
        const typeinfoid = getStorage('PTYPEID')
        if (Token) {
            url = common.addUrlParm(url, 'token', Token)
        }
        typeid && (url = common.addUrlParm(url, 'typeid', typeid))
        typeinfoid && (url = common.addUrlParm(url, 'typeinfoid', typeinfoid))
        // config.headers.token = getStorage('TOKEN')
        // config.headers.typeid = getStorage('TYPEID')
        // config.headers.typeinfoid = getStorage('PTYPEID')
        config.headers[ 'Cache-Control'] = 'no-cache'
        config.headers[ 'Content-Type'] = 'application/json; charset=utf-8'
        config.url = url
        return config
    },
    error => {
    // Do something with request error
        Promise.reject(error)
    }
)

// respone interceptor
service.interceptors.response.use(
    response => {
    // 根据http状态码判断请求
        if (response.status === 200) {
            if (response.data.status === 1) {
                return response.data.result
                // return response.data
            } else {
                if (response.data.status) {
                    return Promise.reject(response.data)
                } else {
                    return response.data
                }
            }
        }
        const res = response.data
        return Promise.reject(res)
    },
    error => {
        if (error.response && error.response.status == '500') {
            // 登录失效  跳转到登录页面
            Message({
                message: '您已下线，请重新登录！',
                type: 'error'
            })
            setTimeout(() => {
                // 去除本地token
                clearStorage('TOKEN')
                Router.push({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
            }, 1000)

            return Promise.reject('您已下线，请重新登录！')
        }
        debugger
        if (error.response) {
            var data = error.response.data
            var error_msg = ''
            if (typeof data === 'string') {
                error_msg = data
            }

            if (error_msg.indexOf('split') > -1) { // 导出表格报错列表
                console.log('导出表格报错列表')
            } else {
                Message({
                    message: error_msg,
                    type: 'error'
                })
            }
        }
        // 超时处理
        if (error.response === undefined && typeof error === 'object' && error.toString().indexOf('timeout')) {
            return Promise.reject('服务器繁忙')
        }

        return Promise.reject(error_msg)
    }
)

export default service
