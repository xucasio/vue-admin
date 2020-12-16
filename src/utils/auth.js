import Cookies from 'js-cookie'

const TokenKey = 'Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getStorage(key) {
    return sessionStorage.getItem(key)
}

export function setStorage(key, value) {
    return sessionStorage.setItem(key, value)
}
export function clearStorage(key) {
    return sessionStorage.removeItem(key)
}

