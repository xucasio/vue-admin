<template>
  <div
    id="userBList"
    class="views-content">
    <div
      v-if="points.indexOf('SELECT')>-1"
      class="views-search">
      <div
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索关键词"
          class="input-with-select"
          @keyup.enter.native="handleSearch">
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"/>
        </el-input>
      </div>
    </div>
    <cs-table
      :data="table.data"
      :total="page.total"
      :height="(screenHeight-280)"
      :pagesize="page.size"
      :pageindex="page.current"
      haspage
      @pageChange="pageChange">
      <el-table-column
        label="序号"
        min-width="60">
        <template slot-scope="scope">
          <span>{{ (page.current - 1) * page.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账号"
        header-align="center"
        show-overflow-tooltip
        min-width="80"
        prop="LOGIN_NAME"/>
      <el-table-column
        label="姓名"
        header-align="center"
        prop="USER_NAME"/>
      <el-table-column
        label="手机号"
        header-align="center"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="联系电话"
        header-align="center"
        prop="TELEPHONE"/>
      <el-table-column
        label="联系邮箱"
        header-align="center"
        prop="EMAIL"/>
      <el-table-column
        label="学校/公司名称"
        show-overflow-tooltip
        header-align="center"
        prop="COMPANY"/>
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
        <template slot-scope="{row}">
          {{ stateMap[row.STATE] }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        header-align="center"
        align="center"
        prop="">
        <template slot-scope="{row}">
          <div class="btn-flex">
            <el-tooltip
              content="设置"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('SET')>-1"
                icon="iconshezhi"
                @click.native="setBUser(row)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="delBUser(row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="dialog.showAddDialog"
      :append-to-body="false"
      :title="dialog.title"
      width="1000px"
      @close="dialog.showAddDialog = false">
      <div>
        <el-form
          ref="addBUserForm"
          :model="Form"
          :rules="rules"
          label-width="120px">
          <el-row
            :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="学校/机构名称"
                prop="OrgName">
                <!-- <el-input v-model="Form.OrgName"/> -->
                <CsRemoteSearch
                  ref="OrgName"
                  :requestfn="fetchUserOrganizaionRange"
                  :key-attr="'keywords'"
                  v-model="Form.OrgName"
                  :params="{}"
                  :res-path="[]"
                  :default-props="{label: 'Name', value: 'Name'}"
                  :placeholder="'请输入学校/机构名称'"
                  @select="handleSchoolSelect"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item
                label="可管理账号数量"
                prop="BClientUserCount">
                <el-input v-model="Form.BClientUserCount"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="(+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0)"
                label="归属产品管理"
                prop="ApplicationId">
                <el-select
                  v-model="Form.ApplicationId"
                  filterable
                  placeholder="请选择角色归属"
                  @change="ApplicationChange">
                  <el-option
                    v-for="item in ApplicationOptions"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div
            class="filter-item mb15"
            style="width:400px;">
            <el-input
              v-model="Form.keyWord"
              placeholder="请搜索关键词"
              class="input-with-select">
              <el-button
                slot="append"
                type="primary"
                icon="el-icon-search"
                @click="getUserList"/>
            </el-input>
          </div>
        </el-form>
        <cs-table
          ref="userList"
          :data="dialog.userList"
          :total="dialog.total"
          :pagesize="dialog.pagesize"
          :pageindex="dialog.pageindex"
          :height="(screenHeight-340)"
          hasselection
          haspage
          @selection-change="handleUserSelectionChange"
          @pageChange="pageUserChange">
          <el-table-column
            fixed="left"
            label="账1号"
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
            prop="creatE_TIME"/>
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
      </div>
    </cs-dialog>
    <cs-dialog
      :show="showBuserDetailDialog"
      :append-to-body="false"
      title="管理账号列表详情"
      @close="closeBuserDetailDialog">
      <detailBUser
        :id="adminTypeInfoID"
        :is-show="showBuserDetailDialog"
        @close="closeBuserDetailDialog"/>
    </cs-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchBUserList, deleteBUser, fetchUserList, addBUser, fetchUserOrganizaionRange } from '@/api/user.js'
import { fecthApplicationList } from '@/api/role.js'
import { userState } from '@/utils/basedata.js'
import CsRemoteSearch from '@/components/CsRemoteSearch'
import detailBUser from './components/detailBUser'
import { getStorage } from '@/utils/auth'
export default {
    name: 'UserList',
    components: {
        CsRemoteSearch, detailBUser
    },
    data() {
        return {
            search: {
                keyWord: ''
            },
            table: {
                data: []
            },
            Form: {
                OrgName: '',
                BClientUserCount: '',
                ApplicationId: '',
                ApplicationMark: '',
                keyWord: ''
            },
            rules: {
                OrgName: [{ required: true, trigger: 'blur', message: '请输入机构/学校名称' }],
                BClientUserCount: [{ required: true, trigger: 'blur', message: '请输入可管理账号数量' }],
                ApplicationId: [{ required: true, trigger: 'change', message: '请选择归属产品管理' }]
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            // stateOptions: [
            //     { id: -1, name: '普通用户' },
            //     { id: 0, name: '超管' },
            //     { id: 1, name: '系统管理员' },
            //     { id: 2, name: '平台管理员' },
            //     { id: 3, name: '产品管理员' },
            //     { id: 4, name: 'B端管理员' },
            //     { id: 5, name: '交易所审计员' }
            // ],
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
            stateOptions: userState,
            showBuserDetailDialog: false,
            adminTypeInfoID: null // 用于详情
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        }),
        stateMap() {
            const obj = {}
            this.stateOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    watch: {
        'dialog.showAddDialog': function(n) {
            if (n) {
                this.getProducts() // 获取列表
                this.getUserList() // 账号列表
            } else {
                this.resetForm() // 清空新增表单
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getStorage,
        fetchBUserList,
        fetchUserOrganizaionRange,
        handleSearch() {
            this.page.current = 1
            this.getList()
        },
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            fetchBUserList(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
                this.hideLoading()
            }).catch(ex => {
                this.hideLoading()
            })
        },
        getUserList() {
            const data = this.getUserData()
            fetchUserList(data).then(res => {
                this.dialog.userList = res.Data || []
                this.dialog.total = res.Total || 0
            })
        },
        gotoAdd() {
            this.dialog.showAddDialog = true
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    'conditionValue': this.search.keyWord,
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0
                },
                pageIndex: this.page.current,
                pageSize: this.page.size
            }
            return data
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

        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        },
        handleUserSelectionChange(val) {
            if (val.length > 1) {
                this.$refs.userList.clearSelection()
                this.$refs.userList.toggleRowSelection(val[val.length - 1])
            }
            this.dialog.singleSelection = [val[val.length - 1]]
        },
        pageUserChange(size, current) {
            this.dialog.pageindex = current
            this.dialog.pagesize = size
            this.getUserList()
        },
        // 设置B端管理员
        setBUser(row) {
            this.$router.push({ path: '/tob/BUserSet', query: { userId: row.USER_ID, adminTypeInfoId: row.ADMIN_TYPE_INFO_ID }})
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
        getProducts() {
            fecthApplicationList().then(res => {
                this.ApplicationOptions = res || []
            })
        },
        resetForm() {
            this.Form = {
                OrgName: '',
                BClientUserCount: '',
                ApplicationId: '',
                ApplicationMark: '',
                keyWord: ''
            }
            this.dialog.singleSelection = []
            this.$nextTick(() => {
                this.$refs['addBUserForm'].clearValidate()
                this.$refs['OrgName'].$set(this.$refs['OrgName'].$data, 'state', '')
            })
        },
        ApplicationChange(val) {
            const obj = this.ApplicationOptions.find(i => i.ID === val)
            if (obj) {
                this.Form.ApplicationMark = obj.ApplicationMark
            }
        },
        addBuser() {
            var _this = this
            this.$refs['addBUserForm'].validate((valid) => {
                if (valid) {
                    if (!_this.dialog.singleSelection.length) {
                        _this.$message.warning('请选择一个账号进行添加！')
                        return
                    }
                    const [{ USER_ID }] = _this.dialog.singleSelection
                    if (!(+getStorage('TYPEID') === 1 || +getStorage('TYPEID') === 0)) {
                        this.Form.ApplicationId = getStorage('APPID')
                        this.Form.ApplicationMark = getStorage('APPMARK')
                    }
                    const { OrgName, BClientUserCount, ApplicationId, ApplicationMark } = this.Form
                    const data = {
                        OrgName,
                        BClientUserCount,
                        ApplicationId,
                        ApplicationMark,
                        UserId: USER_ID
                    }
                    addBUser(data).then((result) => {
                        _this.$message.success('新增成功')
                        _this.getList()
                        _this.dialog.showAddDialog = false
                    })
                }
            })
        },
        gotoDetail(row) {
            this.showBuserDetailDialog = true
            this.adminTypeInfoID = row.ADMIN_TYPE_INFO_ID
        },
        closeBuserDetailDialog() {
            this.showBuserDetailDialog = false
        },
        handleSchoolSelect(op) {
            if (op.Count) {
                this.Form.BClientUserCount = op.Count
            }
            // console.log('op:', op)
        }
    }
}
</script>
<style lang="scss">
#userBList{
  .filter-item{
    display: flex;
    flex-direction: row;
    .el-button{
      background-color:  $--color-main;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      padding: 11px 20px;
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
  .mb15{
    margin-bottom: 15px;
  }
  .mt20{
    margin-top: 20px;
  }
  thead {
    .el-table-column--selection {
        .cell {
            display: none;
        }
    }
  }
  .footer{
    text-align:center;
    margin-top: 20px;
  }
  .btn-flex{
    display: flex;
    justify-content: center;
  }
}

</style>
