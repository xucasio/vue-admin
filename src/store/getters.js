const getters = {
    // eslint-disable-next-line no-unused-vars
    USER: (state, getter) => {
        return state.admin.userinfo
    },
    menus: (state, getter) => {
        return state.admin.menus
    }
}
export default getters
