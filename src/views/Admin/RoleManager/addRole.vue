<template>
  <div class="views-content">
    <div class="content-row">
      <cs-row-tab :title="roleId? '编辑角色':'新增角色'"/>
    </div>
    <div class="content-form">
      <el-form
        ref="roleForm"
        :model="Form"
        :rules="rules"
        label-width="100px" >
        <el-form-item
          label="角色名称"
          required
          prop="ROLE_NAME">
          <el-input
            v-model="Form.ROLE_NAME"
            maxlength="50"
            placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="DESCRIPTION">
          <el-input
            :rows="2"
            v-model="Form.DESCRIPTION"
            type="textarea"
            placeholder="请输入角色描述"/>
        </el-form-item>
        <el-form-item
          v-if="getStorage('TYPEID')==1||getStorage('TYPEID')==0"
          label="角色归属"
          required
          prop="AdminTypeInfoIds">
          <el-select
            v-model="Form.AdminTypeInfoIds"
            multiple
            filterable
            placeholder="请选择角色归属">
            <el-option
              v-for="item in adminOptions"
              :key="item.ADMIN_TYPE_INFO_ID"
              :label="item.CUSTOMER_NAME"
              :value="item.ADMIN_TYPE_INFO_ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          :error="rolesErrorTip"
          :validate-status="rolesStatus"
          label="角色权限"
          prop="roles">
          <div
            class="roleSelect"
            @click="editAuth()">
            <el-card shadow="never" >
              <el-tag
                v-for="(tag,i) in Form.roles"
                :key="tag.ID"
                closable
                @close="handleCloseTag(i)">
                {{ tag.Name }}
              </el-tag>
            </el-card>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            @click="addAuth()">添加权限</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">提交</el-button>
          <!-- <el-button @click="resetForm()">重置</el-button> -->
          <el-button @click="goBack">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
    <cs-dialog
      :show="showAuthDialog"
      :append-to-body="false"
      title="添加权限"
      width="800px"
      @close="closeAuthDialog">
      <UserRightList
        :selections="Form.roles"
        :hasdate="false"
        :is-show="showAuthDialog"
        @close="closeAuthDialog"
        @add="handleAddAuth"/>
    </cs-dialog>
    <cs-dialog
      :show="showEditAuthDialog"
      :append-to-body="false"
      title="编辑权限"
      width="800px"
      @close="closeEditAuthDialog">
      <AuthEdit
        :rolelist="Form.roles"
        :is-show="showEditAuthDialog"
        @close="closeEditAuthDialog"
        @add="handleEditAuth" />
    </cs-dialog>
  </div>
