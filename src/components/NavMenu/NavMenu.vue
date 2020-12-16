<template>
  <div>
    <template v-for="list in menuList" >
      <el-submenu
        v-if="list.ChildMenus.length>0"
        :key="list.MenuId"
        :index="list.MenuId" >
        <template
          slot="title"
          style="padding-left:10px" >
          <i
            v-if="first"
            :class=" list.ImageUrl"/>
          <span slot="title">{{ list.MenuName }}</span>
        </template>
        <NavMenu
          :menu-list="list.ChildMenus"
          @menuclick="menuClick"/>
      </el-submenu>
      <el-menu-item
        v-else
        :index="list.MenuId"
        :key="list.MenuId">
        <i
          v-if="first"
          class="el-icon-menu"/>
        <span>{{ list.MenuName }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
    name: 'NavMenu',
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        first: {
            type: Boolean,
            default: false
        }
    }, // 模板名称
    data() {
        return {

        }
    },
    mounted() {
        console.log(this.menuList)
    },
    methods: {
        menuClick(item) {
            this.$emit('menuclick', item)
        }

    }

}
</script>
<style>
  .el-menu--collapse  span,
  .el-menu--collapse  i.el-submenu__icon-arrow
  {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
</style>
