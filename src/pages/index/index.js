import Vue from 'vue'
import 'normalize.css'
import Element from 'element-ui'
// import 'xe-utils'
// import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/styles/main.scss' // global css
import App from './index.vue'
import router from './router'
import store from '@/store'
import i18n from '@/lang' // Internationalization
import './permission'
import echarts from 'echarts'
// import '@/errorLog' // error log
// import './permission' // permission control
// import './mock' // simulation data
import components from '../../components/index.js'

import * as filters from '@/filters' // global filters
import MinXin from '@/mixins/index.js'
Vue.mixin(MinXin)
// Vue.use(VXETable)
// 默认使用small大小
Vue.use(Element, { size: 'medium', zIndex: 3000 })

import '@/directive'
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
components.forEach(component => {
    Vue.component(component.name, component)
})
Vue.prototype.$echarts = echarts
// 给 vue 实例挂载内部对象，例如：
// Vue.prototype.$XModal = VXETable.modal
// Vue.prototype.$XPrint = VXETable.print
// Vue.prototype.$XSaveFile = VXETable.saveFile
// Vue.prototype.$XReadFile = VXETable.readFile
// Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
