import { Loading } from 'element-ui'

let loadingCount = 0
let loading

const startLoading = (el) => {
    console.log(el)
    loading = Loading.service({
        lock: false,
        target: document.querySelector(el)
    })
}

const endLoading = () => {
    loading.close()
}

export const showLoading = (el) => {
    if (loadingCount === 0) {
        startLoading(el)
    }
    loadingCount += 1
}

export const hideLoading = () => {
    if (loadingCount <= 0) {
        return
    }
    loadingCount -= 1
    if (loadingCount === 0) {
        endLoading()
    }
}
