<template>
  <div class="goto-login">
    <span class="has-title">已有账号? </span>
    <span
      class="go-login"
      @click="gotoLogin"> 请登录</span>
  </div>
</template>
<script>
import common from '@/utils/common.js'
export default {
    name: 'GoToLogin',
    data() {
        return {
            returnUrl: common.getUrlKey('returnUrl'),
            appId: common.getUrlKey('appId')
        }
    },
    methods: {
        gotoLogin() {
            this.$router.push({ path: '/Login', query: { returnUrl: this.returnUrl, appId: this.appId }})
        }

    }
}
</script>
<style scoped lang='scss'>
.goto-login{
  font-size: 14px;
  text-align: right;
  width: 100%;
  padding-top: 10px;
   .has-title{
     color: #C0C0C0;
   }
   .go-login{
     color: #fff;
     font-weight: 700;
     &:hover{
       text-decoration: underline;
       cursor: pointer;
     }
   }
}
</style>
