<template>
  <div id="BUserSet">
    <div class="views-content">
      <div>
        <el-form
          ref="BUserForm"
          :model="Form"
          :inline="false"
          :rules="rules" >
          <div class="content-row mb20">
            <cs-row-tab title="管理员变更"/>
          </div>
          <div class="search-content">
            <el-form-item
              label="新管理员账号"
              class="select-item">
              <el-select
                v-model="Form.type"
                width="100"
                placeholder="请选择">
                <el-option
                  label="名称"
                  value="1"/>
                <el-option
                  label="手机"
                  value="0"/>
              </el-select>
            </el-form-item>
            <el-form-item
              :error="conditionErrorTip"
              :validate-status="conditionStatus"
              class="input-item"
            >
              <CsRemoteSearch
                :requestfn="queryUserInfo"
                :key-attr="'ConditionValue'"
                v-model="Form.TargetUserId"
                :params="{}"
                :res-path="[]"
                :default-props="Form.type==1?{label: 'USER_NAME', value: 'USER_ID'}:{label: 'TELEPHONE', value: 'USER_ID'}"
                :placeholder="'请输入账号信息'"
                :keydata="Form.type==1?'USER_NAME':'TELEPHONE'"
                :allowcreate="true"
              />
            </el-form-item>
          </div>

          <div class="content-row mb20">
            <cs-row-tab title="可管理账号数量设置"/>
          </div>
          <el-form-item
            label-width="10px"
            required
            prop="UserManagerCount">
            <el-input
              v-model="Form.UserManagerCount"
              maxlength="7"
              placeholder="请输入数量"/>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button
            type="primary"
            @click="submitForm()">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
    <div class="views-content mgt30">
      <div class="content-row">
        <cs-row-tab title="权限范围设置"/>
      </div>
      <div
        style="display:flex;justify-content: space-between;">
        <div class="roles-area">
          <UserRoles
            :data="baseInfo.Roles"
            :admin-type-info-id="adminTypeInfoId"
            @reload="getUserInfo"/></div>
        <div class="roles-area">
          <UserRights
            :data="baseInfo.Rights"
            :admin-type-info-id="adminTypeInfoId"
            @reload="getUserInfo"/></div>
      </div>
    </div>
  </div>
</template>
<script>
// import { createRole, fetchAdminlist } from '@/api/role.js'
import UserRoles from './components/roleTable'
import UserRights from './components/rightTable'
import { detailBUser, fetchAdminUserChange, queryUserInfo } from '@/api/user.js'
import common from '@/utils/common.js'

import CsRemoteSearch from '@/components/CsRemoteSearch'
export default {
    name: 'BUserSet',
    components: {
        UserRoles, UserRights, CsRemoteSearch
    },
    data() {
        return {
            Form: {
                Condition: '',
                type: '1'
            },
            rules: {
                // Condition: [{ required: true, message: '请输入账号信息', trigger: 'blur' }],
                UserManagerCount: [{ required: true, message: '请输入数量', trigger: 'blur' }]
            },
            adminOptions: [], // 管理员列表
            rolesErrorTip: '',
            rolesStatus: 'success',
            baseInfo: {
                Roles: [],
                Rights: []

            },
            userId: common.getUrlKey('userId'),
            adminTypeInfoId: common.getUrlKey('adminTypeInfoId'),
            conditionErrorTip: '',
            conditionStatus: 'success'
        }
    },
    // watch: {
    //     'Form.Condition': function(n) {
    //         if (n) {
    //             this.conditionStatus = 'success'
    //             this.conditionErrorTip = ''
    //         } else {
    //             this.conditionStatus = 'error'
    //             this.conditionErrorTip = '请输入账号信息'
    //         }
    //     }
    // },
    created() {
        this.getUserInfo()
    },
    methods: {
        queryUserInfo,
        submitForm() {
            const { UserManagerCount } = this.Form
            this.$refs['BUserForm'].validate((valid) => {
                // if (!this.Form.Condition) {
                //     this.conditionStatus = 'error'
                //     this.conditionErrorTip = '请选择账号信息'
                // }
                if (valid) {
                    const data = {
                        'SelUserId': this.userId,
                        'AdminTypeInfoId': this.adminTypeInfoId,
                        'TargetUserId': this.Form.TargetUserId,
                        'UserManagerCount': Number(UserManagerCount)
                    }
                    fetchAdminUserChange(data).then(res => {
                        if (res === true) {
                            this.$message.success('设置成功')
                            this.resetForm()
                            this.$router.push('/tob/userList')
                        } else {
                            this.$message.error(res)
                        }
                    })
                }
            })
        },
        resetForm() {
            this.Form = {
                TargetUserId: '',
                UserManagerCount: ''
            }
        },
        goBack() {
            this.$router.go(-1)
        },
        getUserInfo() {
            detailBUser(this.userId, this.adminTypeInfoId).then(res => {
                this.baseInfo = res
            })
        },
        getSelectItem(item) {
            this.Form.TargetUserId = item
        }
    }
}
</script>
<style lang="scss" scoped>
.footer{
  // text-align: center;
  padding: 10px 0;
}
.mb20{
  margin-bottom: 20px;
}
.mgt30{
  margin-top: 30px;
}
.roles-area{
  width: 49%;
  // padding: 0 10px;
}

</style>
<style lang="scss">
  #BUserSet{
    .search-content{
      display:flex;
      .select-item{
        width: 108px;
        .el-select{
          width: 100px;
        }
      }
      .input-item{
        padding-top:36px;
        width:252px;
        display:flex;
          .search{
            flex: 1;
          }
      }
    }
  }
</style>
