<template>
  <div class="errorPage">
    <div class="error-content">
      <img
        src="~@/assets/admin/error403.png"
        alt="404">
      <div class="tips">抱歉，您无权访问该页面
        <el-button
          type="primary"
          @click="gotoBorad">返回首页
        </el-button>
      </div>
    </div>
  </div>

</template>
<script>
import common from '@/utils/common'
export default {
    data() {
        return {
            path: '/'
        }
    },
    mounted() {
        const menus = JSON.parse(sessionStorage.getItem('Menus'))
        this.path = common.getFirstPath(menus)
    },
    methods: {
        gotoBorad() {
            this.$router.replace(this.path)
        }
    }
}
</script>
<style lang="scss" scoped>
.errorPage{
  display: flex;
  width: 100%;
  height: calc(100vh);
  justify-content: center;
  align-items: center;
  .error-content{
    width: 30%;
    img{
      width: 100%;
    }
    .tips{
      font-size: 18px;
      color: #90A9C5;
      text-align: center;
      margin-top: 30px;
      .el-button{
        margin-left: 5px;
      }
    }
  }
}

</style>
