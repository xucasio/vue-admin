<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索账号、手机号 "
              @keyup.enter.native="handleSearch"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-button
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
      :pageindex="pageindex"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="账号"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="姓名"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="USER_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="联系邮箱"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="EMAIL"/>
      <el-table-column
        min-width="150"
        show-overflow-tooltip
        label="学校/公司名称"
        header-align="center"
        prop="COMPANY"/>
      <el-table-column
        min-width="50"
        show-overflow-tooltip
        label="用户状态"
        align="center"
        header-align="center"
        prop="UserStatusName"/>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="showUserInfo(scope.row.USER_ADMIN_ID)">详情</a>
          <a
            class="td-link"
            @click="gotoDelete(scope.row)">删除</a>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'

export default {
    name: 'BManagerList',
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showAddDialog: false
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
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'ConditionValue': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            fetchBClientUser(data).then(res => {
                this.data = res.Data
                this.total = res.Total
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        gotoAdd() {
            this.showAddDialog = true
        },
        showUserInfo() {

        },
        closeAddDialog() {
            this.showAddDialog = false
        },
        addSuccsee() {
            this.getList()
            this.showAddDialog = false
        },
        gotoDelete(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchDelBclientManager({
                    UserId: row.UserId,
                    AdminTypeInfoId: row.ADMIN_TYPE_INFO_ID
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
}
</script>
