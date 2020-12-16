<template>
  <el-form
    ref="form"
    :model="Form"
    :rules="rules"
    status-icon
    label-width="100px">
    <el-form-item
      label="用户名"
      required
      prop="LoginName">
      <el-input
        v-model="Form.LoginName"
        maxlength="50"
        placeholder="请输入用户名"/>
    </el-form-item>
    <el-form-item
      label="真实姓名"
      prop="Name">
      <el-input
        v-model="Form.Name"
        maxlength="20"
        placeholder="请输入真实姓名"/>
    </el-form-item>
    <el-form-item
      label="手机号码："
      prop="Mobile">
      <el-input
        v-model="Form.Mobile"
        maxlength="11"
        placeholder="请输入手机号码"/>
    </el-form-item>
    <el-form-item
      label="昵称："
      prop="NickName">
      <el-input
        v-model="Form.NickName"
        maxlength="50"
        auto-complete="off"
        placeholder="请输入昵称"/>
    </el-form-item>
    <el-form-item
      label="初始密码："
      required
      prop="PassWord">
      <el-input
        v-model="Form.PassWord"
        maxlength="50"
        type="password"
        auto-complete="off"
        placeholder="请输入初始密码"/>
    </el-form-item>
    <el-form-item
      label="确定密码："
      required
      prop="RePassWord">
      <el-input
        v-model="Form.RePassWord"
        type="password"
        maxlength="50"
        placeholder="请再次输入初始密码"/>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm()">立即创建</el-button>
      <el-button @click="resetForm()">重置</el-button>
      <el-button @click="closeDialog">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { queryAddBuser } from '@/api/user'
export default {
    name: 'B1',
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.Form.PassWord) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        var validatePassWord = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入登录密码'))
            } else if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
                callback(new Error('密码为6－16位，支持数字、字母、中划线或下划线!'))
            } else {
                callback()
            }
        }
        var validatePhone = (rule, value, callback) => {
            if (value.trim() === '') {
                callback()
            } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
                callback(new Error('手机号码格式不正确'))
            } else {
                callback()
            }
        }
        var validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'))
            } else if (!/^[a-zA-Z0-9_]{5,20}$/.test(value)) {
                callback(new Error('用户名为5-20字符，需要包含字母、数字或下划线'))
            } else {
                callback()
            }
        }
        return {
            Form: {
                'LoginName': '',
                'Name': '',
                'Mobile': '',
                'PassWord': '',
                'RePassWord': '',
                'NickName': ''
            },
            rules: {
                LoginName: [
                    // { required: true, message: '请输入请输入用户名', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    { validator: validateUserName, trigger: 'blur' }
                ],
                Name: [
                    // { required: true, message: '请输入姓名', trigger: 'blur' }
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                PassWord: [
                    // { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePassWord, trigger: 'blur' }
                ],
                RePassWord: [
                    // { required: true, message: '请输再次输入密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ],
                Mobile: [
                    // { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ]

            }
        }
    },
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    queryAddBuser(this.Form).then(res => {
                        this.$message.success('新增成功')
                        this.$emit('success')
                    }).catch(error => {
                        this.$message.error(error.message || '新增失败')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm() {
            this.$refs['form'].resetFields()
        },
        closeDialog() {
            this.$emit('close')
        }
    }
}
</script>
