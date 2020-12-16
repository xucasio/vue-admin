<template>
  <div class="views-content">
    <div class="content-row">
      <cs-row-tab title="基础信息"/>
    </div>
    <div class="content-form">
      <el-form
        ref="form"
        :model="Form"
        :rules="rules"
        label-width="100px" >
        <el-form-item
          label="用户名"
          prop="loginName">
          <el-input
            v-model="Form.loginName"
            maxlength="20"
            placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item
          label="姓名"
          required
          prop="name">
          <el-input
            v-model="Form.name"
            placeholder="请输入姓名"
            maxlength="20"/>
        </el-form-item>
        <el-form-item
          label="手机号码"
          required
          prop="mobile">
          <el-input
            v-model="Form.mobile"
            maxlength="11"
            placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="nickName">
          <el-input
            v-model="Form.nickName"
            maxlength="50"
            placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item
          label="登录密码"
          required
          prop="passWord">
          <el-input
            v-model="Form.passWord"
            maxlength="16"
            placeholder="请输入登录密码"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="确认密码"
          required
          prop="rePassWord">
          <el-input
            v-model="Form.rePassWord"
            maxlength="16"
            placeholder="请再次登录密码"
            type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            @click="addRole()">添加角色</el-button>
        </el-form-item>
        <el-form-item
          label="账号角色"
        >
          <el-card shadow="never">
            <el-tag
              v-for="(tag,i) in Form.roles"
              :key="tag.id"
              closable
              @close="handleCloseTag(i)">
              {{ tag.name }}
            </el-tag>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">立即创建</el-button>
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
    <cs-dialog
      :show="showRoleDialog"
      :append-to-body="false"
      width="800px"
      title="添加角色"
      @close="closeRoleDialog">
      <UserRoleList
        @close="closeRoleDialog"
        @add="handleAddRole"/>
    </cs-dialog>
  </div>
</template>
<script>
import UserRoleList from './roleList'
import { fetchUserAdd } from '@/api/user.js'
export default {
    name: 'AddUser',
    components: { UserRoleList },
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.Form.passWord) {
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
            if (value === '') {
                callback(new Error('请输入手机号码'))
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
        var validateRealName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'))
            } else if (!/^[A-Za-z0-9\u4e00-\u9fa5\.\s]*$/.test(value)) {
                callback(new Error('真实姓名上限20字符，支持字母，数字，空格或.'))
            } else {
                callback()
            }
        }
        return {

            showRoleDialog: false,
            Form: {
                name: '',
                loginName: '',
                passWord: '',
                rePassWord: '',
                nickName: '',
                mobile: '',
                roles: []

            },
            rules: {
                loginName: [
                    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    { validator: validateUserName, trigger: ['blur', 'change'] }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
                    { validator: validateRealName, trigger: ['blur', 'change'] }
                ],
                passWord: [
                    // { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePassWord, trigger: ['blur', 'change'] },
                    { reg: '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$', message: '密码为6－16个字符，必须包含数字、大小写字母' }
                ],
                rePassWord: [
                    // { required: true, message: '请输再次输入密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: ['blur', 'change'] }
                ],
                mobile: [
                    // { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: ['blur', 'change'] }
                ]
            }

        }
    },
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    fetchUserAdd(this.Form).then(res => {
                        this.$message.success('新增成功')
                        this.$router.push('/home/user')
                    }).catch(error => {
                        this.$message.error(error || '新增失败')
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
        addRole() {
            this.showRoleDialog = true
        },
        closeRoleDialog() {
            this.showRoleDialog = false
        },
        handleAddRole(rows, dt) {
            this.showRoleDialog = false
            this.Form.roles = rows.map(m => {
                return {
                    id: m.ROLE_ID,
                    name: m.ROLE_NAME,
                    ...dt
                }
            })
            console.log('rows:', rows)
        },
        handleCloseTag(i) {
            // 删除角色tag
            this.Form.roles.splice(i, 1)
        },
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>
