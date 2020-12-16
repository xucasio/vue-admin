<template>
  <div class="reset-user">
    <div class=" rest-title">请选择手机号，随机密码将通过短信的方式发送给用户：</div>
    <div class="rest-user-row">
      <el-radio
        v-model="radioType"
        label="1">
        原手机号
      </el-radio>
    </div>
    <div class="rest-user-row">
      <el-radio
        v-model="radioType"
        label="2">
        新手机号
      </el-radio>
      <el-input
        v-model="phone"
        :disabled="radioType==='1'"
        placeholder="请输入手机号码"
        style="width:200px"
        maxlength="11"/>
    </div>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="confirm">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>

  </div>
</template>
<script>
import { fetchUserResetPwd } from '@/api/user.js'
export default {
    name: 'RsetPwd',
    props: {
        user: {
            type: Object,
            default: () => {
                return {}
            }
        }

    },
    data() {
        return {
            radioType: '1',
            phone: ''
        }
    },
    methods: {
        confirm() {
            if (this.radioType === '2') {
                if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
                    this.$message.error('手机号码格式不正确')
                    return
                }
            } else {
                // console.log(this.user)
                // if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.user.MOBILEPHONE)) {
                //     this.$message.error('原手机号码格式不正确')
                //     return
                // }
            }
            fetchUserResetPwd({ IsSendNote: true, UserId: this.user.USER_ID, Mobile: this.radioType === '1' ? this.user.MOBILEPHONE : this.phone }).then(res => {
                this.$message.success('密码已发送到手机')
                this.$emit('close')
            }).catch(ex => {
                this.$message.error(ex || '发送失败')
            })
        },
        closeDialog() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss">
.rest-user-row{
  padding-top: 20px;
  padding-left: 50px;

}
.rest-title{
  padding-top: 20px;
}
</style>
