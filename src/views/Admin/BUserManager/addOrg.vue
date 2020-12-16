<template>
  <div class="views-content">
    <div class="content-row">
      <cs-row-tab title="新增组织"/>
    </div>
    <div class="content-form">
      <el-form
        ref="addBUserForm"
        :model="Form"
        :rules="rules"
        label-width="120px" >
        <el-form-item
          label="学校/机构名称"
          prop="OrgName">
          <CsRemoteSearch
            ref="OrgName"
            :requestfn="fetchUserOrganizaionRange"
            :key-attr="'keywords'"
            v-model="Form.OrgName"
            :allowcreate="true"
            :params="{}"
            :res-path="[]"
            :default-props="{label: 'Name', value: 'Name'}"
            :placeholder="'请输入学校/机构名称'"
            @select="handleSchoolSelect"
          />
        </el-form-item>
        <el-form-item
          label="可管理账号数量"
          prop="BClientUserCount">
          <el-input
            v-model="Form.BClientUserCount"
            placeholder="请输入可管理账号数量"
            maxlength="7"/>
        </el-form-item>
        <el-form-item
          v-if="(+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0)"
          label="归属产品管理"
          prop="ApplicationId">
          <el-select
            v-model="Form.ApplicationId"
            filterable
            placeholder="请选择角色归属">
            <el-option
              v-for="item in ApplicationOptions"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="组织类型"
          prop="CustomerType">
          <el-select
            v-model="Form.CustomerType"
            filterable
            clearable
            placeholder="请选择组织类型">
            <el-option
              v-for="item in CustomerTypeOptions"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分部"
          prop="BranchName">
          <el-input
            v-model="Form.BranchName"
            placeholder="请输入分部名称"
            maxlength="50"/>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="Remark">
          <el-input
            v-model.trim="Form.Remark"
            placeholder="请输入备注"
            rows="5"
            maxlength="255"
            type="textarea" />
        </el-form-item>
        <el-form-item
          label="新增B端管理员"
          prop="USER_NAME">
          <el-input
            v-model="Form.USER_NAME"
            style="width:400px; margin-right:10px"
            readonly
            @click="addOrg()"
          />
          <el-button
            icon="el-icon-plus"
            @click="addOrg()">选择管理员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
    <cs-dialog
      :show="dialog.showAddDialog"
      :append-to-body="false"
      title="添加B端管理员"
      width="1000px"
      @close="closeBuserDetailDialog">
      <div
        style="width:400px;margin-bottom:20px">
        <el-input
          v-model="Form.keyWord"
          placeholder="关键词搜索"
          class="input-with-select">
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="getUserList"/>
        </el-input>
      </div>
      <cs-table
        ref="userList"
        :data="dialog.userList"
        :total="dialog.total"
        :pagesize="dialog.pagesize"
        :pageindex="dialog.pageindex"
        height="600px"
        hasselection
        haspage
        @selection-change="handleUserSelectionChange"
        @pageChange="pageUserChange">
        <el-table-column
          fixed="left"
          label="账号"
          min-width="140"
          align="center"
          show-overflow-tooltip
          prop="LOGIN_NAME"/>
        <el-table-column
          label="姓名"
          fixed="left"
          align="center"
          show-overflow-tooltip
          min-width="100"
          prop="USER_NAME"/>
        <el-table-column
          label="手机号"
          show-overflow-tooltip
          align="center"
          min-width="140"
          prop="MOBILEPHONE"/>
        <el-table-column
          label="联系邮箱"
          show-overflow-tooltip
          align="center"
          min-width="180"
          prop="EMAIL"/>
        <el-table-column
          min-width="240"
          show-overflow-tooltip
          label="学校/公司名称"
          align="center"
          prop="COMPANY"/>
        <el-table-column
          label="账号类型"
          show-overflow-tooltip
          align="center"
          min-width="100"
          prop="AccountTypeName"/>
        <el-table-column
          label="账号属性"
          align="center"
          min-width="100"
          show-overflow-tooltip
          prop="ACCOUNT_PURPOSE"/>
        <el-table-column
          label="开通日期"
          show-overflow-tooltip
          min-width="240"
          align="center"
          prop="CREATE_TIME"/>
        <el-table-column
          label="更新时间"
          min-width="240"
          show-overflow-tooltip
          align="center"
          prop="CREATE_TIME"/>
        <el-table-column
          label="用户状态"
          show-overflow-tooltip
          min-width="100"
          align="center"
          prop="UserStatusName"/>
      </cs-table>
      <div class="footer">
        <el-button
          type="primary"
          @click="addBuser">确定</el-button>
        <el-button @click="dialog.showAddDialog = false">取消</el-button>
      </div>
    </cs-dialog>
  </div>
