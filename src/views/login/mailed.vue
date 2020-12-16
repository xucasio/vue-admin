<template>
  <div style="height:100%;display: flex;flex-direction: column;">
    <el-header
      class="login-header"
      style="display: flex; align-items: center;">
      <img :src="Logo">
      <span style="color:#fff;font-size:25px;padding-left:10px">{{ Title }}</span>
    </el-header>
    <el-main class="login-main fogot-page">
      <div style="width:400px; display: flex;padding-bottom:10px;text-align:center">
        密码修改信息已经发送至您绑定的邮箱"@ViewData["email"]"，点击邮件中的链接即可重置密码。
      </div>
      <div style="width:400px;text-align:center">
        <a
          :href="'/index.html?PortalName='+PortalName"
          style="color:#0072bc;">返回登录页面</a>
      </div>

    </el-main>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
export default {
    name: 'Login',
    data: function() {
        return {
            form: {
                type: 'account',
                value: ''

            },
            disabled: false

        }
    },
    computed: {
        ...mapState({
            Title: state => state.portal.title,
            Footer: state => state.portal.footer,
            Logo: state => state.portal.logo,
            IsModifyPWD: state => state.portal.isModifyPWD,
            CASAuthLoginUrl: state => state.portal.CASAuthLoginUrl,
            ERROR: state => state.portal.ERROR,
            PortalName: state => state.portal.PortalName

        })
    },
    created() {

    },
    methods: {

    }
}
</script>
<style  >
</style>

