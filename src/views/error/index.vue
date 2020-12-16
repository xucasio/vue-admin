<template>
  <div style="height:100%;display: flex;flex-direction: column;">
    <el-header
      class="login-header"
      style="display: flex; align-items: center;">
      <img :src="Logo">
      <span style="color:#fff;font-size:20px;padding-left:10px">{{ Title }}</span>
    </el-header>
    <el-main class="login-main">
      {{ ERROR }}
    </el-main>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'

export default {
    name: 'Login',
    data: function() {
        return {
        }
    },
    computed: {
        ...mapState({
            Title: state => state.portal.title,
            Footer: state => state.portal.footer,
            Logo: state => state.portal.logo,
            IsModifyPWD: state => state.portal.isModifyPWD,
            CASAuthLoginUrl: state => state.portal.CASAuthLoginUrl,
            ERROR: state => state.portal.ERROR

        })
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style >
</style>

