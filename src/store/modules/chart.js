
const chart = {
    state: {
        List: [],
        SelectId: ''
    },
    mutations: {
        ADD_ITEM: (state, item) => {
            state.List.push(item)
        },
        SET_CUR_GRID: (state, id) => {
            state.SelectId = id
        }
    },
    actions: {
        addChart({ commit }, item) {
            commit('ADD_ITEM', item)
        },
        setCurGrid({ commit }, id) {
            commit('SET_CUR_GRID', id)
        }
    }
}

export default chart
