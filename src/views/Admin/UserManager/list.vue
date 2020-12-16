<template>
  <div class="views-content">
    <div class="views-search">
      <div>
        <cs-key-search
          placeholder="请输入关键字"
          @search="handleSearch"
          @filter="handleFilter"/>
      </div>
      <el-collapse-transition>
        <div
          v-show="showFilter"
          class="fliter-content">
          <el-row
            :gutter="20"
            class="filter-view">
            <el-col
              :span="5"
              class="filter-item">
              <span class="fiter-item-title">用户状态：</span><div class="fiter-item-input">
                <el-select v-model="search.userState">
                  <el-option
                    v-for="us in userStates"
                    :key="us.id"
                    :value="us.id"
                    :label="us.name"/>
                </el-select>
              </div>
            </el-col>
            <el-col
              :span="5"
              class="filter-item">
              <span class="fiter-item-title">客户性质：</span><div class="fiter-item-input">
                <el-select v-model="search.customerType">
                  <el-option
                    v-for="us in customerTypes"
                    :key="us.id"
                    :value="us.id"
                    :label="us.name"/>
                </el-select>
              </div>
            </el-col>
            <el-col
              v-if="!isBuser"
              :span="5"
              class="filter-item">
              <span class="fiter-item-title">注册方式：</span><div class="fiter-item-input">
                <el-select v-model="search.registerType">
                  <el-option
                    v-for="us in registerTypes"
                    :key="us.id"
                    :value="us.id"
                    :label="us.name"/>
                </el-select>
              </div>
            </el-col>
            <el-col
              v-if="!isBuser"
              :span="9"
              class="filter-item">
              <span class="fiter-item-title">账号角色：</span><div class="fiter-item-input">
                <el-tooltip
                  :content="rolesname"
                  placement="top"
                  effect="light">
                  <el-input
                    v-model="rolesname"
                    placeholder="请选择"
                    readonly>
                    <i
                      v-if="rolesname"
                      slot="suffix"
                      class="el-icon-close el-input__icon pointer"
                      @click="resetRole"/>
                  </el-input>
                </el-tooltip>
                <el-button
                  type="text"
                  @click="showRoleDialog">选择角色</el-button>
              </div>
            </el-col>
            <el-col
              v-if="isBuser"
              :span="9"
              class="filter-item">
              <span class="fiter-item-title">标  签：</span><div class="fiter-item-input">

                <el-tooltip
                  :content="labelsname"
                  placement="top"
                  effect="light">
                  <el-input
                    v-model="labelsname"
                    placeholder="请选择"
                    readonly>
                    <i
                      v-if="labelsname"
                      slot="suffix"
                      class="el-icon-close el-input__icon pointer"
                      @click="resetLabel"/>
                  </el-input>

                </el-tooltip>
                <el-button
                  type="text"
                  @click="showLabelDialog">选择标签</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- <el-row
            :gutter="20"
            class="filter-view">
            <el-col
              :span="8"
              class="filter-item">
              <span class="fiter-item-title">账号到期：</span>
              <div class="fiter-item-input">
                <div class="fiter-item-input">
                  <el-date-picker v-model="search.startTime"/>
                  <span class="diff">至</span>
                  <el-date-picker v-model="search.endTime"/>
                </div>
              </div>
            </el-col>
          </el-row> -->
        </div>
      </el-collapse-transition>
      <div class="search-btns">
        <el-button
          v-if="points.indexOf('ADD')>-1&&TYPEID==='4'"
          icon="iconfont iconxinzeng"
          @click="showBuser">新增用户</el-button>
        <el-button
          v-if="points.indexOf('ADD')>-1&&TYPEID!=='4'"
          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增用户</el-button>
        <el-button
          v-if="points.indexOf('BATCHADD')>-1"
          icon="iconfont iconpiliangxinzeng"
          @click="importData">批量新增用户</el-button>
        <el-button
          v-if="points.indexOf('BATCHENABLE')>-1"
          icon="iconfont iconjinyong"
          @click="forbidUsers">禁用</el-button>
        <el-button
          v-if="points.indexOf('BATCHENABLE')>-1"
          icon="iconfont iconqiyong1"
          @click="startUsers">启用</el-button>
        <el-button
          v-if="points.indexOf('EXPORT')>-1"
          icon="iconfont icondaochu"
          @click="exportData">导出</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      :height="(screenHeight-330)"
      hasselection
      haspage
      @selection-change="handleSelectionChange"
      @pageChange="pageChange">
      <el-table-column
        label="账号"
        fixed="left"
        width="150"
        header-align="center"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="姓名"
        header-align="center"
        show-overflow-tooltip
        width="100"
        prop="USER_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        header-align="center"
        width="150"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="联系邮箱"
        show-overflow-tooltip
        header-align="center"
        width="200"
        prop="EMAIL"/>
      <el-table-column
        width="150"
        show-overflow-tooltip
        label="机构名称"
        header-align="center"
        prop="COMPANY"/>
      <el-table-column
        label="账号类型"
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="100"
        prop="AccountTypeName"/>
      <el-table-column
        label="账号属性"
        header-align="center"
        min-width="100"
        align="center"
        show-overflow-tooltip
        prop="ACCOUNT_PURPOSE"/>
      <el-table-column
        header-align="center"
        label="用户状态"
        width="80"
        align="center"
        prop="UserStatusName">
        <template slot-scope="scope">
          <span :class="['font-color', 'state'+scope.row.STATE]"> {{ labelState(scope.row.STATE) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开通日期"
        show-overflow-tooltip
        width="200"
        header-align="center"
        prop="CREATE_TIME"/>
      <el-table-column
        label="更新时间"
        width="200"
        show-overflow-tooltip
        header-align="center"
        prop="UPDATE_TIME"/>
      <el-table-column
        label="详情"
        show-overflow-tooltip
        width="80"
        align="center"
        header-align="center"
        prop="UserStatusName">
        <template slot-scope="scope">
          <a
            v-if="points.indexOf('SELDTL')>-1"
            class="td-link"
            @click="showUserInfo(scope.row.USER_ID)">详情</a>
        </template>

      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="170"
        prop="logiN_NAME">
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="设置"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('SET')>-1"
                icon="iconshezhi"
                @click.native="gotoSet(scope.row.USER_ID)"/>
            </el-tooltip>
            <el-tooltip
              v-if="points.indexOf('ENABLE')>-1 && scope.row.STATE===1"
              content="禁用"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconjinyong"
                @click.native="deleteUser(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              v-if="points.indexOf('ENABLE')>-1 && scope.row.STATE!==1"
              content="启用"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconqiyong1"
                @click.native="startUser(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="强制下线"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('FORCEDOFFLINE')>-1"
                icon="iconqiangzhixiaxian"
                @click.native="mustDown(scope.row.USER_ID)"/>
            </el-tooltip>
            <el-tooltip
              content="重置密码"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('RESETPASS')>-1"
                icon="iconzhongzhimima"
                @click.native="showRestDialog(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="设为管理员"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('SETBCLIENT')>-1"
                icon="iconshezhiguanliyuan"
                @click.native="setManager(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="踢出组织"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('KICKOUT')>-1"
                icon="iconchengyuantichu"
                @click.native="removeUser(scope.row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showInfo"
      width="720px"
      title="用户信息"

      @close="closeInfo">
      <UserInfo
        v-if="showInfo"
        :userid="curUserid"
        @success="userInfoSuccess"
      />
    </cs-dialog>
    <cs-dialog
      :show="showAllImport"
      width="500px"
      title="批量导入"
      @close="closeImportDialog">
      <ImportDialog
        @close="closeImportDialog"
        @success="importSuccess"/>
    </cs-dialog>
    <cs-dialog
      :show="showReset"
      width="500px"
      title="重置密码"
      @close="closeResetDialog">
      <ResetUser
        :user="curUser"
        @close="closeResetDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showForbidUser"
      :title="isStart?'启用用户':'禁用用户'"
      width="500px"
      @close="closeForbidDialog">
      <ForbidUser
        :users="forbidUserList"
        :isstart="isStart"
        @success="forbidSuccess"
        @close="closeForbidDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showRole"
      :append-to-body="false"
      title="选择角色"
      width="800px"
      @close="closeRole">
      <UserRoleList
        v-if="showRole"
        :hasdate="false"
        :allownull="true"
        :userid="curUserid"
        @close="closeRole"
        @add="handleAddRole"
      />
    </cs-dialog>
    <cs-dialog
      :show="showLabel"
      :append-to-body="false"
      title="选择标签"
      width="800px"
      @close="closeLabel">
      <LabelList
        v-if="showLabel"
        @close="closeLabel"
        @add="handleAddLabel"
      />
    </cs-dialog>
    <cs-dialog
      :show="showAddBuser"
      :append-to-body="false"
      title="添加账号"
      width="600px"
      @close="closeBUserDialog">
      <AddBuser
        v-if="showAddBuser"
        @success="addBuserSuccess"
        @close="closeBUserDialog"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchUserList, fetchUserExport, fetchUserLoginout, fetchUserState } from '@/api/user.js'
import { fetchBSetManager, fetchBDelOrgRelation } from '@/api/admin'
import UserInfo from './userInfo'
import ImportDialog from './importDialog'
import ResetUser from './resetPwd'
import ForbidUser from './forbidenUser'
import UserRoleList from './roleList'
import LabelList from './addLabel'
import AddBuser from './Buser/add'
import { getStorage } from '@/utils/auth'
import { userState, customer_Type, register_Type } from '@/utils/basedata.js'
import common from '@/utils/common'
import api from '@/api/api'
export default {
    name: 'UserList',
    components: { UserInfo, ImportDialog, ResetUser, ForbidUser, UserRoleList, AddBuser, LabelList },
    data() {
        console.log('userState:', userState)
        return {
            roles: [],
            forbidUserList: [],
            rolesname: '',
            labels: [],
            labelsname: '',
            showAddBuser: false,
            showRole: false,
            showLabel: false,
            showAllImport: false,
            showFilter: false,
            showReset: false,
            showForbidUser: false,
            keyWord: '',
            data: [],
            total: 0,
            pagesize: 10,
            pageindex: 1,
            showInfo: false,
            curUserid: '',
            curUser: {},
            curUsers: [],
            userStates: userState,
            customerTypes: customer_Type,
            registerTypes: register_Type,
            search: {
                userState: 0,
                registerType: 0,
                customerType: 0,
                startTime: '',
                endTime: '',
                roles: ''
            },
            TYPEID: getStorage('TYPEID'),
            loading: false,
            isStart: false,
            isBuser: +getStorage('TYPEID') === 4

        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight,
            MENUS: state => state.admin.menus
        })
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            var data = this.getData()
            this.showLoading('.cs-table')
            fetchUserList(data).then(res => {
                console.log('res:', res, typeof res)

                this.data = res.Data
                this.total = res.Total
                this.hideLoading()
            }).catch(ex => {
                this.$message.error(ex.message)
                this.hideLoading()
            })
        },
        addBuserSuccess() {
            this.showAddBuser = false
            this.getList()
        },
        handleFilter() {
            this.showFilter = !this.showFilter
        },
        handleSearch(val) {
            this.keyWord = val
            this.pageindex = 1
            this.getList()
        },
        gotoAdd() {
            this.$router.push('/home/adduser')
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        showRoleDialog() {
            this.showRole = true
        },
        showLabelDialog() {
            this.showLabel = true
        },
        showBuser() {
            this.showAddBuser = true
        },
        closeBUserDialog() {
            this.showAddBuser = false
        },
        closeRole() {
            this.showRole = false
        },
        closeLabel() {
            this.showLabel = false
        },
        closeInfo() {
            this.showInfo = false
        },
        userInfoSuccess() {
            this.showInfo = false
            this.getList()
        },
        showUserInfo(userid) {
            this.curUserid = userid
            this.showInfo = true
        },
        gotoSet(userid) {
            this.$router.push({ path: '/home/userSet', query: { userid }})
        },
        deleteUser(row) {
            this.forbidUserList = [row]
            this.isStart = false
            this.showForbidUser = true
            // this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除该文件, 是否继续?</div> ', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     dangerouslyUseHTMLString: true
            // }).then(() => {
            //     this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //     })
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     })
            // })
        },
        startUser(row) {
            this.forbidUserList = [row]
            this.isStart = true
            this.showForbidUser = true
            // this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 确定启用账号【' + row.LOGIN_NAME + '】, 是否继续?</div> ', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     dangerouslyUseHTMLString: true
            // }).then(() => {
            //     var data = {
            //         UserID: [row.USER_ID],
            //         IsOk: true,
            //         reason: ''
            //     }
            //     fetchUserState(data).then(res => {
            //         this.$message.success('启用成功')
            //         this.getList()
            //     })
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消操作'
            //     })
            // })
        },
        closeImportDialog() {
            this.showAllImport = false
        },
        importData() {
            this.showAllImport = true
        },
        importSuccess() {
            this.pageindex = 1
            this.getList()
        },
        exportData() {
            const Token = getStorage('TOKEN')
            const typeid = getStorage('TYPEID')
            const typeinfoid = getStorage('PTYPEID')
            const conditionStr = '?token=' + Token + '&typeid=' + typeid + '&typeinfoid=' + typeinfoid + '&PageIndex=' + this.pageindex + '&PageSize=' + this.pagesize
            var url = api.upmshost + 'api/Account/exportqueryuser' + conditionStr
            Object.keys(this.search).forEach(m => {
                if (this.search[m] || this.search[m] === 0) {
                    if (m === 'roles') {
                        var urlStr = ''
                        this.search[m].forEach(e => {
                            urlStr += '&Condition.' + m + '=' + e
                        })
                        url += urlStr
                    } else {
                        url += ('&Condition.' + m + '=' + this.search[m])
                    }
                }
            })
            url += '&Condition.ConditionValue=' + this.keyWord
            common.downLoadFile(url, '用户列表.xlsx')

            // fetchUserExport(this.getData()).then(res => {
            //     common.base64ToFile(res, '用户列表.xlsx')
            // })
        },
        getData() {
            var roles = this.roles.map(m => {
                return m.ROLE_ID
            })
            var data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    'conditionValue': this.keyWord,
                    'roles': roles,
                    'state': this.search.userState,
                    'customerType': this.search.customerType,
                    'register_Type': this.search.registerType,
                    'LableList': this.labels.map(item => {
                        return { Key: item.LABEL_ID, Value: item.LABEL_NAME }
                    })
                },
                pageIndex: this.pageindex,
                pageSize: this.pagesize,
                'acsFiles': [
                ],
                'descFiles': [
                ]

            }
            return data
        },
        mustDown(userid) {
            this.$confirm('是否确定强制下线？功能生效后，用户将立即从所有产品中退出登录，请谨慎操作！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                fetchUserLoginout(userid).then(res => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                })
            })
        },
        closeResetDialog() {
            this.showReset = false
        },
        showRestDialog(user) {
            this.curUser = user
            this.showReset = true
        },
        closeForbidDialog() {
            this.showForbidUser = false
        },
        forbidSuccess() {
            this.showForbidUser = false
            this.getList()
        },
        handleSelectionChange(val) {
            this.curUsers = val
        },
        forbidUsers() {
            if (this.curUsers.length <= 0) {
                this.$message.error('请选择需要禁用的用户')
                return
            }
            this.isStart = false
            this.forbidUserList = this.curUsers
            this.showForbidUser = true
        },
        startUsers() {
            if (this.curUsers.length <= 0) {
                this.$message.error('请选择需要启用的用户')
                return
            }
            this.isStart = true
            this.forbidUserList = this.curUsers
            this.showForbidUser = true
        },
        handleAddRole(roles) {
            this.rolesname = roles.length > 0 ? roles.map(m => { return m.ROLE_NAME }).join(',') : ''
            this.roles = roles
            this.showRole = false
        },
        handleAddLabel(labels) {
            this.labelsname = labels.length > 0 ? labels.map(m => { return m.LABEL_NAME }).join(',') : ''
            this.labels = labels
            this.showLabel = false
        },
        resetRole() {
            this.rolesname = ''
            this.roles = []
        },
        resetLabel() {
            this.labelsname = ''
            this.labels = []
        },
        setManager(row) {
            this.$confirm('<div class="alert-tips"> 是否将[' + (row.USER_NAME || row.LOGIN_NAME) + ']设置为管理员？ <br/>设置为管理员后，将拥有当前管理员同等的管理权限。通过管理员设置可查看管理员列表，对其进行设置。</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchBSetManager(row.USER_ID).then(res => {
                    this.$message({
                        type: 'success',
                        message: '设置成功!'
                    })
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })
            })
        },
        removeUser(row) {
            this.$confirm('<div class="alert-tips"> 是否将[' + (row.USER_NAME || row.LOGIN_NAME) + ']踢出组织？ <br/></div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchBDelOrgRelation(row.USER_ID).then(res => {
                    this.$message({
                        type: 'success',
                        message: '踢出成功!'
                    })
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })
            })
        },
        labelState(v) {
            var list = ['', '正常', '禁用', '未激活', '已删除']
            return list[v]
        }
    }
}
</script>
