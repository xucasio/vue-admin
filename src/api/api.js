// eslint-disable-next-line no-undef
const host = process.env.NODE_ENV === 'development' ? '' : window.APIURL.host
const upmshost = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.upmshost
const wxbackurl = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.wxbackurl
const wxcodebackurl = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.wxcodebackurl
const wxcodereturn = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.wxcodereturn
const adminhost = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.adminhost
const wxcodefail = process.env.NODE_ENV === 'development' ? '/upms/' : window.APIURL.wxcodefail
export default {
    host,
    upmshost,
    adminhost,
    wxbackurl,
    wxcodebackurl,
    wxcodereturn,
    wxcodefail
}
// eslint-disable-next-line
if(process.env.NODE_ENV === 'development'){
    // 定义全局变量 用于开发环境
}
