<template>
  <div class="cs-auth-dialog">
    <div class="auth-dialog-body">
      <i
        v-if="!islogin"
        class="el-icon-circle-close"
        @click="handleClose"/>
      <div class="dialog-body-header"/>
      <div class="dialog-body-title">请选择身份进入</div>
      <div class="dialog-body-box">
        <div
          v-for="(au) in auths"
          :key="au.ADMIN_TYPE_INFO_ID"
          class="dialog-body-row">
          <el-radio
            v-model="value"
            :label="au.ADMIN_TYPE_INFO_ID+''">{{ au.AdminTypeInfoFullName }}</el-radio>
        </div>
      </div>
      <div class="dialog-body-btn">
        <el-button
          type="primary"
          round
          @click="goNow">立即进入</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
import { getStorage, setStorage } from '@/utils/auth'
import { fetchGetMenus } from '@/api/admin'
import { fetchUpdateLoginlog } from '@/api/log'
export default {
    name: 'CsAuthDialog',
    props: {
        islogin: {
            type: Boolean,
            default: false
        }

    },
    data() {
        return {
            value: '',
            auths: [],
            menus: []
        }
    },
    // computed: {
    //     ...mapState({
    //         auths: state => state.admin.auths
    //     })
    // },
    mounted() {
        this.value = getStorage('PTYPEID')
        if (sessionStorage.getItem('AUTH')) {
            this.auths = JSON.parse(sessionStorage.getItem('AUTH'))
            if (this.auths && this.auths.length === 1) {
                this.$store.dispatch('isSHowAuth', false)
                this.$emit('close')
            } else {
                this.$store.dispatch('isSHowAuth', true)
            }
        }
    },
    methods: {
        handleClose() {
            this.$emit('close')
        },
        async goNow() {
            var item = this.auths.find(f => (f.ADMIN_TYPE_INFO_ID + '') === this.value)
            setStorage('TYPEID', item.ADMIN_TYPE_ID)
            setStorage('PTYPEID', item.ADMIN_TYPE_INFO_ID)
            setStorage('APPMARK', item.APPLICATION_MARK)
            setStorage('APPID', item.APPLICATION_ID)
            sessionStorage.setItem('ROLENAME', item.AdminTypeInfoFullName)
            // 如果是登录，登记，切换身份不登记 登录日志
            if (this.$route.path === '/Login') {
                this.updateLoginlog({ AdminTypeId: item.ADMIN_TYPE_ID, Token: getStorage('TOKEN') })
            }
            if (getStorage('TYPEID') === '-1') {
                this.menus = [
                    {
                        Childen: [],
                        MenuIcon: 'iconjiaosequanxian',
                        MenuId: 1,
                        MenuName: '权限列表',
                        MenuUrl: '/role/authList2',
                        ParentMenuId: 0
                    },
                    {
                        Childen: [],
                        MenuIcon: 'iconxitongquanxian',
                        MenuId: 2,
                        MenuName: '组织管理',
                        MenuUrl: '/org/orgapply',
                        ParentMenuId: 0
                    }
                ]
                sessionStorage.setItem('Menus', JSON.stringify(this.menus))
            } else {
                const menuRes = await this.getMenus()
                this.menus = menuRes.MenuPointList || []
                sessionStorage.setItem('Menus', JSON.stringify(this.menus))
            }
            this.$emit('close')
            this.$router.push(this.getPath())
            // 从登录页选择角色跳转，会直接刷新登录页
            setTimeout(() => {
                if (this.$route.path !== '/Login') {
                    window.location.reload()
                }
            }, 500)
            //  window.location.reload()
            // if (item.ADMIN_TYPE_ID === -1) {
            //     if (this.islogin) {
            //         this.$router.push('/role/authList2')
            //         return
            //     }
            //     if (['/org/orgapply', '/org/orglist', '/role/authList2'].indexOf(this.$route.path) >= 0) {
            //         window.location.reload()
            //     } else {
            //         this.$router.push('/role/authList2')
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //         //  window.location.reload()
            //     }
            // } else {
            //     if (this.islogin) {
            //         this.$router.push('/home/user')
            //         return
            //     }
            //     if (['/org/orgapply', '/org/orglist', '/role/authList2'].indexOf(this.$route.path) >= 0) {
            //         this.$router.push('/home/user')
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //     } else {
            //         window.location.reload()
            //     }
            // }
        },
        updateLoginlog(params) {
            fetchUpdateLoginlog(params).then((res) => {

            }).catch((er) => {

            })
        },
        getMenus() {
            return fetchGetMenus({ AdminTypeId: getStorage('TYPEID') })
        },
        // 获得切换身份时候要跳转的路径
        getPath() {
            let path = ''
            let going = true
            const fn = (arr, url) => {
                arr.forEach(item => {
                    if (item.MenuUrl === url) {
                        going = false
                        path = item.MenuUrl
                    }
                    if (item.Childen.length && going) {
                        fn(item.Childen, url)
                    }
                })
            }
            fn(this.menus, this.$route.path)
            if (!path) {
                const [{ Childen }] = this.menus
                if (Childen.length) {
                    const [{ MenuUrl }] = Childen
                    path = MenuUrl
                } else {
                    const [{ MenuUrl }] = this.menus
                    path = MenuUrl
                }
            }
            return path
        }
    }
}
</script>
<style lang="scss">
.cs-auth-dialog{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // opacity: 0.5;
    background: rgba(14, 13, 13, 0.5);
    z-index: 4000;
    background-color: rgba(14,13,13,.5);
    backdrop-filter: saturate(100%) blur(4px);
    &.login{
        background-color: rgba(14, 13, 13, 0.7);
        backdrop-filter: saturate(100%) blur(7px);
        // backdrop-filter: none;
    }
    &:focus{
      outline: none;
    }
    .auth-dialog-body{
      position: absolute;
      position:relative;
      width: 400px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      left:50%;
      top: 50%;
      border-radius: 10px;
      transform: translateX(-50%) translateY(-50%);

     .el-icon-circle-close{
       position:absolute;
       right: 10px;
       top: 10px;
       font-size: 30px;
       cursor: pointer;
       color: #CFE6FF;
       &:hover{
         color: #fff;
       }
     }
     .dialog-body-header{
       height: 181px;
       background-image: url('../../assets/admin/auth-dialog-top.png');
       background-repeat: no-repeat;
       background-size: contain;
     }
     .dialog-body-title{
       padding: 30px 0;
       font-size:20px;
       color: #3B3F5C;
       font-weight:bold;
       text-align: center;
     }
     .dialog-body-box{
       max-height: 188px;
       overflow-y: auto;
       .dialog-body-row{
         padding:10px 40px;
         .el-radio__label{
           font-size: 16px;
         }

       }
     }
     .dialog-body-btn{
       padding: 30px 0;
       text-align: center;

     }
    }

}
</style>
