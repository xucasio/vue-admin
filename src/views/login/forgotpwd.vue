<template>
  <div style="height:100%;display: flex;flex-direction: column;">
    <el-header
      class="login-header"
      style="display: flex; align-items: center;">
      <img :src="Logo">
      <span style="color:#fff;font-size:25px;padding-left:10px">{{ Title }}</span>
    </el-header>
    <el-main class="login-main fogot-page">
      <div style="width:300px; display: flex;padding-bottom:10px;">
        <div style="width: 80px;">
          <el-select
            v-model="form.type"
            placeholder="类型">
            <el-option
              label="账号"
              value="account"/>
            <el-option
              label="邮件"
              value="mail"/>
          </el-select>
        </div>
        <div style="flex: 1;width: 210px; padding-left: 10px;">
          <el-input
            v-model="form.value"
            placeholder=""/>
        </div>
      </div>
      <div style="width:300px;text-align:right">
        <el-button
          :loading="disabled"
          style="width:210px"
          type="primary"
          @click="onSubmit">下一步</el-button>
      </div>

    </el-main>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
import { forgetPwd } from '@/api/login.js'

export default {
    name: 'Login',
    data: function() {
        return {
            form: {
                type: 'account',
                value: ''

            },
            disabled: false

        }
    },
    computed: {
        ...mapState({
            Title: state => state.portal.title,
            Footer: state => state.portal.footer,
            Logo: state => state.portal.logo,
            IsModifyPWD: state => state.portal.isModifyPWD,
            CASAuthLoginUrl: state => state.portal.CASAuthLoginUrl,
            ERROR: state => state.portal.ERROR,
            PortalName: state => state.portal.PortalName

        })
    },
    created() {

    },
    methods: {
        onSubmit() {
            var infomation = this.form.value.replace(/^\s*|\s*$/g, '')
            if (infomation === '') {
                this.$alert('输入内容不允许为空', '提示', {
                    type: 'error'
                })
                return false
            }
            if (this.form.type === 'mail') {
                // 判断邮件格式
                var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                if (!pattern.test(this.form.value)) {
                    this.$alert('邮件地址格式错误', '提示', {
                        type: 'error'
                    })
                    return false
                }
            }
            this.disabled = true
            const token = sessionStorage.getItem('TOKEN-' + this.PortalName)
            forgetPwd(token, this.form.type, infomation)
                .then(res => {
                    var array = res.ResultMsg.split(';')
                    this.$router.push({
                        name: 'mailed',
                        params: {
                            email: array[0]
                        }
                    })
                })
                .catch(error => {
                    this.disabled = false
                    this.$alert(error, '提示', {
                        type: 'error'
                    })
                })
        }
    }
}
</script>
<style  >
</style>

