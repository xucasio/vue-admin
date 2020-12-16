<template>
  <div
    class="views-content "
    style="padding:10px 0px 30px 0px">
    <div class="content-row audit-tab-row">
      <div class="audit-tab">
        <div
          :class="['audit-tab-item', active===1?'active':'']"
          @click="gotoView(1)" >审计列表 <i class="active-icon"/> </div>
        <div
          :class="['audit-tab-item', active===2?'active':'']"
          @click="gotoView(2)">审计历史</div>
      </div>
    </div>
    <div class="audit-subpage">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Useraudit',
    data() {
        return {
            active: 1
        }
    },
    watch: {
        $route(to, from) {
            if (to.path === '/audit/auditlist') {
                this.active = 1
            }
            if (to.path === '/audit/audithis') {
                this.active = 2
            }
        }

    },
    mounted() {
        if (this.$route.path === '/audit/auditlist') {
            this.active = 1
        } else if (this.$route.path === '/audit/audithis') {
            this.active = 2
        }
    },
    methods: {
        gotoView(v) {
            console.log('vvvv:', v)
            if (v === this.active) {
                return
            }
            this.active = v
            this.$router.push(v === 1 ? '/audit/auditlist' : '/audit/audithis')
        }
    }
}
</script>
<style lang="scss">
.audit-tab{
  position: absolute;
  left: -0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  font-size: 14px;
  .audit-tab-item{
    width: 100px;
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
        left: 47px;
        border-right:solid 6px transparent;
        border-left:solid 6px transparent;
        border-bottom:solid 6px $--color-main;
      }
    }

  }

}
.audit-subpage{
    padding: 30px;
}
.audit-tab-row{
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #DBDDE5;

}
</style>