</template>
<script>
import UserRightList from '@/views/Admin/RoleManager/components/rightList'
import AuthEdit from '@/views/Admin/RoleManager/components/authEdit'
import { createRole, fetchAdminlist, getRoleinfoById } from '@/api/role.js'
import { getStorage } from '@/utils/auth'
import { objArrRemovRep } from '@/utils/index'
export default {
    name: 'AddRole',
    components: { UserRightList, AuthEdit },
    data() {
        var validateTypeInfoIds = (rule, value, callback) => {
            if (!value.length) {
                callback(new Error('请选择角色归属!'))
            } else {
                callback()
            }
        }
        return {
            showAuthDialog: false,
            Form: {
                roles: [],
                ROLE_NAME: '',
                DESCRIPTION: '',
                AdminTypeInfoIds: []
            },
            rules: {
                ROLE_NAME: [
                    { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: ['blur', 'change'] }
                ],
                AdminTypeInfoIds: [
                    { validator: validateTypeInfoIds, trigger: 'change' }
                ]
            },
            adminOptions: [], // 管理员列表
            rolesErrorTip: '',
            rolesStatus: 'success',
            roleId: this.$route.query.id,
            showEditAuthDialog: false
        }
    },
    watch: {
        'Form.roles': function(arr) {
            if (!this.Form.roles.length) {
                this.rolesErrorTip = '请选择角色权限'
                this.rolesStatus = 'error'
            } else {
                this.rolesErrorTip = ''
                this.rolesStatus = 'success'
            }
        }
    },
    created() {
        // getStorage('TYPEID') 根据管理员类型 选择
        if (getStorage('TYPEID') === '1' || getStorage('TYPEID') === '0') {
            this.getAdminlist()
        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.getDetail()
        }
    },
    methods: {
        getStorage,
        addAuth() {
            this.showAuthDialog = true
        },
        handleCloseTag(i) {
            this.Form.roles.splice(i, 1) // 删除权限标签
        },
        submitForm() {
            const { ROLE_NAME, DESCRIPTION, roles } = this.Form
            const AdminTypeInfoIds = (+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0) ? this.Form.AdminTypeInfoIds : [getStorage('PTYPEID')]
            this.$refs['roleForm'].validate((valid) => {
                // 角色权限单独校验
                if (!this.Form.roles.length && this.rolesStatus === 'success') {
                    this.rolesErrorTip = '请选择角色权限'
                    this.rolesStatus = 'error'
                    return
                }
                if (valid) {
                    const data = {
                        'RoleId': this.roleId || 0,
                        'RoleName': ROLE_NAME,
                        'Description': DESCRIPTION,
                        'Rights': roles,
                        'AdminTypeInfoIds': AdminTypeInfoIds
                    }
                    createRole(data).then(res => {
                        if (res === true) {
                            this.$message.success(this.roleId ? '修改成功' : '新增成功')
                            this.$router.push('/role/roleList')
                        } else {
                            this.$message.error(res)
                        }
                    })
                }
            })
        },
        resetForm() {
            this.Form = {
                ROLE_NAME: '',
                DESCRIPTION: '',
                roles: []
            }
        },
        goBack() {
            this.$router.go(-1)
        },
        closeAuthDialog() {
            this.showAuthDialog = false
        },
        handleAddAuth(selections, daterange, Value) {
            this.showAuthDialog = false
            const sarr = selections.map(row => {
                const obj = {
                    ID: row.ID,
                    Name: row.Name,
                    Value: row.Value || Value
                }
                if (Value.type === 1) {
                    obj['BooleanValue'] = obj.Value.BooleanValue
                } else if (Value.type === 2) {
                    obj['DataRangStart'] = obj.Value.DataRangStart
                    obj['DataRangEnd'] = obj.Value.DataRangEnd
                } else if (Value.type === 3) {
                    obj['IntValue'] = obj.Value.IntValue
                } else if (Value.type === 4) {
                    obj['MarkVerionMsg'] = obj.Value.MarkVerionMsg
                }
                return obj
            })
            this.Form.roles = objArrRemovRep(this.Form.roles.concat(sarr).reverse(), 'ID').reverse() // 去重
        },
        getAdminlist() {
            fetchAdminlist().then(res => {
                this.adminOptions = res || []
            })
        },
        getDetail() {
            getRoleinfoById(this.$route.query.id).then(res => {
                this.Form.AdminTypeInfoIds = res.admintypeinfoList.map(item => item.ADMIN_TYPE_INFO_ID)
                this.Form.roles = res.RoleAuthList.map(item => {
                    const obj = {
                        ID: item.ID,
                        Name: item.Name,
                        Value: item.Value
                    }
                    if (item.Value.AuthType === 1) {
                        obj['Value'].type = 1
                        obj['BooleanValue'] = obj.Value.BooleanValue
                    } else if (item.Value.AuthType === 2) {
                        obj['DataRangStart'] = obj.Value.DataRangStart
                        obj['DataRangEnd'] = obj.Value.DataRangEnd
                        obj['Value'].type = 2
                    } else if (item.Value.AuthType === 3) {
                        obj['IntValue'] = obj.Value.IntValue
                        obj['Value'].type = 3
                    } else if (item.Value.AuthType === 4) {
                        obj['MarkVerionMsg'] = obj.Value.MarkVerionMsg
                        obj['Value'].type = 4
                    }
                    return obj
                })
                console.log('this.Form.roles', this.Form.roles)
                this.Form.ROLE_NAME = res.ROLE_NAME
                this.Form.DESCRIPTION = res.DESCRIPTION
            })
        },
        editAuth() {
            this.showEditAuthDialog = true
        },
        closeEditAuthDialog() {
            this.showEditAuthDialog = false
        },
        handleEditAuth(list) {
            this.showEditAuthDialog = false
            this.Form.roles = list.map(row => {
                if (row.Value.type === 1) {
                    return {
                        ID: row.ID,
                        Name: row.Name,
                        BooleanValue: row.BooleanValue,
                        Value: {
                            BooleanValue: row.BooleanValue,
                            type: 1
                        }
                    }
                } else if (row.Value.type === 2) {
                    return {
                        ID: row.ID,
                        Name: row.Name,
                        DataRangStart: row.DataRangStart,
                        DataRangEnd: row.DataRangEnd,
                        Value: {
                            DataRangStart: row.DataRangStart,
                            DataRangEnd: row.DataRangEnd,
                            type: 2
                        }
                    }
                } else if (row.Value.type === 3) {
                    return {
                        ID: row.ID,
                        Name: row.Name,
                        IntValue: row.IntValue,
                        Value: {
                            IntValue: row.IntValue,
                            type: 3
                        }
                    }
                } else if (row.Value.type === 4) {
                    return {
                        ID: row.ID,
                        Name: row.Name,
                        MarkVerionMsg: row.MarkVerionMsg,
                        Value: {
                            MarkVerionMsg: row.MarkVerionMsg,
                            type: 4
                        }
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.el-form-item{
  .el-select{
    width: 100%;
  }
}
</style>
