<template>
  <div class="add-manager">
    <div class="add-manager-form">
      <el-form
        ref="form"
        :model="Form"
        :rules="rules"
        label-width="100px" >
        <el-form-item
          label="管理员类型"
          required
          prop="AdminTypeId">
          <el-select v-model="Form.AdminTypeId" >
            <el-option
              v-for=" ad in AdminTypeList"
              :key="ad.ADMIN_TYPE_ID"
              :disabled="ad.ADMIN_TYPE_ID===4"
              :label="ad.ADMIN_TYPE_NAME"
              :value="ad.ADMIN_TYPE_ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="Form.AdminTypeId===3"
          label="产品标识"
          required
          prop="ApplicationId">
          <el-select
            v-model="Form.ApplicationId"
            @change="appChange">
            <el-option
              v-for=" app in AppList"
              :key="app.ID"
              :label="app.Name"
              :value="app.ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="新增账号"
          prop="UserId">
          <cs-remote-search
            ref="remote"
            v-model="Form.UserId"
            :is-multiple="true"
            :requestfn="getUsers"
            :res-path="[]"
            :default-props="{value:'USER_ID',label:'LOGIN_NAME'}"
            placeholder="请输入用户名或手机号"
            style="width:100%"
            key-attr="ConditionValue"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">确定</el-button>
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fetchAdminTypeList, fetchAdminAdd, fetchApplicationList, fetchSearchUserList } from '@/api/admin'
export default {
    name: 'AddManager',
    data() {
        return {
            AdminTypeList: [],
            AppList: [],
            Form: {
                'AdminTypeId': '',
                'ApplicationId': '',
                'ApplicationMark': '',
                'UserId': ''
            },
            rules: {
                AdminTypeId: [
                    { required: true, message: '请选择管理员类型', trigger: 'blur' }
                ],
                ApplicationId: [
                    { required: true, message: '请选择产品标识', trigger: 'blur' }
                ],
                UserId: [
                    { required: true, message: '请选择新增账号', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        fetchAdminTypeList().then(res => {
            this.AdminTypeList = res
        })
        fetchApplicationList().then(res => {
            this.AppList = res
        })
    },
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.Form.ApplicationId = this.Form.AdminTypeId === 3 ? this.Form.ApplicationId : 0
                    this.Form.ApplicationMark = this.Form.AdminTypeId === 3 ? this.Form.ApplicationMark : ''
                    fetchAdminAdd(this.Form).then(res => {
                        this.$message.success('新增成功')
                        this.$emit('success')
                    }).catch(error => {
                        console.log('fetchAdminAdderror:', error)
                        this.$message.error(error || '新增失败')
                    })
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$refs['form'].resetFields()
            this.$refs.remote.reSet()
        },
        cancel() {
            this.$emit('close')
        },
        getUsers(key) {
            return fetchSearchUserList(key)
        },
        appChange(v) {
            var p = this.AppList.find(f => f.ApplicationId === v)
            if (p) {
                this.Form.ApplicationMark = p.ApplicationMark
            }
        }

    }
}
</script>
