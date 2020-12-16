<template>
  <div id="BUserSet">
    <div class="views-content">
      <cs-back-btn />
      <div class="content-row">
        <cs-row-tab
          :has-right-btn="true"
          title="权限范围设置">
          <el-button
            size="small"
            @click="goBack">返回上一页</el-button>
        </cs-row-tab>
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
import UserRoles from '../TobManager/components/roleTable'
import UserRights from '../TobManager/components/rightTable'
import { detailBUser, fetchAdminUserChange, queryUserInfo } from '@/api/user.js'
import common from '@/utils/common.js'

import CsRemoteSearch from '@/components/CsRemoteSearch'
export default {
    name: 'BUserDetail',
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
                        'UserManagerCount': UserManagerCount
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
