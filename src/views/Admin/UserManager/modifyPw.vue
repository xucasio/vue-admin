<template>
  <div class="views-content modifyPw">
    <el-form
      ref="modifyPw-form"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
      class="modifyForm">
      <el-form-item
        label="输入旧密码："
        prop="OldPassword">
        <el-input
          v-model="form.OldPassword"
          type="password"/>
      </el-form-item>
      <el-form-item
        label="输入新密码："
        prop="NewPassword">
        <el-input
          v-model="form.NewPassword"
          type="password"
          autocomplete="off"/>
      </el-form-item>
      <el-form-item
        label="确认新密码："
        prop="conpwd">
        <el-input
          v-model="form.conpwd"
          type="password"
          autocomplete="off"/>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="disabled"
          type="primary"
          @click="submitForm('modifyPw-form')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchUpdatePwd } from '@/api/user.js'
import { fetchLoginOut } from '@/api/login.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'ModifyPw',
    data: function() {
        var checkOld = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('旧密码不能为空'))
            }
            callback()
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (value === this.form.OldPassword) {
                    callback(new Error('新旧密码不能一样!'))
                } else if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
                    callback(new Error('密码为6－16位，支持数字、字母、中划线或下划线!'))
                } else {
                    callback()
                }
                if (this.form.conpwd !== '') {
                    this.$refs['modifyPw-form'].validateField('conpwd')
                }
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.NewPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            disabled: false,
            form: {
                OldPassword: '',
                NewPassword: '',
                conpwd: ''
            },
            rules: {
                NewPassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                conpwd: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                OldPassword: [
                    { validator: checkOld, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isEdit = false
                    const UserId = getStorage('USERID')
                    const { OldPassword, NewPassword } = this.form
                    fetchUpdatePwd({ UserId, OldPassword, NewPassword }).then(res => {
                        this.$alert('密码修改成功,请重新登录', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.loginOut(getStorage('TOKEN'))
                                // this.$router.replace({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
                            }
                        })
                    }).catch(ex => {
                        this.isEdit = true
                        // this.$alert(error)
                    })
                } else {
                    return false
                }
            })
        },
        loginOut(token) {
            fetchLoginOut(token)
                .then(res => {
                // 清除登录信息
                    sessionStorage.setItem('TOKEN', null)
                    // 退出到登录页
                    // this.$router.replace('/Login')
                    this.$router.push({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
                })
                // eslint-disable-next-line handle-callback-err
                .catch(error => {
                // 退出到登录页
                    // this.$router.replace('/Login')
                    this.$router.push({ path: '/Login', query: { appId: getStorage('MYAPPID') }})
                })
        }
    }
}
</script>
<style lang="scss" >
.modifyPw{
  min-height: calc(100vh - 180px);
  .modifyForm{
    width: 50%;
    margin: 0 auto;
  }
}
</style>

