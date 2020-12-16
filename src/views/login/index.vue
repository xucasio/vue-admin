<template>
  <div
    style="height:100%;display: flex;flex-direction: column;"
    class="login-page">
    <el-header
      class="login-header"
      style="display: flex;align-items: center;">
      <img src="@/assets/login/csmar-logo.png">
    </el-header>
    <el-main class="login-main">
      <ULogin
        @forget="handleForget"
        @register="handleRegister"
        @success="handleLoginSuccess"/>
    </el-main>
    <el-footer style=" height: 30px;color:#666666;font-size:12px;line-height:30px">Copyright © 2020 CSMAR. All Rights Reserved. 粤ICP备19079937号</el-footer>
    <CsAuthDialog
      v-if="showAuth"
      :islogin="true"
      class="login"
    />
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
import common from '@/utils/common'
import { setStorage } from '@/utils/auth'
// import md5 from 'js-md5'
import ULogin from '@/components/Login'
export default {
    name: 'Login',
    components: { ULogin },
    data: function() {
        return {
            returnUrl: common.getUrlKey('returnUrl'),
            appId: common.getUrlKey('appId'),
            showAuth: false
        }
    },
    mounted() {
        console.log(window.APIURL)
    },
    methods: {
        handleForget() {
            // this.$router.push('/forgot')
            this.$router.push({ path: '/forgot', query: { returnUrl: this.returnUrl, appId: this.appId }})
        },
        handleLoginSuccess(res) {
            // this.$store.dispatch('setShowAuthDialog', true)
            setStorage('TOKEN', res.Token)
            setStorage('USERID', res.UserID)
            setStorage('MYAPPID', this.appId)
            sessionStorage.setItem('NAME', res.RealName)
            if (res.userAdminTypes && res.userAdminTypes.length > 0) {
                if (res.userAdminTypes[0].ADMIN_TYPE_ID !== 0) {
                    res.userAdminTypes.push({
                        ACCOUNT_COUNT: 0,
                        ADMIN_TYPE_ID: -1,
                        ADMIN_TYPE_INFO_ID: -1,
                        ADMIN_TYPE_INFO_NAME: '普通用户',
                        AdminTypeInfoFullName: '普通用户',
                        ADMIN_TYPE_NAME: '普通用户',
                        APPLICATION_ID: 0,
                        APPLICATION_MARK: '' })
                } else {
                    // 超级管理只有一个身份
                    this.$store.dispatch('isSHowAuth', false)
                }
                this.$store.dispatch('setAuths', res.userAdminTypes)
                // this.$store.dispatch('setAuths', res.userAdminTypes)
                sessionStorage.setItem('AUTH', JSON.stringify(res.userAdminTypes))
                setStorage('TYPEID', res.userAdminTypes[0].ADMIN_TYPE_ID)
                setStorage('PTYPEID', res.userAdminTypes[0].ADMIN_TYPE_INFO_ID)
                setStorage('APPMARK', res.userAdminTypes[0].APPLICATION_MARK)
                setStorage('APPID', res.userAdminTypes[0].APPLICATION_ID)
                sessionStorage.setItem('ROLENAME', res.userAdminTypes[0].ADMIN_TYPE_INFO_NAME)
                if (res.userAdminTypes.length > 1) {
                    this.showAuth = true
                } else {
                    this.$router.push('/dashboard')
                }

                // this.$router.push('/home')
            } else {
                var userAdmin = [{
                    ACCOUNT_COUNT: 0,
                    ADMIN_TYPE_ID: -1,
                    ADMIN_TYPE_INFO_ID: -1,
                    ADMIN_TYPE_INFO_NAME: '普通用户',
                    AdminTypeInfoFullName: '普通用户',
                    ADMIN_TYPE_NAME: '普通用户',
                    APPLICATION_ID: 0,
                    APPLICATION_MARK: '0' }]
                this.$store.dispatch('setAuths', userAdmin)
                this.$store.dispatch('isSHowAuth', false) // 只有普通用户身份
                sessionStorage.setItem('AUTH', JSON.stringify(userAdmin))
                setStorage('TYPEID', -1)
                setStorage('PTYPEID', -1)
                setStorage('APPMARK', '0')
                setStorage('APPID', '0')
                sessionStorage.setItem('ROLENAME', '普通用户')
                this.$router.push({ path: '/role/authList2', query: { appId: this.appId }})
            }
        },
        handleRegister() {
            // this.$router.push('/register')
            this.$router.push({ path: '/register', query: { returnUrl: this.returnUrl, appId: this.appId }})
        }

    }
}
</script>
<style lang="scss" >

</style>

