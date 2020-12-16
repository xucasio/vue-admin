const user = {
    state: {
        userinfo: {
            UserId: '',
            UserName: '',
            UserCode: '',
            Token: ''
        }
    },
    mutations: {
        SET_USER_INFO: (state, user) => {
            state.userinfo = user
        }
    },
    actions: {
        setUserInfo({ commit }, user) {
            commit('SET_USER_INFO', {
                UserId: user.userId,
                UserName: user.userName,
                UserCode: user.userCode,
                Token: user.token
            })
        }
    }
}

export default user

