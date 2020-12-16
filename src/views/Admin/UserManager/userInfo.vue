<template>
  <div class="userinfo-dialog">
    <div class="userinfo-top">
      <el-button
        v-if="!isEdit&&!readonly"
        type="text"
        size="mini"
        icon="iconfont iconxiugaimima"
        @click="gotoEdit">修改用户信息</el-button>
      <el-button
        v-if="isEdit"
        size="mini"
        type="primary"
        @click="updateUser" >提交</el-button>
      <el-button
        v-if="isEdit"
        size="mini"
        @click="cancel" >取消</el-button>
    </div>
    <div class="userinfo-form">
      <el-form
        :inline="true"
        label-width="120px">
        <el-form-item label="账号：">
          <span v-tip="form.LoginName">{{ form.LoginName }}</span>
        </el-form-item>
        <el-form-item label="账号属性：">
          <span v-tip="form.Account_Purpose">{{ form.Account_Purpose }}</span>
        </el-form-item>
        <el-form-item label="姓名：" >
          <el-input
            v-if="isEdit"
            v-model="form.Name"
            maxlength="50"/>
          <span
            v-tip="form.Name"
            v-if="!isEdit">{{ form.Name }}</span>
        </el-form-item>
        <el-form-item label="服务器IP：" >
          <span v-tip="form.Ip">{{ form.Ip }}</span>
          <!-- <el-input v-model="form.Ip"/> -->
        </el-form-item>
        <el-form-item label="手机号码：" >
          <span v-tip="form.Mobile">{{ form.Mobile }}</span>
          <!-- <el-input v-model="form.Mobile"/> -->
        </el-form-item>
        <el-form-item label="服务器MAC：" >
          <span v-tip="form.Mac">{{ form.Mac }}</span>
          <!-- <el-input v-model="form.Mac"/> -->
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input
            v-if="isEdit"
            v-model="form.LinkPhone"/>
          <span v-if="!isEdit">{{ form.LinkPhone }}</span>
        </el-form-item>
        <el-form-item label="开通日期：">
          <span v-tip="form.OpenTime">{{ form.OpenTime }}</span>
          <!-- <el-input v-model="form.OpenTime"/> -->
        </el-form-item>
        <el-form-item label="联系邮箱：">
          <el-input
            v-if="isEdit"
            v-model="form.LinkEmail"/>
          <span
            v-tip="form.LinkEmail"
            v-if="!isEdit">{{ form.LinkEmail }}</span>
        </el-form-item>
        <el-form-item label="更新时间：">
          <span v-tip="form.UpdateTime">{{ form.UpdateTime }}</span>
          <!-- <el-input v-model="form.UpdateTime"/> -->
        </el-form-item>
        <el-form-item label="学校/公司名称：">
          <span v-tip="form.Company">{{ form.Company }}</span>
          <!-- <el-input v-model="form.Company"/> -->
        </el-form-item>
        <el-form-item label="用户状态：">
          <span v-tip="form.StateName">{{ form.StateName }}</span>
          <!-- <el-input v-model="form.StateName"/> -->
        </el-form-item>
        <el-form-item label="账号类型：">
          <span v-tip="form.StateName">{{ form.StateName }}</span>
        </el-form-item>
        <el-form-item
          style="width:100%"
          label="角色列表：">
          <el-card
            shadow="never"
            style="width:500px" >
            <el-tag
              v-for="(tag) in form.Roles"
              :key="tag.ID">
              {{ tag.Name }}
          </el-tag></el-card>
        </el-form-item>
        <el-form-item
          style="width:100%"
          label="权限列表：">
          <el-card
            shadow="never"
            style="width:500px" >
            <el-tag
              v-for="(tag) in form.Rights"
              :key="tag.ID">
              {{ tag.Name }}
            </el-tag>
          </el-card>
        </el-form-item>
        <el-form-item
          v-if="form.State===2"
          style="width:100%"
          label="禁用原因：">
          <el-input
            v-model="form.Reason"
            readonly
            style="width:500px"
            type="textarea"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fetchUserInfo, queryUserUpdate } from '@/api/user.js'
export default {
    name: 'UserDialog',
    props: {
        userid: {
            type: [String, Number],
            default: ''
        },
        readonly: {
            type: [Boolean],
            default: false
        }
    },
    data() {
        return {
            isEdit: false,
            form: {
                Account_Purpose: '',
                LoginName: '',
                mobile: '',
                Name: '',
                Mac: '',
                UpdateTime: '',
                OpenTime: '',
                Ip: '',
                RePassWord: '',
                linkEmail: '',
                linkPhone: '',
                Company: '',
                Roles: [],
                Rights: [],
                StateName: ''
            }
        }
    },
    mounted() {
        console.log(this.userid)
        fetchUserInfo(this.userid).then(res => {
            console.log('result:', res)
            this.form = res
        })
    },
    methods: {
        gotoEdit() {
            this.isEdit = true
        },
        cancel() {
            this.isEdit = false
        },
        updateUser() {
            queryUserUpdate(this.form).then(res => {
                this.$message.success('修改成功')
                this.isEdit = false
                this.$emit('success')
            })
        }
    }
}
</script>
<style lang="scss">
.userinfo-dialog{
  height: 500px;
  overflow-y: auto;
  .userinfo-top{
    padding: 10px 0;
  }
  .el-form--inline{
    .el-form-item{
      width: 50%;
      margin-right: 0;
      margin-bottom: 10px;
      .el-form-item__content{
        line-height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 120px);
      }
    }
  }
}
</style>
