<template>
  <div
    class="views-content "
    style="padding:10px 0px 30px 0px">
    <div class="content-row notice-tab-row">
      <div class="notice-tab">
        <div
          :class="['notice-tab-item', active===1?'active':'']"
          @click="gotoView(1)" >组织权限 <i class="active-icon"/> </div>
        <div
          :class="['notice-tab-item', active===2?'active':'']"
          @click="gotoView(2)">个人权限</div>
      </div>
    </div>
    <div class="notice-subpage">
      <router-view/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import personalRole from './personalRole'
import orgRole from './orgRole'
export default {
    name: 'RoleNotice',
    components: {
        personalRole, orgRole
    },
    data() {
        return {
            active: 1
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    watch: {
        $route(to, from) {
            if (to.path === '/notice/orgRole') {
                this.active = 1
            }
            if (to.path === '/notice/personalRole') {
                this.active = 2
            }
        }
    },
    mounted() {
        if (this.$route.path === '/notice/orgRole') {
            this.active = 1
        } else if (this.$route.path === '/notice/personalRole') {
            this.active = 2
        }
    },
    methods: {
        gotoView(v) {
            if (v === this.active) {
                return
            }
            this.active = v
            this.$router.push(v === 1 ? '/notice/orgRole' : '/notice/personalRole')
        }
    }
}
</script>
<style lang="scss">
.notice-tab{
  position: absolute;
  left: -0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  font-size: 14px;
  .notice-tab-item{
    padding: 0 20px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    position: relative;
    &.active{
      border-bottom: 1px solid $--color-main;
      color: $--color-main;
      &:before{
        content:"";
        width:0;
        height:0;
        position: absolute;
        top: 34px;
        left: 44px;
        border-right:solid 6px transparent;
        border-left:solid 6px transparent;
        border-bottom:solid 6px $--color-main;
      }
    }

  }

}
.notice-subpage{
    padding: 30px;
}
.notice-tab-row{
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #DBDDE5;

}
</style>

