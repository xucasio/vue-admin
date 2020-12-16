import router from './router'
import { getStorage } from '@/utils/auth'
import common from '@/utils/common'
const whiteList = ['/Login', '/forgot', '/forgot', '/error', '/register', '/binduser', '/error403', '/LoginSuccess', '/WxLogin', '/WXSuccess', '/WXFail', '/agree'] // 不需登录的白名单
// import store from '@/store'
import { fetchGetMenus } from '@/api/admin'
const routes = router.options.routes || []
router.beforeEach(async(to, from, next) => {
    const token = getStorage('TOKEN')
    const toQuery = {
        appId: common.getUrlKey('MYAPPID') || '66'
    }
    if (common.getUrlKey('loginOut')) {
        toQuery.loginOut = common.getUrlKey('loginOut')
    }
    if (token) {
        const path = to.meta.pageMenu ? to.meta.pageMenu : to.path
        let menus = JSON.parse(sessionStorage.getItem('Menus') || '[]')
        if (!menus.length || from.path === '/Login') {
            if (getStorage('TYPEID') !== '-1') {
                await fetchGetMenus({ AdminTypeId: getStorage('TYPEID') }).then(res => {
                    menus = res.MenuPointList
                    sessionStorage.setItem('Menus', JSON.stringify(menus))
                })
            } else {
                menus = [
                    {
                        Childen: [],
                        MenuIcon: 'iconjiaosequanxian',
                        MenuId: 1,
                        MenuName: '权限列表',
                        MenuUrl: '/role/authList2',
                        ParentMenuId: 0
                    },
                    {
                        Childen: [],
                        MenuIcon: 'iconxitongquanxian',
                        MenuId: 2,
                        MenuName: '组织管理',
                        MenuUrl: '/org/orgapply',
                        ParentMenuId: 0
                    }
                ]
                sessionStorage.setItem('Menus', JSON.stringify(menus))
            }
        }

        // * 为所有角色皆有路由
        // TYPEID -1普通用户不受权限限制
        if (whiteList.indexOf(path) === -1 && path !== '/' && path !== '*' && getStorage('TYPEID') !== '-1') {
            // console.log('存在当前菜单', common.checkRoute(path, menus), '存在路由表', common.isExistRoutes(path, routes))
            const menuobj = common.checkRoute(path, menus) // 匹配到的返回当前菜单信息，否则返回''
            if (menuobj && common.isExistRoutes(path, routes)) { // 403有两种，一种是匹配到菜单和路由，再去比较权限action，一种是匹配到路由没匹配到菜单
                if (menuobj.PointList && menuobj.PointList.indexOf(to.meta.action) < 0 && common.isExistRoutes(path, routes)) {
                    console.log('403', '存在菜单和路由,没有action')
                    next({ path: '/error403' })
                } else {
                    next()
                }
            } else if (!menuobj && common.isExistRoutes(path, routes)) {
                console.log('403', '存在路由,不存在菜单')
                next({ path: '/error403' })
            } else {
                next()
            }
        } else if (whiteList.indexOf(path) === -1 && path !== '/' && path !== '*' && getStorage('TYPEID') === '-1') {
            const menuobj = common.checkRoute(path, menus) // 匹配到的返回当前菜单信息，否则返回''
            if (!menuobj && common.isExistRoutes(path, routes)) {
                next({ path: '/error403' })
            } else {
                next()
            }
        } else {
            next({
                query: toQuery
            })
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            next({ path: '/Login', query: toQuery })
        }
    }
})
