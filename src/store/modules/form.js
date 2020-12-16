const form = {
    state: {
        BILL: {
        },
        PROP: {},
        Status: '',
        PreFlowInstanceId: '',
        isEdit: false, // 表单编辑状态
        isFrist: true, // 首次填报的表单
        isAddPage: false, // 是指 是否flow.html页面
        refresh: 0
    },
    mutations: {
        SET_FIELD_VALUE: (state, { table, field, value }) => {
            state.BILL[table][field] = value
        },
        SET_TABLEFIELD_VALUE: (state, { table, field, value, index }) => {
            state.BILL[table][index][field] = value
        },
        SET_FORM: (state, form) => {
            console.log('stateForm:', form)
            state.BILL = form
        },
        SET_PROP: (state, prop) => {
            console.log('stateProp:', prop)
            state.PROP = prop
        },
        DEL_TABLE_ROW(state, { table, index }) {
            console.log(state.BILL[table])
            console.log('DEL_TABLE_ROW:', index)
            state.BILL[table].splice(index, 1)
        },
        ADD_TABLE_ROW: (state, { table, data }) => {
            state.BILL[table].push(data)
        },
        SET_FORM_STATUS: (state, s) => {
            state.Status = s
        },
        SET_PRE_FLOWID: (state, id) => {
            state.PreFlowInstanceId = id
        },
        SET_IS_FIRST: (state, isfirst) => {
            state.isFrist = isfirst
        },
        SET_IS_ADDPAGE: (state, isAdd) => {
            state.isAddPage = isAdd
        },
        ADD_REFRESH: (state) => {
            state.refresh += 1
        }
    },
    actions: {
        setFieldValue({ commit }, { table, field, value }) {
            commit('SET_FIELD_VALUE', { table, field, value })
        },
        setTableFieldValue({ commit }, { table, field, value, index }) {
            commit('SET_TABLEFIELD_VALUE', { table, field, value, index })
        },
        delTableRow({ commit }, { table, index }) {
            commit('DEL_TABLE_ROW', { table, index })
        },
        addTableRow({ commit }, table) {
            commit('ADD_TABLE_ROW', table)
        },
        getForm({ commit }, { value, props }) {
            commit('SET_FORM', value)
            commit('SET_PROP', props)

            console.log(props)
        },
        setFormState({ commit }, status) {
            commit('SET_FORM_STATUS', status)
        },
        setPreFlowInstanceId({ commit }, id) {
            commit('SET_PRE_FLOWID', id)
        },
        setIsFirst({ commit }, isfirst) {
            commit('SET_IS_FIRST', isfirst)
        },
        setIsAddPage({ commit }, isAdd) {
            commit('SET_IS_ADDPAGE', isAdd)
        },
        setPageRefresh({ commit }) {
            commit('ADD_REFRESH')
        }
    }
}

export default form