</template>
<script>
import UserRightList from '@/views/Admin/RoleManager/components/rightList'
import CsRemoteSearch from '@/components/CsRemoteSearch'
import { fecthApplicationList } from '@/api/role.js'
import { fetchUserOrganizaionRange, addBUser, fetchUserList } from '@/api/user.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'AddOrg',
    components: { UserRightList, CsRemoteSearch },
    data() {
        var validateReg = (rule, value, callback) => {
            if (value.trim() !== '' && !/^[A-Za-z\u4e00-\u9fa5\.\(\)（）【】\{\}\[\]\s]*$/.test(value)) {
                callback(new Error('分部名称支持中英文、空格、大小中括号'))
            } else {
                callback()
            }
        }
        return {
            showDialog: false,
            Form: {
                OrgName: '',
                BClientUserCount: '',
                ApplicationId: '',
                USER_NAME: '',
                CustomerType: '',
                USER_ID: '',
                BranchName: '',
                Remark: ''
            },
            rules: {
                OrgName: [
                    { required: true, trigger: 'blur', message: '请输入机构/学校名称' }
                ],
                CustomerType: [{ required: true, trigger: 'change', message: '请选择组织类型' }],
                BClientUserCount: [{ required: true, trigger: 'blur', message: '请输入可管理账号数量' }],
                ApplicationId: [{ required: true, trigger: 'change', message: '请选择归属产品管理' }],
                USER_NAME: [
                    { message: '请输入B端管理员', trigger: ['blur', 'change'] }
                ],
                BranchName: [
                    { validator: validateReg, trigger: ['blur', 'change'] }
                ]
                // Remark: [
                //     { required: true, trigger: 'blur', message: '请输入备注' }
                // ]
            },
            adminOptions: [], // 管理员列表
            rolesErrorTip: '',
            rolesStatus: 'success',
            adminTypeInfoID: getStorage('PTYPEID'),
            ApplicationOptions: [],
            dialog: {
                showAddDialog: false,
                title: '新增B端管理员',
                userList: [],
                total: 0,
                pagesize: 10,
                pageindex: 1,
                singleSelection: []
            },
            CustomerTypeOptions: [{ ID: 1, Name: '机构' }, { ID: 2, Name: '学校' }, { ID: 3, Name: '公司' }, { ID: 4, Name: '个人' }]
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
        },
        'dialog.showAddDialog': function(n) {
            if (n) {
                this.getUserList() // 账号列表
                this.dialog.selections = []
            } else {
                this.$nextTick(() => {
                    this.$refs['userList'].clearSelection()
                })
            }
        }
    },
    created() {
        // getStorage('TYPEID') 根据管理员类型 选择
        if (getStorage('TYPEID') === '1' || getStorage('TYPEID') === '0') {
            this.getProducts()
        }
    },
    methods: {
        getStorage,
        fetchUserOrganizaionRange,
        addOrg() {
            this.dialog.showAddDialog = true
        },
        handleCloseTag(i) {
            this.Form.roles.splice(i, 1) // 删除权限标签
        },
        resetForm() {
            this.Form = {
                ROLE_NAME: '',
                DESCRIPTION: '',
                roles: [],
                CustomerType: ''
            }
        },
        goBack() {
            this.$router.go(-1)
        },
        closeBuserDetailDialog() {
            this.dialog.showAddDialog = false
        },
        handleAddAuth(selections, daterange, Value) {
            this.dialog.showAddDialog = false
            this.Form.roles = selections.map(row => {
                return {
                    ID: row.ID,
                    Name: row.Name,
                    BeginTime: daterange[0],
                    EndTime: daterange[1],
                    Value
                }
            })
        },
        handleSchoolSelect(op) {
            if (op.Count) {
                this.Form.BClientUserCount = op.Count
            }
            console.log('op:', op)
        },
        handleAdd(user) {
            this.Form.UserId = user.USER_ID
            this.Form.userName = user.userName
        },
        submitForm() {
            var _this = this
            this.$refs['addBUserForm'].validate((valid) => {
                if (valid) {
                    if (!(+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0)) {
                        this.Form.ApplicationId = getStorage('APPID')
                    }
                    const { OrgName, BClientUserCount, ApplicationId, USER_ID, CustomerType, BranchName, Remark } = this.Form
                    const data = {
                        OrgName,
                        BClientUserCount,
                        ApplicationId,
                        // UserId: USER_ID,
                        CustomerType,
                        BranchName,
                        Remark
                    }
                    if (USER_ID) {
                        data.UserId = USER_ID
                    }
                    addBUser(data).then((result) => {
                        _this.$message.success('新增成功')
                        _this.dialog.showAddDialog = false
                        _this.goBack()
                    })
                }
            })
        },
        pageUserChange(size, current) {
            this.dialog.pageindex = current
            this.dialog.pagesize = size
            this.getUserList()
        },
        handleUserSelectionChange(val) {
            if (val.length > 1) {
                this.$refs.userList.clearSelection()
                this.$refs.userList.toggleRowSelection(val[val.length - 1])
            }
            this.dialog.singleSelection = [val[val.length - 1]]
        },
        getUserList() {
            const data = this.getUserData()
            fetchUserList(data).then(res => {
                this.dialog.userList = res.Data || []
                this.dialog.total = res.Total || 0
            })
        },
        getUserData() {
            const data = {
                condition: {
                    'adminTypeInfoID': 0,
                    'conditionValue': this.Form.keyWord,
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0
                },
                pageIndex: this.dialog.pageindex,
                pageSize: this.dialog.pagesize

            }
            return data
        },
        addBuser() {
            if (!this.dialog.singleSelection.length) {
                this.$message.warning('请选择一个账号进行添加！')
                return
            }
            if (this.dialog.singleSelection[0]) {
                this.Form.USER_ID = this.dialog.singleSelection[0].USER_ID
                this.Form.USER_NAME = this.dialog.singleSelection[0].USER_NAME
            }
            this.dialog.showAddDialog = false
        },
        getProducts() {
            fecthApplicationList().then(res => {
                this.ApplicationOptions = res || []
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
.footer{
  text-align: center;
  margin-top: 20px;
}
</style>

<style lang="scss">
thead{
  th.el-table-column--selection {
      .cell {
          display: none !important;
          height: 40px;
      }
  }
}
.rowBtn{
  color: #515365;
  cursor: pointer;
  padding: 0 5px;
  &:hover{
    color: $--color-main;
  }
}
</style>
