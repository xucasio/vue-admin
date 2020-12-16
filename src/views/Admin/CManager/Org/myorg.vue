<template>
  <div>
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="12"
            :offset="6"
            class="filter-item"/>
          <!-- <el-col
            :span="6"
            class="filter-item">
            申请类型：
            <el-select v-model="cusType">

              <el-option
                v-for="cs in customerTypes"
                :key="cs.id"
                :value="cs.id"
                :label="cs.name"/>
            </el-select>
          </el-col> -->
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索名称"/>
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
      :pageindex="pageindex"
      :height="(screenHeight-380)"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="名称"
        header-align="center"
        show-overflow-tooltip
        prop="CUSTOMER_NAME"/>
      <!-- <el-table-column
        label="类型"
        show-overflow-tooltip
        header-align="center"
        width="150"
        align="center"
        prop="STATE">
        <template slot-scope="scope">
          {{ getCusType(scope.row.STATE) }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="管理"
        show-overflow-tooltip
        header-align="center"
        width="150"
        align="center"
        prop="UserName">
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="logOut(scope.row)">退出</a>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchOrgList, fetchOrgRelationDel } from '@/api/label'
import { getStorage } from '@/utils/auth.js'
import { customer_Type } from '@/utils/basedata'

export default {
    name: 'MyOrg',
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            cusType: 0,
            pagesize: 10,
            pageindex: 1,
            total: 0,
            customerTypes: customer_Type

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
                    USER_ID: getStorage('USERID'),
                    APPROVAL_STATE: 0,
                    CUSTOMER_TYPE: this.cusType,
                    'Keyword': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            fetchOrgList(data).then(res => {
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
        logOut(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 是否确定退出组织【 ' + row.CUSTOMER_NAME + '】？ </div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                var data = {
                    'USER_ID': getStorage('USERID'),
                    'ADMIN_TYPE_INFO_ID': row.ADMIN_TYPE_INFO_ID
                }
                fetchOrgRelationDel(data).then(res => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
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
        getCusType(v) {
            var f = this.customerTypes.find(f => f.id == v)
            if (f) {
                return f.name
            }
            return ''
        }
    }
}
</script>
