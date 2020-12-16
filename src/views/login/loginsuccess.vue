<template>
  <div>LoginSuccess
    <CsAuthDialog
      v-if="showAuth"
      :islogin="true"
      class="login"
    />
  </div>

</template>
<script>
import { setStorage } from '@/utils/auth'
import { fetchUpmsAdminIndList } from '@/api/login'
import common from '@/utils/common'
export default {
    name: 'LoginSuccess',
    data() {
        return {
            showAuth: false
        }
    },
    mounted() {
        const token = common.getUrlKey('token')
        fetchUpmsAdminIndList(token).then(res => {
            this.handleLoginSuccess(res)
        })
    },
    methods: {
        handleLoginSuccess(res) {
            // this.$store.dispatch('setShowAuthDialog', true)
            setStorage('TOKEN', common.getUrlKey('token'))
            setStorage('USERID', res.UserID)
            setStorage('MYAPPID', 66)
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
                sessionStorage.setItem('ROLENAME', res.userAdminTypes[0].AdminTypeInfoFullName)
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

            // location.replace(url.replace(' ', ''))
            // if (this.returnUrl) {
            //     Cookies.set('name', 'value', { expires: 30, path: '' })
            //     location.replace(this.returnUrl + '?token=' + token)
            // }
        }
    }
}
</script>
