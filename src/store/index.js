import Vue from 'vue'
import Vuex from 'vuex'
import form from './modules/form'
import user from './modules/user'
import portal from './modules/portal'
import chart from './modules/chart'
import admin from './modules/admin'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV === 'production', // process.env.NODE_ENV === 'production',
    modules: {
        form,
        user,
        portal,
        chart,
        admin
    },
    getters
})

export default store
