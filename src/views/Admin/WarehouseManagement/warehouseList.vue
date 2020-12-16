<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          class="filter-view form-search">
          <el-col
            :span="8"
            class="filter-item">
            <span class="label l">合同起止时间：</span>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="rangeChange"/>
          </el-col>
          <el-col
            :span="8"
            class="filter-item">
            <span class="label">客户类型：</span>
            <el-select
              v-model="search.customerType"
              :popper-append-to-body="false"
              placeholder="请选择客户类型"
              @change="statistiIdChange">
              <el-option
                v-for="(item,index) in customerTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-col>
          <el-col
            :span="8"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索项目编号、出库单号、关联出库单号、客户名称、客户联系方式、客户邮箱、产品名称"
              @keyup.enter.native="handleSearch"/>
            <el-button
              style="margin-left:10px"
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
        <div class="search-btns">
          <el-button
            type="primary"
            style="width:120px"
            @click="exportData">导出</el-button>
        </div>
      </div>
    </div>
    <cs-table
      ref="warehouseList"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :reserve-selection="true"
      :row-key="'ID'"
      :height="(screenHeight-350)"
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
        label="项目编号"
        show-overflow-tooltip
        min-width="180"
        prop="Mark"/>
      <el-table-column
        label="出库单号"
        show-overflow-tooltip
        min-width="180"
        prop="AUTHORITY_ID"/>
      <el-table-column
        label="关联出库单"
        show-overflow-tooltip
        min-width="180"
        prop="AuthorityType"/>
      <el-table-column
        label="客户名称"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="客户类型"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="客户联系方式"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="客户邮箱"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="合同开始时间"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="合同结束时间"
        show-overflow-tooltip
        min-width="180"
        prop="Name"/>
      <el-table-column
        label="出库状态"
        show-overflow-tooltip
        min-width="120"
        prop="Name"/>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="140">
        <template slot-scope="{row}">
          <a
            class="td-link"
            @click="showDetail(row)">详情</a>
          <a
            class="td-link"
            @click="gotoWarehouse(row)">出库</a>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getStorage } from '@/utils/auth'
import api from '@/api/api'
import common from '@/utils/common'
import { fetchAuthList } from '@/api/role.js'
export default {
    name: 'WarehouseList',
    data() {
        return {
            search: {
                keyWord: '',
                startTime: '',
                endTime: ''
            },
            daterange: [],
            table: {
                data: [],
                selections: []
            },
            form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            customerTypeOptions: [{ id: 0, name: '全部' }, { id: 1, name: '正式用户' }, { id: 2, name: '试用用户' }]
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            const data = this.getData()
            fetchAuthList(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
            })
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': 0,
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
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
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
            common.downLoadFile(url, '出库列表.xlsx')
        },
        showDetail() {
            this.$router.push('/warehouse/warehouseDetail')
        },
        gotoWarehouse() {
            this.$router.push('/warehouse/doWarehouse')
        },
        rangeChange(val) {
            if (val && val.length) {
                this.StartTime = val[0]
                this.EndTime = val[1]
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.form-search{
  padding-bottom: 10px;
  .filter-item{
    display: flex;
    flex-direction: row;
    .label{
      line-height: 36px;
      padding: 0 4px;
      width: 80px;
      text-align: right;
    }
    .l{
        width: 100px;
    }
    .el-button{
      background-color:  $--color-main;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      padding: 11px 20px;
    }
  }
}
.footer{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
