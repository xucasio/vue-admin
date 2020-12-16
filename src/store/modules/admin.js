const admin = {
    state: {
        screenHeight: window.innerHeight,
        showAuthDialog: false,
        auths: [],
        menus: [],
        appId: 66,
        isShowAuth: true
    },
    mutations: {
        SET_HEIGHT: (state, { height }) => {
            state.screenHeight = height
        },
        SET_DIALOG: (state, { val }) => {
            state.showAuthDialog = val
        },
        SET_AUTH: (state, auths) => {
            state.auths = auths
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
        },
        SET_ISSHOWAUTH: (state, m) => {
            state.isShowAuth = m
        }

    },
    actions: {
        setScreenHeight({ commit }, height) {
            commit('SET_HEIGHT', {
                height
            })
        },
        setShowAuthDialog({ commit }, val) {
            commit('SET_DIALOG', {
                val
            })
        },
        setAuths({ commit }, auths) {
            commit('SET_AUTH', auths)
        },
        setMenus({ commit }, m) {
            commit('SET_MENUS', m)
        },
        isSHowAuth({ commit }, m) {
            commit('SET_ISSHOWAUTH', m)
        }

    }
}

export default admin

