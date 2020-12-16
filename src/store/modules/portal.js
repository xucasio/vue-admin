const portal = {
    state: {
        title: '红楹',
        logo: '',
        footer: '',
        isModifyPWD: true,
        CASAuthLoginUrl: '',
        ERROR: '',
        PortalName: '',
        User: {
            UserID: '',
            Account: '',
            Token: '',
            UserName: '',
            Frequency: 0,
            HomeUrl: '',
            Url: ''
        }
    },
    mutations: {
        SET_PORTAL_INFO: (state, portal) => {
            state.title = portal.Title
            state.logo = portal.Logo
            state.footer = portal.Footer
            state.isModifyPWD = portal.IsModifyPWD
            state.CASAuthLoginUrl = portal.CASAuthLoginUrl
        },
        SET_ERROR_INFO: (state, error) => {
            state.ERROR = error
        },
        SET_PROTALUSER_INFO: (state, user) => {
            state.User = user
        },
        SET_PROTALNAME_INFO: (state, name) => {
            state.PortalName = name
        }
    },
    actions: {
        setPortalInfo({ commit }, portal) {
            commit('SET_PORTAL_INFO', portal)
        },
        setErrorInfo({ commit }, error) {
            commit('SET_ERROR_INFO', error)
        },
        setPortalUserInfo({ commit }, user) {
            commit('SET_PROTALUSER_INFO', user)
        },
        setPortalName({ commit }, name) {
            commit('SET_PROTALNAME_INFO', name)
        }
    }
}

export default portal

