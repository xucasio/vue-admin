import request from '@/utils/request'
import api from '@/api/api.js'
const host = api.adminhost

export function fetchSysManagerList(data) {
    return request({
        url: host + 'api/Account/queryuseraccount',
        method: 'post',
        data
    })
}
