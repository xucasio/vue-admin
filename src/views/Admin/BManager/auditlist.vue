<template>
  <div>
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="18"
            class="filter-item">
            <el-button
              type="primary"
              plain
              @click="gotoAgree">同意</el-button>
            <el-button
              type="danger"
              plain
              @click="gotoDisAgree">拒绝</el-button>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索用户名、姓名、手机号"
              @keyup.enter.native="handleSearch"/>
            <el-button
              style="margin-left:10px"
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>

        </el-row>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :height="(screenHeight-370)"
      :pageindex="pageindex"
      haspage
      hasindex
      hasselection
      @selection-change="handleSelectionChange"
      @pageChange="pageChange">
      <el-table-column
        label="账号"
        width="150"
        header-align="center"
        show-overflow-tooltip
        prop="LoginName"/>
      <el-table-column
        label="姓名"
        show-overflow-tooltip
        header-align="center"
        width="150"
        prop="UserName"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        header-align="center"
        width="150"
        prop="MobilePhone"/>
      <el-table-column
        label="联系邮箱"
        show-overflow-tooltip
        header-align="center"
        width="150"
        prop="Email"/>
      <el-table-column
        min-width="200"
        show-overflow-tooltip
        label="学校/公司名称"
        header-align="center"
        prop="COMPANY"/>
      <el-table-column
        width="80"
        show-overflow-tooltip
        label="账号类型"
        align="center"
        header-align="center"
        prop="CustomerType">
        <template slot-scope="scope"> {{ getcustomerType(scope.row.CustomerType) }}</template>
      </el-table-column>
      <el-table-column
        width="100"
        show-overflow-tooltip
        label="服务器IP"
        align="center"
        header-align="center"
        prop="IP"/>
      <el-table-column
        width="80"
        show-overflow-tooltip
        label="用户状态"
        align="center"
        header-align="center"
        prop="State">
        <template slot-scope="scope">
          <span :class="['font-color', 'state'+scope.row.State]"> {{ labelState(scope.row.State) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        show-overflow-tooltip
        label="申请日期"
        align="center"
        header-align="center"
        prop="APPLY_CREATE_TIME"/>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="showUserInfo(scope.row.UserID)">查看</a>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAgreeDialog"
      :append-to-body="false"
      width="450px"
      title="同意申请"
      @close="closeDialog">
      <Agree
        v-if="showAgreeDialog"
        :accounts="curAccounts"
        @success="Succsee"
        @error="error"
        @close="closeDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showDisAgreeDialog"
      :append-to-body="false"
      width="450px"
      title="拒绝申请"
      @close="closeDialog">
      <DisAgree
        v-if="showDisAgreeDialog"
        :accounts="curAccounts"
        @success="Succsee"
        @error="error"
        @close="closeDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showInfo"
      width="720px"
      title="用户信息"
      @close="closeInfo">
      <UserInfo
        v-if="showInfo"
        :userid="curUserid"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'
import { fetchQueryorganizaionapply } from '@/api/label'
import { getStorage } from '@/utils/auth.js'
import { customer_Type } from '@/utils/basedata'
import Agree from './audit/agree.vue'
import DisAgree from './audit/disagree.vue'
import CreatePWd from './createpwd'
import UserInfo from '../UserManager/userInfo'

export default {
    name: 'AuditList',
    components: { Agree, DisAgree, CreatePWd, UserInfo },
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            curLabel: {},
            showDisAgreeDialog: false,
            showAgreeDialog: false,
            showCreateDialog: false,
            curAccounts: [],
            showInfo: false,
            curUserid: ''
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'ADMIN_TYPE_INFO_ID': getStorage('PTYPEID'),
                    APPROVAL_STATE: '1',
                    'Keyword': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            this.showLoading('.cs-table')
            fetchQueryorganizaionapply(data).then(res => {
                this.data = res.Data
                this.total = res.Total
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                    this.hideLoading()
                })
            }).catch(ex => {
                this.hideLoading()
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        gotoDisAgree() {
            if (this.curAccounts.length <= 0) {
                this.$message.error('请选择流程')
                return
            }
            this.showDisAgreeDialog = true
        },
        gotoAgree() {
            if (this.curAccounts.length <= 0) {
                this.$message.error('请选择流程')
                return
            }
            this.showAgreeDialog = true
        },
        gotoCreate() {
            if (this.curAccounts.length > 1 || this.curAccounts.length <= 0) {
                this.$message.error('请选择一个流程')
                return
            }
            this.curLabel = this.curAccounts[0]
            this.showCreateDialog = true
        },
        showUserInfo(UserID) {
            this.curUserid = UserID
            this.showInfo = true
        },
        closeInfo() {
            this.showInfo = false
        },
        closeDialog() {
            this.showDisAgreeDialog = false
            this.showAgreeDialog = false
        },
        Succsee() {
            this.getList()
            this.showDisAgreeDialog = false
            this.showAgreeDialog = false
        },
        // 批量操作含失败弹窗关闭，刷新列表
        error() {
            this.getList()
            this.showDisAgreeDialog = false
            this.showAgreeDialog = false
        },
        handleSelectionChange(val) {
            this.curAccounts = val
        },
        labelState(v) {
            var list = ['', '正常', '已激活', '待激活', '删除']
            return list[v]
        },
        getcustomerType(state) {
            var ct = customer_Type.find(f => f.id === state)
            if (ct) {
                return ct.name
            }
            return ''
        }
        // closeCreateDialog() {
        //     this.showCreateDialog = false
        // }
    }
}
</script>
