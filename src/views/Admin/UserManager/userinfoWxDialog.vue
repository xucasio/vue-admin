<template>
  <wxlogin
    :self_redirect="true"
    :redirect_uri="url"
    appid="wx0e2a1895724e548d"
    scope="snsapi_login"/>
</template>
<script>
import wxlogin from 'vue-wxlogin'
import api from '@/api/api'
import { getStorage } from '@/utils/auth'
export default {
    name: 'WxDialog',
    components: { wxlogin },
    data() {
        var returnUrl = api.wxcodereturn
        var failUrl = api.wxcodefail
        return {
            url: encodeURIComponent(api.wxcodebackurl + '?token=' + getStorage('TOKEN') + '&returnUrl=' + encodeURIComponent(returnUrl) + '&failUrl=' + encodeURIComponent(failUrl))
        }
    },
    mounted() {

    }
}
</script>
