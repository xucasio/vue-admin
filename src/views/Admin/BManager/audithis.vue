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
            class="filter-item"/>
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
        width="150"
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
        width="80"
        show-overflow-tooltip
        label="审核状态"
        align="center"
        header-align="center"
        prop="APPROVAL_STATE">
        <template slot-scope="scope">
          <span :class="['font-color-approve', 'state'+scope.row.APPROVAL_STATE]"> {{ labelAPLState(scope.row.APPROVAL_STATE) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        show-overflow-tooltip
        label="审核意见"
        header-align="center"
        prop="APPROVAL_REASON"/>
      <el-table-column
        width="180"
        show-overflow-tooltip
        label="申请日期"
        align="center"
        header-align="center"
        prop="APPLY_CREATE_TIME"/>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'
import { fetchQueryorganizaionapply } from '@/api/label'
import { getStorage } from '@/utils/auth.js'
import { customer_Type } from '@/utils/basedata'

export default {
    name: 'AuditHis',
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0

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
                    APPROVAL_STATE: '0',
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

        },
        showUserInfo() {

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
        labelState(v) {
            var list = ['', '正常', '已激活', '待激活', '删除']
            return list[v]
        },
        labelAPLState(v) {
            var list = ['', '待审批', '已审批', '已拒绝']
            return list[v]
        },
        getcustomerType(state) {
            var ct = customer_Type.find(f => f.id === state)
            if (ct) {
                return ct.name
            }
            return ''
        },
        closeCreateDialog() {
            this.showCreateDialog = false
        }
    }
}
</script>
