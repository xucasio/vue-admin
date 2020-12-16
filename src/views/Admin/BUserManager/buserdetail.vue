<template>
  <div id="BUserSet">
    <div class="views-content">
      <div>
        <el-form
          ref="BUserForm"
          :model="Form"
          :rules="rules"
          label-width="120px" >
          <div class="content-row mb20">
            <cs-row-tab title="组织信息"/>
          </div>
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
            required
            prop="UserManagerCount">
            <el-input
              v-model="Form.UserManagerCount"
              maxlength="7"
              placeholder="请输入数量"/>
          </el-form-item>
          <el-form-item
            v-if="(+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0)"
            label="归属产品管理"
            prop="ApplicationId">
            <el-select
              v-model="Form.ApplicationId"
              filterable
              disabled
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
        <cs-row-tab title="管理员列表"/>
      </div>
      <div class="mgt30">
        <div
          class="views-search">
          <div
            class="filter-item"
            style="width:400px;">
            <el-input
              v-model="search.keyWord"
              placeholder="请搜索关键词"
              class="input-with-select"
              @keyup.enter.native="getList">
              <el-button
                slot="append"
                type="primary"
                icon="el-icon-search"
                @click="getList"/>
            </el-input>
          </div>
          <el-button
            style="margin-top:15px"
            icon="iconfont iconxinzeng"
            @click="goAddUser">新增管理员</el-button>
        </div>
        <cs-table
          :data="data"
          :total="total"
          :pagesize="pagesize"
          :pageindex="pageindex"
          :height="(screenHeight-570)"
          hasindex
          haspage
          @pageChange="pageChange">
          <el-table-column
            label="账号"
            header-align="center"
            show-overflow-tooltip
            min-width="80"
            prop="LOGIN_NAME"/>
          <el-table-column
            label="姓名"
            header-align="center"
            show-overflow-tooltip
            prop="USER_NAME"/>
          <el-table-column
            label="手机号"
            align="center"
            header-align="center"
            prop="MOBILEPHONE"/>
          <el-table-column
            label="联系电话"
            header-align="center"
            prop="TELEPHONE"/>
          <el-table-column
            label="联系邮箱"
            show-overflow-tooltip
            header-align="center"
            prop="EMAIL"/>
          <el-table-column
            label="学校/公司名称"
            show-overflow-tooltip
            header-align="center"
            prop="COMPANY"/>
          <el-table-column
            label="B端管理员类型"
            header-align="center"
            align="center"
            show-overflow-tooltip
            prop="PidStr"/>
          <el-table-column
            label="所属组织"
            header-align="center"
            show-overflow-tooltip
            prop="CUSTOMER_NAME"/>
          <el-table-column
            align="center"
            label="用户状态"
            header-align="center"
            prop="STATE">
            <template slot-scope="scope">
              <span :class="['font-color', 'state'+scope.row.STATE]"> {{ labelState(scope.row.STATE) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="管理"
            header-align="center"
            align="center"
            width="100"
            prop="">
            <template slot-scope="{row}">
              <div class="table-manage">
                <el-tooltip
                  content="删除"
                  placement="top"
                  effect="light">
                  <cs-round-button
                    icon="iconshanchu"
                    @click.native="delBUser(row)"/>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </cs-table>
        <cs-dialog
          :show="showUserDialog"
          :append-to-body="false"
          title="添加B端管理员"
          width="1000px"
          @close="closeUser">
          <UserList
            @add="addUser"
            @close="closeUser"
          />
        </cs-dialog>
      </div>
    </div>
  </div>
</template>
<script>
// import { createRole, fetchAdminlist } from '@/api/role.js'
import { mapState } from 'vuex'
import UserRoles from '../TobManager/components/roleTable'
import UserRights from '../TobManager/components/rightTable'
import UserList from './userList'
import { fetchAdminUserCountChange, fetchBUserList, deleteBUser, detailBUser, addBUser } from '@/api/user.js'
import common from '@/utils/common.js'
import { fetchUserOrganizaionRange } from '@/api/user.js'
import CsRemoteSearch from '@/components/CsRemoteSearch'
import { getStorage } from '@/utils/auth'
import { fecthApplicationList } from '@/api/role.js'
export default {
    name: 'BUserDetail',
    components: {
        UserRoles, UserRights, CsRemoteSearch, UserList

    },
    data() {
        // ^[1-9]\d*$
        var validateCount = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入数量'))
            } else if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('数量必须为正整数'))
            } else if (value > 9999999) {
                callback(new Error('数量不得大于9999999'))
            } else {
                callback()
            }
        }
        var validateReg = (rule, value, callback) => {
            if (value && value.trim() !== '' && !/^[A-Za-z\u4e00-\u9fa5\.\(\)（）【】\{\}\[\]\s]*$/.test(value)) {
                callback(new Error('分部名称支持中英文、空格、大小中括号'))
            } else {
                callback()
            }
        }
        return {
            Form: {
                Condition: '',
                type: '1',
                UserManagerCount: common.getUrlKey('account'),
                OrgName: '',
                UserId: '',
                ApplicationId: '',
                CustomerType: '',
                BranchName: '',
                Remark: ''
            },
            rules: {
                UserManagerCount: [
                    { validator: validateCount, trigger: ['blur', 'change'] }
                ],
                OrgName: [
                    { required: true, trigger: 'blur', message: '请输入机构/学校名称' }
                ],
                CustomerType: [{ required: true, trigger: 'change', message: '请选择组织类型' }],
                ApplicationId: [{ required: true, trigger: 'change', message: '请选择归属产品管理' }],
                USER_NAME: [
                    { required: true, message: '请输入B端管理员', trigger: ['blur', 'change'] }
                ],
                BranchName: [
                    { validator: validateReg, trigger: ['blur', 'change'] }
                ]
            },
            userId: common.getUrlKey('userId'),
            adminTypeInfoId: common.getUrlKey('adminTypeInfoId'),
            search: {
                keyWord: ''
            },
            pageindex: 1,
            pagesize: 10,
            total: 0,
            data: [],
            showUserDialog: false,
            CustomerTypeOptions: [{ ID: 1, Name: '机构' }, { ID: 2, Name: '学校' }, { ID: 3, Name: '公司' }, { ID: 4, Name: '个人' }],
            ApplicationOptions: []
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })

    },
    created() {
        this.getList()
        this.getAdminInfo()
        this.getProducts()
    },
    methods: {
        getStorage,
        fetchUserOrganizaionRange,
        getList() {
            fetchBUserList(this.getData()).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },
        getData() {
            const data = {
                condition: {
                    'IsEffective': true,
                    'ConditionValue': this.search.keyWord,
                    'AdminTypeInfoId': this.adminTypeInfoId

                },
                pageIndex: this.pageindex,
                pageSize: this.pagesize
            }
            return data
        },
        submitForm() {
            const { OrgName, UserManagerCount, USER_ID, CustomerType, BranchName, Remark } = this.Form
            this.$refs['BUserForm'].validate((valid) => {
                if (valid) {
                    const data = {
                        'AdminTypeInfoId': this.adminTypeInfoId,
                        'UserManagerCount': Number(UserManagerCount),
                        CUSTOMER_NAME: OrgName,
                        USER_ID,
                        CustomerType,
                        BranchName,
                        Remark
                    }
                    fetchAdminUserCountChange(data).then(res => {
                        if (res === true) {
                            this.$message.success('设置成功')
                            this.resetForm()
                            this.$router.push('/tob/buserList')
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
        delBUser(row) {
            console.log(row)
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 确定删除该条记录?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleteBUser({
                    AdminTypeInfoId: row.ADMIN_TYPE_INFO_ID,
                    UserId: row.USER_ID
                }).then(res => {
                    this.$message.success('删除成功')
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        labelState(v) {
            var list = ['', '正常', '已激活', '待激活', '删除']
            return list[v]
        },
        getAdminInfo() { // 获取组织信息，用于管理员添加
            detailBUser(null, this.adminTypeInfoId).then((res) => {
                this.Form.OrgName = res.CUSTOMER_NAME
                this.Form.ApplicationId = res.APPLICATION_ID
                this.Form.UserId = res.UserId
                this.Form.CustomerType = res.CUSTOMER_TYPE
                this.Form.BranchName = res.BranchName
                this.Form.Remark = res.Remark
            })
        },
        goAddUser() {
            this.showUserDialog = true
        },
        addUser(obj) {
            const userdata = {
                UserId: obj.USER_ID,
                OrgName: this.Form.OrgName,
                BClientUserCount: this.Form.UserManagerCount,
                ApplicationId: this.Form.ApplicationId
            }
            addBUser(userdata).then(res => {
                if (res) {
                    this.$message.success('新增成功')
                    this.getList()
                }
            })
        },
        closeUser() {
            this.showUserDialog = false
        },
        getProducts() {
            fecthApplicationList().then(res => {
                this.ApplicationOptions = res || []
            })
        },
        handleSchoolSelect(op) {
            if (op.Count) {
                this.Form.BClientUserCount = op.Count
            }
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
          width: 100%;
        }
      }
      .input-item{
        padding-top:36px;
        display:flex;
          .search{
            flex: 1;
          }
      }
    }
    .el-form-item{
      .el-select{
        width: 100%;
      }
    }
  }
</style>
