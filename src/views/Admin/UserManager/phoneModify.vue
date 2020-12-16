<template>
  <div class="views-content modifyPh">
    <el-form
      ref="modifyPh-form"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="modifyForm">
      <el-form-item
        label="原手机号：">
        <span>{{ $route.query.phone }}</span>
      </el-form-item>
      <el-form-item
        label="输入新手机号："
        prop="phone">
        <el-input
          v-model="form.phone"
          clearable
          maxlength="11"
          type="text"/>
      </el-form-item>
      <el-form-item
        label="验证码："
        prop="conpwd">
        <el-row>
          <el-col
            :span="1"
            style="width: calc(100% - 112px)">
            <el-input
              v-model="form.code"
              type="text"/>
          </el-col>
          <el-col
            :span="1"
            style="112px"
          >
            <el-button
              :disabled="!codeEnabled"
              type="primary"
              @click="getCode()">{{ codeText }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('modifyPh-form')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchUpmsSendCode, changemobilephone } from '@/api/login.js'
export default {
    name: 'ModifyPh',
    data: function() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'))
            } else {
                if (!(/^1[3-9]\d{9}$/.test(value.trim()))) {
                    callback(new Error('手机号码格式不正确!'))
                } else {
                    callback()
                }
            }
        }
        return {
            rules: {
                phone: [
                    { validator: validatePass, trigger: 'blur' },
                    { max: 11, trigger: 'blur', message: '最大长度为11位' }
                ]
            },
            form: {
                phone: '',
                code: ''
            },
            codeText: '获取验证码',
            codeEnabled: true,
            cutDown: 120

        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    changemobilephone({ MobilePhone: this.form.phone, PhoneCode: this.form.code }).then(res => {
                        if (res) {
                            this.$message.success('修改绑定手机成功')
                            this.$router.push('/home/userInfo')
                        } else {
                            this.$message.warning('操作失败')
                        }
                    }).catch(er => {
                        if (er.status == 1) {
                            this.$message.success('修改绑定手机成功')
                            this.$router.push('/home/userInfo')
                        } else {
                            this.$message.warning(er.message || '操作失败')
                        }
                    })
                } else {
                    return false
                }
            })
        },
        getCode() {
            fetchUpmsSendCode(this.form.phone, 3).then(res => {
                if (res) {
                    this.setTime()
                } else {
                    this.$message.warning('发送验证码失败')
                }
            }).catch(ex => {
                this.$message.warning('发送验证码失败')
            })
        },
        setTime() {
            if (this.cutDown === 0) {
                this.codeText = '获取验证码'
                this.codeEnabled = true
                this.cutDown = 120
                return
            } else {
                this.codeText = '(' + this.cutDown + ')重新获取'
                this.codeEnabled = false
                this.cutDown = this.cutDown - 1
            }
            setTimeout(() => {
                this.setTime()
            }, 1000)
        }
    }
}
</script>
<style lang="scss" >
.modifyPh{
  min-height: calc(100vh - 180px);
  .modifyForm{
    width: 50%;
    margin: 0 auto;
    .el-button--medium{
      padding: 10px 20px;
    }
  }
}
</style>

