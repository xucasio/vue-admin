<template>
  <div class="drawer">
    <div class="title">
      <span>{{ title }}</span>
      <i
        class="btn el-icon-close"
        @click="closeDrawer"/>
    </div>
    <div class="content">
      <div class="rolers">
        <el-tag
          v-for="(item, index) in rolers"
          :key="index">{{ item.RoleName }}</el-tag>
        <p
          v-if="!rolers.length"
          class="notag">暂无数据</p>
      </div>
    </div>

  </div>

</template>
<script>
export default {
    name: 'AuthRoles',
    props: {
        rolers: {
            type: Array,
            default: () => {
                return []
            }
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    computed: {
    },
    created() {

    },
    methods: {
        closeDrawer() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
  .drawer{
    .title{
      padding: 15px 15px;
      display: flex;
      justify-content: space-between;
      background-color: $--color-main;
      span{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      }
      i{
        color: #fff;
        cursor: pointer;
      }
    }
    .mtb10{
      margin: 10px 0;
    }
    .content{
      padding: 15px;
      .rolers{
        min-height: 100px;
        .notag{
          margin-top: 50px;
          text-align: center;
          color: #909399;
        }
      }
    }

  }
</style>
