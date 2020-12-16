
import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '@/views/login/index.vue'
import HomePage from '@/views/home/home.vue'
import common from '@/utils/common'
const menus = JSON.parse(sessionStorage.getItem('Menus') || '[]')
/**
 * action 页面对应的权限操作
 * pageMenu 当前路由对应的左侧菜单
 *
*/

Vue.use(Router)
export const constantRouterMap = [
    {
        path: '/',
        redirect: common.getFirstPath(menus) || '/dashboard/userAnalysis'
        // redirect: '/home/user'
    },
    {
        path: '/warehouse',
        component: HomePage,
        redirect: '/warehouse/warehouseList',
        meta: { title: '出库管理' },
        // children: [
        //     {
        //         path: '/home/user',
        //         component: () => import('@/views/Admin/UserManager/list.vue'),
        //         meta: { title: '账号管理', action: 'SELECT', keepAlive: true }
        //     },
        //     {
        //         path: '/home/addUser',
        //         component: () => import('@/views/Admin/UserManager/addUser.vue'),
        //         meta: { title: '新增账户', pageMenu: '/home/user', action: 'ADD' }
        //     },
        //     {
        //         path: '/home/userSet',
        //         component: () => import('@/views/Admin/UserManager/userSet.vue'),
        //         meta: { title: '账户设置', pageMenu: '/home/user', action: 'SET' }
        //     },
        //     {
        //         path: '/bmlist',
        //         component: () => import('@/views/Admin/BManager/bmlist.vue'),
        //         meta: { title: 'B端管理员', action: 'SELECT' }
        //     },
        //     {
        //         path: '/home/userInfo',
        //         component: () => import('@/views/Admin/UserManager/userInfoPage.vue'),
        //         // 超管在页面判断隐藏
        //         meta: { title: '个人信息', pageMenu: '*' }
        //     },
        //     {
        //         path: '/home/modifyPw',
        //         component: () => import('@/views/Admin/UserManager/modifyPw.vue'),
        //         meta: { title: '修改密码', pageMenu: '*' }
        //     },
        //     {
        //         path: '/home/modifyPh',
        //         component: () => import('@/views/Admin/UserManager/phoneModify.vue'),
        //         meta: { title: '手机绑定', pageMenu: '*' }
        //     },

        //     {
        //         path: '/sysright',
        //         redirect: '/sysright/managerlist',
        //         component: () => import('@/views/Admin/SysRight/index.vue'),
        //         meta: { title: '系统权限' },
        //         children: [
        //             {
        //                 path: '/sysright/managerlist',
        //                 component: () => import('@/views/Admin/SysRight/managerlist.vue'),
        //                 meta: { title: '管理员列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/sysright/productlist',
        //                 component: () => import('@/views/Admin/SysRight/productlist.vue'),
        //                 meta: { title: '平台产品列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/sysright/extendinfo',
        //                 component: () => import('@/views/Admin/SysRight/extendlist.vue'),
        //                 meta: { title: '扩展信息设置', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/sysright/appextendlist',
        //                 component: () => import('@/views/Admin/SysRight/appextendlist.vue'),
        //                 meta: { title: '产品扩展信息设置', pageMenu: '/sysright/productlist', action: 'ADD' }
        //             },
        //             {
        //                 path: '/sysright/labellist',
        //                 component: () => import('@/views/Admin/BManager/labellist.vue'),
        //                 meta: { title: '标签列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/sysright/addlabel',
        //                 component: () => import('@/views/Admin/BManager/addlabel.vue'),
        //                 meta: { title: '新增标签', pageMenu: '/sysright/labellist', action: 'ADD' }
        //             }
        //         ]
        //     },
        //     {
        //         path: '/bsysright',
        //         component: () => import('@/views/Admin/SysRight/index.vue'),
        //         redirect: '/sysright/labellist',
        //         meta: { title: '系统权限' },
        //         children: [

        //             {
        //                 path: '/bsysright/labellist',
        //                 component: () => import('@/views/Admin/BManager/labellist.vue'),
        //                 meta: { title: '标签列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/bsysright/addlabel',
        //                 component: () => import('@/views/Admin/BManager/addlabel.vue'),
        //                 meta: { title: '新增标签', pageMenu: '/bsysright/labellist', action: 'ADD' }
        //             },
        //             {
        //                 path: '/bsysright/rightlist',
        //                 component: () => import('@/views/Admin/BManager/right/list.vue'),
        //                 meta: { title: '权限列表', action: 'SELECT' }
        //             }
        //         ]
        //     },
        //     // 角色权限
        //     {
        //         path: '/role',
        //         component: () => import('@/views/Admin/RoleManager/index.vue'),
        //         redirect: '/role/authList',
        //         meta: { title: '角色权限' },
        //         children: [
        //             {
        //                 path: '/role/authList',
        //                 component: () => import('@/views/Admin/RoleManager/authList.vue'),
        //                 meta: { title: '权限列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/role/authList2',
        //                 component: () => import('@/views/Admin/RoleManager/authList2.vue'),
        //                 meta: { title: '权限列表', action: 'SELECT' }
        //             },
        //             // 平台管理员
        //             {
        //                 path: '/role/authList3',
        //                 component: () => import('@/views/Admin/RoleManager/authList3.vue'),
        //                 meta: { title: '权限列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/role/roleList',
        //                 component: () => import('@/views/Admin/RoleManager/roleList.vue'),
        //                 meta: { title: '角色列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/role/addRole',
        //                 component: () => import('@/views/Admin/RoleManager/addRole.vue'),
        //                 meta: { title: '角色操作', pageMenu: '/role/roleList', action: 'ADD' }
        //             },
        //             {
        //                 path: '/role/specialAuthSet',
        //                 component: () => import('@/views/Admin/RoleManager/specialAuthSet.vue'),
        //                 meta: { title: '特殊管理员权限设置' },
        //                 redirect: '/role/auditAuthList',
        //                 children: [{
        //                     path: '/role/auditAuthList',
        //                     component: () => import('@/views/Admin/RoleManager/auditAuthList.vue'),
        //                     meta: { title: '交易所审计权限', pageMenu: '/role/specialAuthSet', action: 'SELECT' }
        //                 },
        //                 {
        //                     path: '/role/platAuthList',
        //                     component: () => import('@/views/Admin/RoleManager/platAuthList.vue'),
        //                     meta: { title: '平台管理员权限', pageMenu: '/role/specialAuthSet', action: 'SELECT' }
        //                 }]
        //             },
        //             {
        //                 path: '/role/authSet',
        //                 component: () => import('@/views/Admin/RoleManager/authSet.vue'),
        //                 meta: { title: '默认权限设置', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/role/mutilOption',
        //                 component: () => import('@/views/Admin/RoleManager/mutilOption.vue'),
        //                 meta: { title: '批量操作' }
        //             }
        //         ]
        //     },
        //     {
        //         path: '/tob',
        //         redirect: '/tob/buserList',
        //         component: () => import('@/views/Admin/TobManager/index.vue'),
        //         meta: { title: 'B端管理' },
        //         children: [
        //             {
        //                 path: '/tob/userList',
        //                 component: () => import('@/views/Admin/TobManager/userList.vue'),
        //                 meta: { title: '管理员列表', action: 'SELECT', keepAlive: true }
        //             },
        //             {
        //                 path: '/tob/BUserSet',
        //                 component: () => import('@/views/Admin/TobManager/BUserSet.vue'),
        //                 meta: { title: '权限设置', pageMenu: '/tob/buserList', action: 'SET' }

        //             },
        //             {
        //                 path: '/tob/buserList',
        //                 component: () => import('@/views/Admin/BUserManager/buserlist.vue'),
        //                 meta: { title: '组织列表', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/tob/addOrg',
        //                 component: () => import('@/views/Admin/BUserManager/addOrg.vue'),
        //                 meta: { title: '新增组织', pageMenu: '/tob/buserList', action: 'ADD' }
        //             },
        //             {
        //                 path: '/tob/buserDetail',
        //                 component: () => import('@/views/Admin/BUserManager/buserdetail.vue'),
        //                 meta: { title: '管理员列表', pageMenu: '/tob/buserList', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/tob/buseradminset',
        //                 component: () => import('@/views/Admin/BUserManager/badminset.vue'),
        //                 meta: { title: '权限设置', pageMenu: '/tob/buserList', action: 'SET' }
        //             }
        //         ]
        //     },
        //     {
        //         path: '/audit',
        //         component: () => import('@/views/Admin/BManager/useraudit.vue'),
        //         meta: { title: '账号审计' },
        //         redirect: '/audit/auditlist',
        //         children: [{
        //             path: '/audit/auditlist',
        //             component: () => import('@/views/Admin/BManager/auditlist.vue'),
        //             meta: { title: '审计列表', pageMenu: '/audit/auditlist', action: 'SELECT' }
        //         },
        //         {
        //             path: '/audit/audithis',
        //             component: () => import('@/views/Admin/BManager/audithis.vue'),
        //             meta: { title: '审计历史', pageMenu: '/audit/auditlist', action: 'SELECT' }
        //         }]
        //     },
        //     {
        //         path: '/org',
        //         component: () => import('@/views/Admin/CManager/org.vue'),
        //         meta: { title: '组织管理' },
        //         redirect: '/org/orgapply',
        //         children: [{
        //             path: '/org/orgapply',
        //             component: () => import('@/views/Admin/CManager/Org/myorgapply.vue'),
        //             meta: { title: '申请列表', pageMenu: '/org/orgapply', action: 'SELECT' }
        //         },
        //         {
        //             path: '/org/orglist',
        //             component: () => import('@/views/Admin/CManager/Org/myorg.vue'),
        //             meta: { title: '组织列表', pageMenu: '/org/orgapply', action: 'SELECT' }
        //         }]
        //     },
        //     {
        //         path: '/log',
        //         component: () => import('@/views/Admin/LogManager/index.vue'),
        //         meta: { title: '日志管理' },
        //         redirect: '/log/loginLog',
        //         children: [{
        //             path: '/log/loginLog',
        //             component: () => import('@/views/Admin/LogManager/loginLog.vue'),
        //             meta: { title: '登录日志', pageMenu: '/log/loginLog', action: 'SELECT' }
        //         },
        //         {
        //             path: '/log/optionLog',
        //             component: () => import('@/views/Admin/LogManager/optionLog.vue'),
        //             meta: { title: '操作日志', pageMenu: '/log/optionLog', action: 'SELECT' }
        //         }]
        //     },
        //     {
        //         path: '/notice',
        //         component: () => import('@/views/Admin/NoticeManager/index.vue'),
        //         redirect: '/notice/roleNotice',
        //         meta: { title: '消息中心' },
        //         children: [
        //             {
        //                 path: '/notice/roleNotice',
        //                 component: () => import('@/views/Admin/NoticeManager/roleNotice.vue'),
        //                 meta: { title: '权限通知' },
        //                 redirect: '/notice/orgRole',
        //                 children: [{
        //                     path: '/notice/personalRole',
        //                     component: () => import('@/views/Admin/NoticeManager/personalRole.vue'),
        //                     meta: { title: '个人权限', pageMenu: '/notice/roleNotice', action: 'SELECT' }
        //                 },
        //                 {
        //                     path: '/notice/orgRole',
        //                     component: () => import('@/views/Admin/NoticeManager/orgRole.vue'),
        //                     meta: { title: '组织权限', pageMenu: '/notice/roleNotice', action: 'SELECT' }
        //                 }]
        //             }]
        //     },
        //     {
        //         path: '/dashboard',
        //         component: () => import('@/views/Admin/dashboardManager/index.vue'),
        //         redirect: '/dashboard/userAnalysis',
        //         meta: { title: 'Dashboard' },
        //         children: [
        //             {
        //                 path: '/dashboard/userAnalysis',
        //                 component: () => import('@/views/Admin/dashboardManager/userAnalysis.vue'),
        //                 meta: { title: '用户分析', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/dashboard/roleAnalysis',
        //                 component: () => import('@/views/Admin/dashboardManager/roleAnalysis.vue'),
        //                 meta: { title: '权限分析' },
        //                 redirect: '/dashboard/dataAnalysis',
        //                 children: [{
        //                     path: '/dashboard/dataAnalysis',
        //                     component: () => import('@/views/Admin/dashboardManager/dataAnalysis.vue'),
        //                     meta: { title: '数据统计', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //                 },
        //                 {
        //                     path: '/dashboard/analysisList',
        //                     component: () => import('@/views/Admin/dashboardManager/analysisList.vue'),
        //                     meta: { title: '统计报表', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //                 },
        //                 {
        //                     path: '/dashboard/ruleList',
        //                     component: () => import('@/views/Admin/dashboardManager/ruleList.vue'),
        //                     meta: { title: '统计规则列表', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //                 },
        //                 {
        //                     path: '/dashboard/addRule',
        //                     component: () => import('@/views/Admin/dashboardManager/addRule.vue'),
        //                     meta: { title: '新增规则', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //                 }]
        //             }
        //         ]
        //     },
        //     {
        //         path: '/rule',
        //         component: () => import('@/views/Admin/dashboardManager/ruleIndex.vue'),
        //         meta: { title: '规则管理' },
        //         redirect: '/rule/ruleList',
        //         children: [
        //             {
        //                 path: '/rule/ruleList',
        //                 component: () => import('@/views/Admin/dashboardManager/ruleList.vue'),
        //                 meta: { title: '统计规则列表', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //             },
        //             {
        //                 path: '/rule/addRule',
        //                 component: () => import('@/views/Admin/dashboardManager/addRule.vue'),
        //                 meta: { title: '新增规则', pageMenu: '/dashboard/roleAnalysis', action: 'SELECT' }
        //             }]
        //     }
        // ],
        children: [
            {
                path: '/warehouse/warehouseList',
                component: () => import('@/views/Admin/WarehouseManagement/warehouseList.vue'),
                meta: { title: '出库列表', keepAlive: true }
            },
            {
                path: '/warehouse/warehouseDetail',
                component: () => import('@/views/Admin/WarehouseManagement/warehouseDetail.vue'),
                meta: { title: '出库单详情' }
            },
            {
                path: '/warehouse/warehouseList',
                component: () => import('@/views/Admin/WarehouseManagement/warehouseList.vue'),
                meta: { title: '出库操作' }
            }

        ]
    },
    {
        path: '/Login',
        component: LoginPage
    },
    {
        path: '/LoginSuccess',
        component: () => import('@/views/login/loginsuccess')
    },
    {
        path: '/WXSuccess',
        component: () => import('@/views/Admin/UserManager/WXSuccess')
    },
    // WXFail
    {
        path: '/WXFail',
        component: () => import('@/views/Admin/UserManager/wxFail')
    },
    {
        path: '/WxLogin',
        component: () => import('@/views/Admin/UserManager/userinfoWxDialog')
    },
    {
        path: '/forgot',
        component: () => import('@/views/login/forget')
    },
    {
        path: '/error',
        component: () => import('@/views/error/index')
    },
    {
        path: '/register',
        component: () => import('@/views/login/register')
    },
    {
        path: '/agree',
        component: () => import('@/views/login/agreement')
    },
    {
        path: '/binduser',
        component: () => import('@/views/login/binduser')
    },
    {
        path: '/error403',
        component: () => import('@/views/error/403.vue')
    },
    {
        path: '*',
        component: () => import('@/views/error/404.vue')
    }
]

export default new Router({
    mode: 'history', // require service support
    base: process.env.NODE_ENV === 'production' ? '/Admin/' : '',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = []
