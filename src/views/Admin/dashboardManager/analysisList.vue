<template>
  <div>
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="5"
            class="filter-item">
            <span class="label">统计类型：</span>
            <el-select
              v-model="STATISTICSID"
              :popper-append-to-body="false"
              placeholder="请选择统计类型"
              @change="statistiIdChange">
              <el-option
                v-for="(item,index) in STATISTICSOptions"
                :key="index"
                :label="item.STATISTICS_NAME"
                :value="item.ID"/>
            </el-select>
          </el-col>

          <el-col
            :span="5"
            class="filter-item">
            <span class="label">统计方式：</span>
            <el-select
              v-model="type"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="typeChange">
              <el-option
                v-for="item in TypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
          <el-col
            :span="7"
            class="filter-item">
            <span class="label">统计时间：</span>
            <el-date-picker
              v-model="range"
              :type="type==1?'daterange':'monthrange'"
              :start-placeholder="type==1?'开始日期':'开始月份'"
              :end-placeholder="type==1?'结束日期':'结束月份'"
              :value-format="type==1?'yyyy-MM-dd':'yyyy-MM'"
              range-separator="至"
              @change="rangeChange"/>
          </el-col>
          <el-col
            :span="5"
            class="filter-item"
            style="margin-bottom:0"
          >
            <el-button
              style="margin-left:10px"
              type="primary"
              @click="handleSearch">查询</el-button>
            <el-button
              @click="resetForm">重置</el-button>
          </el-col>

        </el-row>
        <el-row>
          <el-col
            :span="24"
            class="filter-item">
            <el-button
              type="text"
              @click="gotoRuleList">配置统计规则</el-button>
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
      :height="(screenHeight-430)"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="统计时间"
        header-align="center"
        prop="MONTHDAY"/>
      <el-table-column
        label="新增用户"
        align="center"
        prop="NEW_USER_COUNT">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="openDetail(row,0)">{{ row.NEW_USER_COUNT }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="缴费用户"
        align="center"
        prop="PAY_USER_NUMBER">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="openDetail(row,2)">{{ row.PAY_USER_NUMBER }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="到期用户"
        align="center"
        prop="END_USER_COUNT">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="openDetail(row,1)">{{ row.END_USER_COUNT }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="缴费用户总数"
        align="center"
        prop="USER_NUMBER">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="openDetail(row,-1)">{{ row.USER_NUMBER }}</el-button>
        </template>
      </el-table-column> -->
    </cs-table>
    <cs-dialog
      :show="showDetailDialog"
      :append-to-body="false"
      title="详情"
      width="800px"
      @close="closeDetailDialog">
      <analysis-detail
        :is-show="showDetailDialog"
        :currow="curRow" />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'
import { fetchStatisticinfo, fetchStatisticsauthorityinfos } from '@/api/dashboard.js'
import { parseTime } from '@/utils'
import api from '@/api/api'
import AnalysisDetail from './analysisDetail'
import common from '@/utils/common.js'
import { objArrRemovRep } from '@/utils/index'
export default {
    name: 'AnalysisList',
    components: {
        AnalysisDetail
    },
    data() {
        return {
            data: [],
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            range: [],
            type: 1, // 统计方式类型
            StartTime: '',
            EndTime: '',
            STATISTICSID: '',
            STATISTICSOptions: [], // 类型列表
            TypeOptions: [{ name: '日报表', id: 1 }, { name: '月报表', id: 3 }],
            tagList: [],
            showDetailDialog: false,
            curId: '',
            curRow: {}
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    async mounted() {
        await this.getStatisticInfo()
        this.getList()
    },
    methods: {
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getData() {
            const data = {
                'Condition': {
                    'StartTime': this.StartTime,
                    'EndTime': this.EndTime,
                    'QuoteType': this.type || 0,
                    'Statistics_ID': this.STATISTICSID || ''
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize
            }
            return data
        },
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            fetchStatisticinfo(data).then(res => {
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
        rangeChange(arr) {
            if (arr && arr.length) {
                this.StartTime = arr[0]
                this.EndTime = arr[1]
            } else {
                this.StartTime = ''
                this.EndTime = ''
            }
        },
        getStatisticInfo() {
            return fetchStatisticsauthorityinfos().then(res => {
                this.STATISTICSOptions = res || []
                if (this.STATISTICSOptions.length) {
                    this.STATISTICSID = this.STATISTICSOptions[0].ID || ''
                }
            })
        },
        resetForm() {
            this.STATISTICSID = ''
            this.type = ''
            this.range = []
        },
        handleAddRight(val) {
            if (val.length) {
                val.map(item => {
                    this.tagList.push({ id: 'RIGHT' + item.ID, name: item.Name, type: 'warning' })
                })
            }
            this.showRightDialog = false
        },
        gotoRuleList() {
            this.$router.push('/rule/ruleList')
        },
        openDetail(row, type) {
            this.showDetailDialog = true
            this.curRow = { ...row, type }
        },
        closeDetailDialog() {
            this.showDetailDialog = false
        },
        statistiIdChange() {
            this.pageindex = 1
            this.getList()
        },
        typeChange() {
            this.pageindex = 1
            this.StartTime = ''
            this.EndTime = ''
            this.range = null
            this.getList()
        }
    }
}
</script>
<style lang="scss" scoped>
.tips{
  margin-left: 10px;
  color: #666;
}
.views-search{
  margin-bottom: 5px !important;
}
.search-btns{
  padding-top: 20px !important;
}
.filter-item{
  margin-bottom: 15px;
  .label{
    display: inline-block;
    min-width: 80px;
    margin-left: 10px;
    text-align: right;
    &:first-child{
      margin-left: 0px;
    }
  }
  .el-input,.el-select{
    width: calc(100% - 80px);
  }
  .role-box{
    width: calc(100% - 280px);
    border: 1px solid #DBDDE5;
    height: 34px;
    border-radius: 4px;
    overflow-x: auto;
    display: flex;
    margin-right: 10px;

    // margin-right: 5px;
    .el-tag{
      margin-top: 4px;
      margin-right: 4px;
      margin-left: 0px;
      &:first-child{
        margin-left: 4px;
    }
    }
  }

}
/*修改滚动条样式*/
// div::-webkit-scrollbar{
//   width:10px;
//   height:2px;
//   /**/
// }
// div::-webkit-scrollbar-track{
//   background: rgb(239, 239, 239);
//   border-radius:2px;
// }
// div::-webkit-scrollbar-thumb{
//   background: #bfbfbf;
//   border-radius:10px;
// }
// div::-webkit-scrollbar-thumb:hover{
//   background: #333;
// }
// div::-webkit-scrollbar-corner{
//   background: #179a16;
// }
// .btn-box{
//   .el-button{
//     color: #1970FF;
//     border: #1970FF 1px solid;
//     padding: 10px 20px;
//     &:focus,&:hover{
//       color: #fff;
//     }
//   }
// }

</style>
