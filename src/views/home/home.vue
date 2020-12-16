<template>
  <div class="main-page">
    <div class="main-container">
      <div :class="['container-left' ,isCollapse&&'isCollapse'] ">
        <div class="logo-img">
          <div
            v-if="!isCollapse"
            class="logo"/>
          <div
            v-if="isCollapse"
            class="logo logo-collapse"/>
        </div>
        <cs-menu
          :iscollapse="isCollapse"
          :menus="menus"/>
      </div>
      <div class="container-right">
        <div class="container-header">
          <div class="sys-title">UPMS统一权限管理系统</div>
          <div class="sys-info">
            <el-dropdown
              class="notice-box"
              @command="noticeClick">
              <span class="el-dropdown-link">
                <div
                  v-tip="noticeList.length?'':'暂无新消息'"
                  class="icon icon-msg notice">
                  <!-- <p
                    class="new"/> -->
                  <p
                    v-if="noticeList.length"
                    class="new"/>
                </div>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-tooltip
                  :content="item.MessageContent"
                  placement="bottom"
                  effect="light">

                </el-tooltip> -->
                <el-dropdown-item
                  v-for="(item, index) in noticeList"
                  :title="item.MessageContent"
                  :key="index"
                  :command="index">{{ item.MessageContent }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip
              v-if="isShowAuth"
              class="item"
              effect="dark"
              content="点击切换身份"
              placement="bottom-start">
              <div
                class="icon icon-change"
                @click="changeAuth"/>
            </el-tooltip>
            <el-dropdown
              @command="handleCommand">
              <div class="myinfo-dd"> <div class="icon icon-info"/> <span>{{ roleName }}</span></div>
              <el-dropdown-menu
                slot="dropdown"
                class="userInfo">
                <el-dropdown-item
                  command="d"> <div class="dropdown-row"> <i class="icon-myinfo"/> <div
                    v-tip="UserName"
                    class="name"> {{ UserName }}</div> </div> </el-dropdown-item>
                <el-dropdown-item
                  v-if="getStorage('TYPEID') != 0"
                  command="a"> <div class="dropdown-row"> <i class="icon-myinfo"/> 个人信息 </div> </el-dropdown-item>
                <el-dropdown-item command="b"> <div class="dropdown-row"> <i class="icon-update"/> 修改密码 </div></el-dropdown-item>
                <el-dropdown-item
                  command="c"><div class="dropdown-row"> <i class="icon-logout"/> 退出 </div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="container-page">
          <div class="bread-row">
            <div
              :class="['collage-icon',isCollapse?'right':'left']"
              @click="handelCollage"/>
            <cs-breadcrumb/>
          </div>
          <div class="pages-view">
            <!--使用keep-alive会将页面缓存-->
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"/>
          </div>

        </div>
      </div>
    </div>
    <CsAuthDialog
      v-if="showAuth"
      @close="handleCloseAuth"/>
  </div>
</template>
<script >
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
// eslint-disable-next-line no-unused-vars
// import Vue from 'vue'

import { fetchSystemMessage, readMessage } from '@/api/log'
import common from '@/utils/common'
import { setStorage, getStorage } from '@/utils/auth'
import { fetchGetMenus } from '@/api/admin'
import { fetchUpdatePWDTip } from '@/api/user'

export default {
    name: 'HomePage',
    components: { },
    props: {
        propMessage: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            msg: '',
            isCollapse: false,
            appId: common.getUrlKey('appId'),
            menus: [],
            UserName: '',
            roleName: '',
            noticeList: [], // 消息列表
            timer: null
        }
    },
    computed: {
        ...mapState({
            showAuth: (state) => state.admin.showAuthDialog,
            isShowAuth: (state) => state.admin.isShowAuth
        })
    },
    created() {
        // 获取菜单
        this.getMenus()
        this.UserName = sessionStorage.getItem('NAME')
        this.roleName = sessionStorage.getItem('ROLENAME')
        const userInfo = JSON.parse(sessionStorage.getItem('AUTH'))
        // 只有一个身份不需要切换
        if (userInfo instanceof Array && userInfo.length <= 1) {
            this.$store.state.admin.isShowAuth = false
        }
        this.getSysMessage()
        // this.roleName = userInfo[0].ADMIN_TYPE_INFO_NAME
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.getSysMessage()
            }, 5 * 60 * 1000)
        }
        setTimeout(() => {
            this.UpdatePWDTip()
        }, 1000)
    },
    methods: {
        getStorage,
        getMenus() {
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
                // this.$store.dispatch('setMenus', this.menus)
                sessionStorage.setItem('Menus', JSON.stringify(this.menus))
                return
            }
            fetchGetMenus({ AdminTypeId: getStorage('TYPEID') }).then(res => {
                this.menus = res.MenuPointList
                // 构造路由列表
                var routers = []
                this.menus.forEach(m => {
                    if (m.Childen.length > 0) {
                        m.Childen.forEach(mc => {
                            routers.push(mc)
                        })
                    } else {
                        routers.push(m)
                    }
                })
                // this.$store.dispatch('setMenus', routers)
                sessionStorage.setItem('Menus', JSON.stringify(this.menus))
            })
        },
        msgBtn(ev) {
            this.msg = '点击了typescript'
            console.log('点击事件', ev)
        },
        handleOpen() {

        },
        handleClose() {

        },
        handelCollage() {
            this.isCollapse = !this.isCollapse
        },
        changeAuth() {
            this.$store.dispatch('setShowAuthDialog', true)
        },
        handleCloseAuth() {
            this.$store.dispatch('setShowAuthDialog', false)
        },
        handleCommand(command) {
            switch (command) {
                    case 'a':
                        this.$router.push({ path: '/home/userInfo' })
                        break
                    case 'b':
                        this.$router.push({ path: '/home/modifyPw' })
                        break
                    case 'c':
                        setStorage('TOKEN', '')
                        sessionStorage.setItem('Menus', [])
                        this.$router.push({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
                        break
            }
        },
        noticeClick(command) {
            const type = +this.noticeList[command].Type
            let ID
            switch (type) {
                    case 0:
                        ID = this.noticeList[command].MessageData.EXPIREAUTHID
                        break
                    case 1:
                        ID = this.noticeList[command].MessageData.EXPIREUSERAUTHID
                        break
                    case 2:
                        ID = this.noticeList[command].MessageData.ORGANIZAION_APPLY_MESSAGE_ID
                        break
            }
            readMessage({ Type: type, ID }).then(res => {
                this.getSysMessage()
            }) // 更新已读消息
            this.jumpRule(type)
        },
        getSysMessage() {
            fetchSystemMessage({ PageSize: 10, UserID: getStorage('USERID'), AdminTypeInfoID: getStorage('PTYPEID') }).then(res => {
                this.noticeList = res || []
            })
        },
        UpdatePWDTip() {
            // 每次登陆都提示
            var userId = getStorage('USERID')
            fetchUpdatePWDTip(userId).then(res => {
                if (res) {
                    this.$confirm(res, '提示', {
                        confirmButtonText: '前往修改',
                        cancelButtonText: '取消'
                    }).then(() => {
                        // 跳转到修改密码页面
                        this.$router.push({ path: '/home/modifyPw' })
                    }).catch((ex) => {
                        console.log(ex)
                        // this.$message({
                        //     type: 'info',
                        //     message: '已取消'
                        // })
                    })
                }
            }).catch(() => {

            })
        },
        jumpRule(type) {
            const a1 = [0, 1, 3] // 超管、系管、产管
            const a2 = [4] // B端管理员
            const a3 = [2] // 平台管理员
            const a4 = [5] // 交易所审计
            const a5 = [-1] // 普通用户

            if (a1.indexOf(+getStorage('TYPEID')) > -1) {
                switch (type) {
                        case 0:
                            this.$router.push('/notice/orgRole')
                            break
                        case 1:
                            this.$router.push('/notice/personalRole')
                            break
                }
            } else if (a2.indexOf(+getStorage('TYPEID')) > -1) {
                switch (type) {
                        case 0:
                            this.$router.push('/role/authList2')
                            break
                        case 2:
                            this.$router.push('/audit/auditlist')
                            break
                }
            } else if (a3.indexOf(+getStorage('TYPEID')) > -1) {
                switch (type) {
                        case 0:
                            this.$router.push('/role/authList3')
                            break
                }
            } else if (a4.indexOf(+getStorage('TYPEID')) > -1) {
                this.noticeList = []
            } else if (a5.indexOf(+getStorage('TYPEID')) > -1) {
                switch (type) {
                        case 1:
                            this.$router.push('/role/authList2')
                            break
                        case 2:
                            this.$router.push('/org/orglist')
                            break
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.icon.notice{
  position: relative;
  .new{
    position:absolute;
    top:-15px;
    right: 0px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgb(248, 19, 19);
  }
}
.el-dropdown-menu{
  max-height: 300px;
  overflow-y: auto;
  max-width: 450px;
  top:50px !important;
  .el-dropdown-menu__item{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.el-dropdown{
  .focusing{
    outline-color: transparent;
  }
}
/*修改滚动条样式*/
// div::-webkit-scrollbar{
//   width:10px;
//   height:2px;
// }
// div::-webkit-scrollbar-track{
//   background: rgb(239, 239, 239);
//   border-radius:2px;
// }
// div::-webkit-scrollbar-thumb{
//   background: #bfbfbf;
//   border-radius:10px;
// }
// div::-webkit-scrollbar-thumb:hover{
//   background: #333;
// }
// div::-webkit-scrollbar-corner{
//   background: #179a16;
// }
</style>
