<template>
  <div
    class="11"
    style="padding-top:20px">
    <el-form
      ref="form"
      :model="Form"
      :rules="rules"
      label-width="100px" >
      <el-form-item
        label="申请方式："
        required
        prop="applayType">
        <el-select v-model="Form.applayType">
          <el-option
            value="1"
            label="普通申请" />
          <el-option
            value="2"
            label="口令申请" />
          <el-option
            value="3"
            label="管理员激活" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        v-if="Form.applayType==='1'"
        label="申请类型："
        required
        prop="cusType">
        <el-select v-model="Form.cusType">
          <el-option
            v-for="cs in customerTypes"
            :key="cs.id"
            :value="cs.id"
            :label="cs.name"/>
        </el-select>
      </el-form-item> -->

      <el-form-item
        v-if="Form.applayType==='1'"
        label="名称："
        prop="name">
        <cs-remote-search
          ref="remote"
          v-model="Form.name"
          :is-multiple="false"
          :requestfn="getSchools"
          :res-path="[]"
          :default-props="{value:'ADMIN_TYPE_INFO_ID',label:'AdminTypeInfoFullName'}"
          placeholder=""
          style="width:100%"
          key-attr="keywords"/>
      </el-form-item>
      <el-form-item
        v-if="Form.applayType==='2'||Form.applayType==='3'"
        label="口令："
        prop="pwd">
        <el-input v-model="Form.pwd"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <!-- <el-button @click="goBack">返回</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { customer_Type } from '@/utils/basedata'
import { getStorage } from '@/utils/auth.js'
import { fetchActivationLabel } from '@/api/label'

import { activeInfoSecretkey } from '@/api/user.js'
import { fetchBQueryLike } from '@/api/admin'
export default {
    name: 'Applay',
    data() {
        return {
            options: [],
            customerTypes: customer_Type.filter(f => f.id !== 0),
            Form: {
                applayType: '1',
                cusType: '',
                name: '',
                pwd: ''
            },
            rules: {
                applayType: [
                    { required: true, message: '请选择申请方式', trigger: 'blur' }
                ],
                cusType: [
                    { required: true, message: '请选择申请类型', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
                ],
                pwd: [
                    { required: true, message: '请输入口令', trigger: ['blur', 'change'] }
                ]

            }
        }
    },
    methods: {
        getStorage,
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.Form.applayType === '3') { // 管理员激活
                        const data = {
                            'SecretKey': this.Form.pwd
                        }
                        activeInfoSecretkey(data).then(res => {
                            // this.$alert('恭喜您，管理员秘钥激活成功，重新登录后可切换为管理员身份操作！', '激活成功', {
                            //     confirmButtonText: '确定'
                            // })
                            this.$message.success('恭喜您，管理员秘钥激活成功，重新登录后可切换为管理员身份操作！')
                            this.$emit('success')
                        })
                    } else { // 普通和口令申请
                        const data = {
                            'AdminTypeInfoID': this.Form.applayType === '1' ? this.Form.name : 0,
                            'LabelMark': this.Form.applayType === '1' ? '' : this.Form.pwd,
                            'UserID': getStorage('USERID')
                        }
                        fetchActivationLabel(data).then(res => {
                            this.$message.success('提交成功')
                            this.$emit('success')
                        }).catch(error => {
                            this.$message.error(error || '提交失败')
                        })
                    }
                } else {
                    return false
                }
            })
        },
        resetForm() {
            // this.$refs['form'].resetFields()
            this.Form.name = ''
            this.Form.pwd = ''
            this.$refs['remote'].$set(this.$refs['remote'].$data, 'state', '')
        },
        // goBack() {
        //     this.$emit('close')
        // },
        getSchools(key) {
            return fetchBQueryLike(key)
        }
    }
}
</script>
