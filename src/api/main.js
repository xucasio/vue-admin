import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.host

// 获取菜单
export function fetchMenus(token) {
    return request({
        url: host + '/api/Login/GetMenus?Token=' + token,
        method: 'post'
    })
}
