<template>
  <div
    class="views-content "
    style="padding:10px 0px 30px 0px">
    <div class="content-row analysis-tab-row">
      <div class="analysis-tab">
        <div
          :class="['analysis-tab-item', active===1?'active':'']"
          @click="gotoView(1)" >数据统计 <i class="active-icon"/> </div>

        <div
          :class="['analysis-tab-item', active===2?'active':'']"
          @click="gotoView(2)">统计报表</div>
      </div>
    </div>
    <div class="analysis-subpage">
      <router-view/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import dataAnalysis from './dataAnalysis'
import analysisList from './analysisList'
export default {
    name: 'RoleAnalysis',
    components: {
        dataAnalysis, analysisList
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
            if (to.path === '/dashboard/dataAnalysis') {
                this.active = 1
            }
            if (to.path === '/dashboard/analysisList') {
                this.active = 2
            }
        }

    },
    mounted() {
        if (this.$route.path === '/dashboard/dataAnalysis') {
            this.active = 1
        } else if (this.$route.path === '/dashboard/analysisList') {
            this.active = 2
        }
    },
    methods: {
        gotoView(v) {
            if (v === this.active) {
                return
            }
            this.active = v
            this.$router.push(v === 1 ? '/dashboard/dataAnalysis' : '/dashboard/analysisList')
        }
    }
}
</script>
<style lang="scss">
.analysis-tab{
  position: absolute;
  left: -0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  font-size: 14px;
  .analysis-tab-item{
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
.analysis-subpage{
    padding: 30px;
}
.analysis-tab-row{
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #DBDDE5;

}
</style>

