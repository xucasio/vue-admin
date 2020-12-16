<template>
  <el-menu
    :collapse="iscollapse"
    :router="true"
    :default-active="routerPath(this.$route)"
    class="el-menu-vertical-demo"
    background-color="#060817"
    unique-opened
    text-color="#888EA8"
    active-text-color="#fff"
  >
    <template
      v-for="menu in menus"
    >
      <el-menu-item
        v-if="menu.Childen.length<=0"
        :index="menu.MenuUrl"
        :key="menu.MenuId"
        class="supItem">
        <i :class="'iconfont-menu iconfont '+menu.MenuIcon"/>
        <span slot="title">{{ menu.MenuName }}</span>
      </el-menu-item>
      <el-submenu
        v-if="menu.Childen.length>0"
        :key="menu.MenuId"
        :index="menu.MenuId+''">
        <template slot="title">
          <i :class="'iconfont-menu  iconfont '+menu.MenuIcon"/>
          <span>{{ menu.MenuName }}</span>
        </template>
        <el-menu-item
          v-for="ms in menu.Childen"
          :index="ms.MenuUrl"
          :key="ms.MenuId"> <i class="icon-pre"/> {{ ms.MenuName }}</el-menu-item>
      <!-- <el-menu-item index="/role/roleList">角色列表</el-menu-item>
      <el-menu-item index="/role/specialAuthSet">特殊管理员权限设置</el-menu-item>
      <el-menu-item index="/role/authSet">默认权限设置</el-menu-item>
      <el-menu-item index="/role/mutilOption">批量操作</el-menu-item> -->
      </el-submenu>
    </template>
    <!-- <el-menu-item index="/home">
      <i class="el-icon-menu"/>
      <span slot="title">账号管理</span>
    </el-menu-item>
    <el-submenu index="/role">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>角色权限</span>
      </template>
      <el-menu-item index="/role/authList">权限列表</el-menu-item>
      <el-menu-item index="/role/authList2">权限列表(列表)</el-menu-item>
      <el-menu-item index="/role/roleList">角色列表</el-menu-item>
      <el-menu-item index="/role/specialAuthSet">特殊管理员权限设置</el-menu-item>
      <el-menu-item index="/role/authSet">默认权限设置</el-menu-item>
      <el-menu-item index="/role/mutilOption">批量操作</el-menu-item>
    </el-submenu>
    <el-submenu index="/sysright">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>系统权限</span>
      </template>
      <el-menu-item index="/sysright/managerlist">管理员列表</el-menu-item>
      <el-menu-item index="/sysright/productlist">平台产品列表</el-menu-item>
    </el-submenu>
    <el-menu-item index="/tob">
      <i class="el-icon-menu"/>
      <span slot="title">B端管理</span>
    </el-menu-item>
    <el-menu-item index="/bmlist">
      <i class="el-icon-menu"/>
      <span slot="title">B端管理员</span>
    </el-menu-item>
    <el-submenu index="/bsysright">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>B权限管理</span>
      </template>
      <el-menu-item index="/bsysright/labellist">标签管理</el-menu-item>
      <el-menu-item index="/role/authList">权限列表</el-menu-item>
    </el-submenu>
    <el-submenu index="/audit">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>流程审核</span>
      </template>
      <el-menu-item index="/audit/auditlist">流程列表</el-menu-item>
      <el-menu-item index="/audit/audithis">流程历史</el-menu-item>
    </el-submenu>
    <el-submenu index="/org">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>组织管理</span>
      </template>
      <el-menu-item index="/org/orgapply">申请列表</el-menu-item>
      <el-menu-item index="/org/orglist">组织列表</el-menu-item>
    </el-submenu> -->
    <!-- <el-submenu index="/log">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>日志管理</span>
      </template>
      <el-menu-item index="/log/loginLog">登录日志</el-menu-item>
      <el-menu-item index="/log/optionLog">操作日志</el-menu-item>
    </el-submenu>
    <el-submenu index="/notice">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>日志管理</span>
      </template>
      <el-menu-item index="/notice/roleNotice">权限通知</el-menu-item>
    </el-submenu> -->
    <!-- <el-submenu index="/dashboard">
      <template slot="title">
        <i class="el-icon-location"/>
        <span>Dashboard</span>
      </template>
      <el-menu-item index="/dashboard/userAnalysis">用户分析</el-menu-item>
      <el-menu-item index="/dashboard/roleAnalysis">权限分析</el-menu-item>
    </el-submenu> -->
  </el-menu>
</template>
<script>
export default {
    name: 'CsMenu',
    props: {
        iscollapse: {
            type: Boolean,
            default: false
        },
        menus: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            defaultActive: ''
        }
    },
    mounted() {
        this.defaultActive = this.$route.path
    },
    methods: {
        routerPath(route) {
            // 页面路由左侧菜单高亮问题
            if (this.$route.meta.pageMenu) {
                console.log('当前路径', this.$route.meta.pageMenu)
                return this.$route.meta.pageMenu
            } else {
                console.log('当前路径', route.path)
                return route.path
            }
        }
    }

}
</script>
<style lang="scss">
.el-menu-vertical-demo{
   margin: 0 10px;
  &.el-menu--collapse{
     margin: 0;
  }

}
  .el-submenu__title{
    color: rgb(136, 142, 168)  !important;
  }
  .el-submenu__title i{
       color: rgb(136, 142, 168);
  }
.supItem.el-menu-item.is-active{
  border: 1px solid #2B2A3F;
  border-radius: 6px;
  background: #191b30 !important;
}
.el-submenu.is-active{
  margin: 0 ;
  border: 1px solid #2B2A3F;
  border-radius: 6px;
  background: #1C1A2F !important;
  overflow: hidden;
  .el-submenu__title{
    background: #191b30 !important;
    color: #fff  !important;
    border-radius: 6px;
  }
  .el-submenu__title i{
       color: #fff;
  }
  .el-menu-item{
     background: #191b30 !important;
     height: 46px !important;
     line-height: 46px !important;
    //  border-bottom-left-radius: 4px;
    //  border-bottom-right-radius: 4px;
  }
  li.el-menu-item:hover{
    // background: #222944 !important;
    color:#fff  !important;
    .icon-pre{
     background-color: #fff;
    }
     .iconfont-menu{
      color:#fff  !important;
  }
  }
  .el-menu-item.is-active{
   background:#232942 !important;
  .icon-pre{
     background-color: #fff;
  }

}

}
li.el-menu-item:hover,.el-submenu__title:hover{
  // background: #222944 !important;
  color:  #fff  !important;
  i.iconfont-menu{
    color: #fff  !important;
  }
  span{
    color:  #fff  !important;
  }
   .icon-pre{
     background-color:#fff;
  }
   .iconfont-menu{
      color:#fff  !important;
  }
  .el-submenu__icon-arrow{
    color:#fff  !important;
  }
}
.icon-pre{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  color: inherit;
  background-color: #888ea8;
}
.el-menu-item.is-active{
   background: #222944 !important;
  .icon-pre{
     background-color:#fff;
  }
  .iconfont-menu{
      color: #fff  !important;
  }

}
.el-menu-item{
    height: 46px !important;
    line-height: 46px !important;
}
.el-menu-item i{
  color: #888ea8;
}
</style>
