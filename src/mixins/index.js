// import common from '@/utils/common.js'
// import { mapState } from 'vuex'
import { showLoading, hideLoading } from '@/utils/loading'
const mixins = {
    beforeCreate() {

    },
    computed: {
        // ...mapState({
        //     MENUS: state => state.admin.menus
        // }),
        // 路由对应的按钮权限
        points() {
            const MENUS = JSON.parse(sessionStorage.getItem('Menus')) || []
            // 构造列表
            var routers = []
            MENUS.forEach(m => {
                if (m.Childen.length > 0) {
                    m.Childen.forEach(mc => {
                        routers.push(mc)
                    })
                } else {
                    routers.push(m)
                }
            })
            return routers.length ? ((routers.find(f => f.MenuUrl === this.$route.path) || {}).PointList || []) : []
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        showLoading(el) {
            showLoading(el)
        },
        hideLoading

    },
    // 不缓存页面
    beforeRouteLeave(to, from, next) {
        switch (true) {
                // 设置跳列表时缓存
                case from.path === '/home/userSet' && to.path === '/home/user':
                    to.meta.keepAlive = true
                    break
                // 设置跳列表时缓存
                case from.path === '/tob/buseradminset' && to.path === '/tob/buserList':
                    to.meta.keepAlive = true
                    break
                default:
                    to.meta.keepAlive = false
                    break
        }
        next()
    }
}
export default mixins
