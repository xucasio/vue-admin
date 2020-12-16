<template>
  <div id="doWarehouse">
    <div class="views-content">
      <div class="content-row mb20">
        <cs-row-tab
          title="订单信息"
        />
      </div>
      <div
        class="content-row"
        style="padding:20px 0">
        <el-row>
          <el-col :span="4">
            <span class="user-title">项目编号：</span>
            <span class="user-value">{{ baseInfo.LoginName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="user-title">出库单号：</span>
            <span class="user-value">{{ baseInfo.Name }}</span>
          </el-col>
          <el-col :span="4">
            <span class="user-title">关联出库单号：</span>
            <span class="user-value">{{ baseInfo.NickName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="user-title">客户名称：</span>
            <span class="user-value">{{ baseInfo.Mobile }}</span>
          </el-col>
          <el-col :span="4">
            <span class="user-title">客户联系方式：</span>
            <span class="user-value">{{ baseInfo.Company ||baseInfo.SchoolName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="user-title">客户邮箱：</span>
            <span class="user-value">{{ baseInfo.LinkPhone }}</span>
          </el-col>
        </el-row>
        <div
          class="content-row"
          style="padding:20px 0">
          <el-row>
            <el-col :span="4">
              <span class="user-title">客户类型：</span>
              <span class="user-value">{{ baseInfo.LinkPhone }}</span>
            </el-col>
            <el-col :span="4">
              <span class="user-title">合同开始时间：</span>
              <span class="user-value">{{ baseInfo.LinkPhone }}</span>
            </el-col>
            <el-col :span="4">
              <span class="user-title">合同结束时间：</span>
              <span class="user-value">{{ baseInfo.LinkPhone }}</span>
            </el-col>
            <el-col :span="4">
              <span class="user-title">可管理账号个数：</span>
              <span class="user-value">{{ baseInfo.LinkPhone }}</span>
            </el-col>
          </el-row>
        </div>

      </div>
      <div class="content-row">
        <cs-row-tab title="账号列表"/>
      </div>
      <div class="mgt30">
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
            label="产品名称"
            align="center"
            show-overflow-tooltip
            min-width="80"
            prop="LOGIN_NAME"/>
          <el-table-column
            label="处理类型"
            align="center"
            show-overflow-tooltip
            prop="USER_NAME"/>
          <el-table-column
            label="组织成员上限"
            align="center"
            prop="MOBILEPHONE"/>
          <el-table-column
            label="账号开通时间"
            align="center"
            prop="TELEPHONE"/>
          <el-table-column
            label="账号截止时间"
            show-overflow-tooltip
            align="center"
            prop="EMAIL"/>
          <el-table-column
            label="账号详情"
            show-overflow-tooltip
            align="center"
            prop="COMPANY">
            <template slot-scope="{row}">
              <a
                class="td-link"
                @click="showUserDetail(row)">详情</a>
            </template>
          </el-table-column>
        </cs-table>
      </div>
      <el-drawer
        :visible.sync="userDetailDialog"
        :with-header="false"
        :show-close="false"
      >
        <user-list
          :data="userList"
          title="产品XXXXXX"
          @close="closeUserDetailDialog"/>
      </el-drawer>
    </div>
  </div>
</template>
<script>
// import { createRole, fetchAdminlist } from '@/api/role.js'
import { mapState } from 'vuex'
import UserRoles from '../TobManager/components/roleTable'
import UserRights from '../TobManager/components/rightTable'
import { fetchBUserList, deleteBUser, detailBUser, addBUser } from '@/api/user.js'
import common from '@/utils/common.js'
import { } from '@/api/user.js'
import CsRemoteSearch from '@/components/CsRemoteSearch'
import { getStorage } from '@/utils/auth'
import { fecthApplicationList } from '@/api/role.js'
import UserList from './userList.vue'
export default {
    name: 'BUserDetail',
    components: {
        UserRoles, UserRights, CsRemoteSearch,
        UserList

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
            baseInfo: {},
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
            data: [{}],
            showUserDialog: false,
            CustomerTypeOptions: [{ ID: 1, Name: '机构' }, { ID: 2, Name: '学校' }, { ID: 3, Name: '公司' }, { ID: 4, Name: '个人' }],
            ApplicationOptions: [],
            userList: [],
            userDetailDialog: false
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })

    },
    created() {
        // this.getList()
        // this.getAdminInfo()
        // this.getProducts()
    },
    methods: {
        getStorage,
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
        },
        showUserDetail() {
            this.userDetailDialog = true
        },
        closeUserDetailDialog() {
            this.userDetailDialog = false
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
  #doWarehouse{
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
