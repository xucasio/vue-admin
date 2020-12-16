// eslint-disable-next-line no-extend-native
Date.prototype.format = function(format) {
    var o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's +': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}
const common = {
    fixData: function(data) {
        var o = ''; var l = 0; var w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
    },

    s2ab: function(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            const buf = new ArrayBuffer(s.length)
            const view = new Uint8Array(buf)
            for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
            return buf
        } else {
            const buf = new Array(s.length)
            for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
            return buf
        }
    },
    // 转换时间格式
    GMTToStr: function(time) {
        if (!time || time === '') {
            return ''
        }
        const date = new Date(time)
        return date.format('yyyy-MM-dd')
    },
    isMsie: function() {
        return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false
    },
    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    },
    isEmpty(obj) {
        obj = obj + ''
        if (typeof obj === 'undefined' || obj == null || obj.replace(/(^\s*)|(\s*$)/g, '') === '') {
            return true
        } else {
            return false
        }
    },
    formatDate: function(date, format) {
        var v = ''
        if (typeof date === 'string' || typeof date !== 'object') {
            return
        }
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var weekDay = date.getDay()
        var ms = date.getMilliseconds()
        var weekDayString = ''

        if (weekDay === 1) {
            weekDayString = '星期一'
        } else if (weekDay === 2) {
            weekDayString = '星期二'
        } else if (weekDay === 3) {
            weekDayString = '星期三'
        } else if (weekDay === 4) {
            weekDayString = '星期四'
        } else if (weekDay === 5) {
            weekDayString = '星期五'
        } else if (weekDay === 6) {
            weekDayString = '星期六'
        } else if (weekDay === 7) {
            weekDayString = '星期日'
        }

        v = format
        // Year
        v = v.replace(/yyyy/g, year)
        v = v.replace(/YYYY/g, year)
        v = v.replace(/yy/g, (year + '').substring(2, 4))
        v = v.replace(/YY/g, (year + '').substring(2, 4))

        // Month
        var monthStr = ('0' + month)
        v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2))

        // Day
        var dayStr = ('0' + day)
        v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2))

        // hour
        var hourStr = ('0' + hour)
        v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2))
        v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2))

        // minute
        var minuteStr = ('0' + minute)
        v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2))

        // Millisecond
        v = v.replace(/sss/g, ms)
        v = v.replace(/SSS/g, ms)

        // second
        var secondStr = ('0' + second)
        v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2))
        v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2))

        // weekDay
        v = v.replace(/E/g, weekDayString)
        return v
    },
    getUrlKey: function(name) {
        // eslint-disable-next-line no-sparse-arrays
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
    },
    getUrlParam: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2]); return null
    },
    addUrlParm: function(url, key, value) {
        var returnUrl = ''
        if (url.indexOf('?') === -1) {
            returnUrl += url + '?' + key + '=' + value
        } else {
            if (url.indexOf('?' + key + '=') === -1 && url.indexOf('&' + key + '=') === -1) {
                returnUrl += url + '&' + key + '=' + value
            } else {
                var isDone = false
                var startIndex = 0
                var endIndex = url.length - 1
                var parm = '?' + key + '='
                for (var i = 0; i < url.length; i++) {
                    if (url.substr(i, parm.length) === parm) {
                        startIndex = i + parm.length
                        for (var j = startIndex; j < url.length; j++) {
                            if (url[j] === '&') {
                                endIndex = j
                                break
                            } else if (j === url.length - 1) {
                                endIndex = url.length
                            }
                        }
                        isDone = true
                        break
                    }
                }
                if (!isDone) {
                    parm = '&' + key + '='
                    for (let i = 0; i < url.length; i++) {
                        if (url.substr(i, parm.length) === parm) {
                            startIndex = i + parm.length
                            // eslint-disable-next-line no-redeclare
                            for (var j = startIndex; j < url.length; j++) {
                                if (url[j] === '&') {
                                    endIndex = j
                                    break
                                } else if (j === url.length - 1) {
                                    endIndex = url.length
                                }
                            }
                            break
                        }
                    }
                }
                var parmKeyValue = parm + url.substring(startIndex, endIndex)
                returnUrl = url.replace(parmKeyValue, parm + value)
            }
        }
        return returnUrl
    },
    valueAssign(value, props) {
        var rValue = {}
        var forms = Object.keys(props)
        forms.forEach((e) => {
            if (props[e] !== undefined && common.isArray(props[e].Columns)) {
                // 数组
                rValue[e] = []
                if (common.isArray(value[e])) {
                    value[e].forEach(row => {
                        props[e].Columns.forEach(f => {
                            if (row[f.field] === undefined) {
                                row[f.field] = ''
                            }
                        })
                        rValue[e].push(row)
                    })
                }
            } else {
                rValue[e] = value[e]
            }
        })
        return rValue
    },
    list2Tree: function(list, parentid, pField, id) {
        var rlist = []
        if (list.length <= 0) {
            return []
        }
        var nochild = true
        for (var i = 0; i < list.length; i++) {
            var item = {}
            if (list[i][pField] === parentid) {
                item = {}
                Object.assign(item, list[i])
                item.children = this.list2Tree(list, item[id], pField, id)
                rlist.push(item)
                nochild = false
            }
        }
        if (nochild) return ''
        return rlist
    },
    getListParents: function(list, id, pField, idField, arr) {
        var has = true
        var curPid = ''
        console.log('id:', id)
        console.log('list:', list)
        list.forEach(function(l) {
            if (l[idField] === id) {
                arr.push(id)
                has = false
                curPid = l[pField]
                return false
            }
        })
        if (has) {
            console.log(arr)
            return arr
        }
        return common.getListParents(list, curPid, pField, idField, arr)
    },
    getTreeListParents: function(list, id, pField, idField, valueField, arr) {
        var has = true
        var curPid = ''
        console.log('arr:', arr)
        list.forEach(function(l) {
            if (l[idField] === id) {
                arr.push(l[valueField])
                has = false
                curPid = l[pField]
                return false
            }
        })
        if (has) {
            console.log(arr)
            return arr
        }
        return common.getTreeListParents(list, curPid, pField, idField, valueField, arr)
    },
    getArrayLastOne: function(arr) {
        if (arr.length > 0) {
            return arr[arr.length - 1]
        }
        return ''
    },
    closePage: function() {
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
                window.opener = null; window.close()
            } else {
                window.open('', '_top'); window.top.close()
            }
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            window.close()
            // window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的
            window.history.go(-2)
        } else {
            window.opener = null
            // window.open('', '_self', '');
            window.close()
        }
    },
    compareDate: function(startDate, endDate) {
        // eslint-disable-next-line eqeqeq
        if (startDate == null || startDate == '') {
            return true
        }
        // eslint-disable-next-line eqeqeq
        if (endDate == null || endDate == '') {
            return true
        }
        var end = new Date(endDate)
        var start = new Date(startDate)
        if (end.getTime() >= start.getTime()) {
            return true
        } else {
            return false
        }
    },
    myBrowser() { // 判断浏览器
        var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1
        if (isOpera) {
            return 'Opera'
        } // 判断是否Opera浏览器
        if (userAgent.indexOf('Firefox') > -1) {
            return 'FF'
        } // 判断是否Firefox浏览器
        if (userAgent.indexOf('Chrome') > -1) {
            return 'Chrome'
        }
        if (userAgent.indexOf('Safari') > -1) {
            return 'Safari'
        } // 判断是否Safari浏览器
        if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
            return 'IE'
        } // 判断是否IE浏览器
        if (userAgent.indexOf('Trident') > -1) {
            return 'Edge'
        } // 判断是否Edge浏览器
    },
    downLoadFile: function(url, fileName) {
        if (common.myBrowser() === 'IE' || common.myBrowser() === 'Edge') {
            var oPop = window.open(url, '', 'width=1, height=1, top=5000, left=5000')
            for (; oPop.document.readyState !== 'complete';) {
                if (oPop.document.readyState === 'complete') break
            }
            oPop.document.execCommand('SaveAs')
            oPop.close()
        } else {
            //! IE  firefox和Chrome
            var tmpa = document.createElement('a')
            tmpa.download = fileName
            tmpa.href = url
            // 火狐兼容
            document.body.appendChild(tmpa)
            tmpa.style.display = 'none'
            tmpa.click() // 模拟点击实现下载
        }
    },
    base64ToFile(base64, name, mine) {
        // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
        const base64Data = 'data:' + (mine || 'application/vnd.ms-excel') + ';base64,' + base64
        console.log('imgUrl:', base64Data)

        // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
        if (window.navigator.msSaveOrOpenBlob) {
            var blob = common.dataURLtoBlob(base64Data)
            // var myUrl = URL.createObjectURL(blob)
            window.navigator.msSaveOrOpenBlob(blob, name)
        } else {
            // 这里就按照chrome等新版浏览器来处理
            const a = document.createElement('a')
            a.href = base64Data
            a.setAttribute('download', name)
            a.click()
        }
    },
    // 将base64转换为blob
    dataURLtoBlob: function(dataurl) {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    },
    // 将blob转换为file
    blobToFile: function(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date()
        theBlob.name = fileName
        return theBlob
    },

    /**
     * 获取order by模型
     */
    getOrderBy(sortChangeEventData) {
        if (sortChangeEventData == null) { return null }
        var orderBy = { Column: sortChangeEventData.prop }
        orderBy.Order = sortChangeEventData.order === 'descending' ? 'desc' : 'asc'
        return orderBy
    },
    getOrderByMap(sortChangeEventData, fieldMap) {
        if (sortChangeEventData == null) { return null }
        var orderBy = { Column: fieldMap[sortChangeEventData.prop] }
        orderBy.Order = sortChangeEventData.order === 'descending' ? 'desc' : 'asc'
        return orderBy
    },
    /**
     * url追加token信息
     */
    addToken: function(url) {
        const Token = common.getUrlKey('Token')
        const PortalName = common.getUrlKey('PortalName')
        const ResourceCode = common.getUrlKey('resourceCode')
        url = common.addUrlParm(url, 'Token', Token)
        url = common.addUrlParm(url, 'PortalName', PortalName)
        if (ResourceCode) {
            url = common.addUrlParm(url, 'resourceCode', ResourceCode)
        }
        return url
    },
    getCookie: function(name) {
        var arr; var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (arr === document.cookie.match(reg)) { return unescape(arr[2]) } else { return null }
    },
    delCookie: function(name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
    },
    setCookie: function(name, value, time) {
        var strsec = this.getsec(time)
        var exp = new Date()
        exp.setTime(exp.getTime() + strsec * 1)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
    },
    getsec: function(str) {
        var str1 = str.substring(1, str.length) * 1
        var str2 = str.substring(0, 1)
        if (str2 === 's') {
            return str1 * 1000
        } else if (str2 === 'h') {
            return str1 * 60 * 60 * 1000
        } else if (str2 === 'd') {
            return str1 * 24 * 60 * 60 * 1000
        }
    },
    uuid: function() {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'

        var uuid = s.join('')
        return uuid
    },
    getFilter: function(item) {
        var str = ''
        for (var i in item) {
            str += i + ':' + item[i] + ';'
        }
        return str
    },
    trim: function(str) {
        str = str + ''
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
    },
    uniqueArry: function(arr) {
        var hash = []
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    ++i
                }
            }
            hash.push(arr[i])
        }
        return hash
    },
    getUrlPartOfToken: function() {
        return 'token=' + sessionStorage.getItem('token')
    },
    splitWithLineDateFormatter: function(date) {
        if (isNaN(date)) { return '' }
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var d = date.getDate()
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d)
    },
    // 获取路由表第一个可用路由
    getFirstPath(menus) {
        let path = ''
        if (menus.length) {
            const [{ Childen }] = menus
            if (Childen.length) {
                const [{ MenuUrl }] = Childen
                path = MenuUrl
            } else {
                const [{ MenuUrl }] = menus
                path = MenuUrl
            }
        }

        return path
    },
    // 验证当前路由是否是合法，否则403
    checkRoute(path, menus) {
        let flag = ''
        const fn = (path, menus) => {
            menus.map(item => {
                if (item.MenuUrl === path) {
                    flag = item
                }
                if (item.Childen && item.Childen.length) {
                    fn(path, item.Childen)
                }
            })
        }
        fn(path, menus)
        return flag
    },
    // 路由表是否存在当前路径
    isExistRoutes(path, routes) {
        let flag = false
        const fn = (path, routes) => {
            routes.map(item => {
                if (item.path === path) {
                    flag = true
                }
                if (item.children && item.children.length) {
                    fn(path, item.children)
                }
            })
        }
        fn(path, routes)
        return flag
    }
}
export default common
