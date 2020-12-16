import request from '@/utils/request'
import api from '@/api/api.js'

const host = api.host
// 获取菜单
export function fetchNews() {
    return request({
        url: host + '/news/index',
        method: 'get'
    })
}
