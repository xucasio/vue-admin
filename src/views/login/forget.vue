<template>
  <div class="forget-page">
    <el-header class="blue-header">
      <img src="@/assets/logo.png">
      <span class="logo-title"> <span style="font-weight:600">·</span> 找回密码</span>
      <GotoLogin
        style="float:right"
      />
    </el-header>
    <ForgetUI @login="gotoLogin()"/>
  </div>
</template>
<script>
import ForgetUI from '@/components/Forget/index.vue'
import { getStorage } from '@/utils/auth'
import GotoLogin from '@/components/Login/gotologin'
export default {
    name: 'ForgetPage',
    components: { ForgetUI, GotoLogin },
    methods: {
        gotoLogin() {
            this.$router.push({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
        }
    }
}
</script>
<style lang="scss">
.logo-title{
  width: 120px;
}
</style>
