<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="info">当前时间 <span style="font-weight:bold;margin-right:15px">{{ currow.MONTHDAY }} </span>{{ getText(currow.type) }}：{{ page.total }}</div>
      </el-col>
      <el-col
        :span="8"
        :offset="4">
        <div class="form-search">
          <div
            class="filter-item">
            <el-input
              v-model="search.keyWord"
              placeholder="关键字查询"
              class="input-with-select" >
              <el-button
                slot="append"
                type="primary"
                icon="el-icon-search"
                @click="getList"/>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>

    <cs-table
      ref="analysisDetail"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :height="440"
      hasselection
      haspage
      @pageChange="pageChange">
      <!-- <el-table-column
        label="序号"
        min-width="60">
        <template slot-scope="scope">
          <span>{{ (page.current - 1) * page.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="账号"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="用户名"
        show-overflow-tooltip
        min-width="80"
        prop="USER_NAME"/>
      <el-table-column
        label="产品名称"
        show-overflow-tooltip
        prop="APPLICATION_NAME"/>
      <el-table-column
        label="手机号"
        prop="USER_TELEPHONE"/>
      <el-table-column
        label="开通时间"
        prop="BEGIN_TIME"/>
      <el-table-column
        label="到期时间"
        prop="END_TIME"/>
    </cs-table>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchStatisticdetails } from '@/api/dashboard.js'

export default {
    name: 'AnalysisDetail',
    props: {
        currow: {
            type: Object,
            default: () => {}
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keyWord: '',
                daterange: []
            },
            table: {
                data: [],
                selections: []
            },
            form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            }
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
        isShow(n) {
            if (n) {
                this.getList()
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            const data = this.getData()
            fetchStatisticdetails(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
            })
        },
        getData() {
            const data = {
                Condition: {
                    'STATISTICS_ID': this.currow.TEX_HOUSE_STATISTICS_ID,
                    'QuoteType': this.currow.QUOTE_TYPE, // 统计方式
                    'userType': this.currow.type,
                    'STATISTICS_DATETIME': this.currow.MONTHDAY, // 有效期
                    'Keyword': this.search.keyWord
                },
                PageIndex: this.page.current,
                PageSize: this.page.size
            }
            return data
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        },
        getText(key) {
            if (key == 0) {
                return '新增用户'
            } else if (key == 1) {
                return '到期用户'
            } else if (key == 2) {
                return '缴费用户'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.info{
  padding-bottom: 10px;
  line-height: 30px;
}
.form-search{
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  .filter-item{
    display: flex;
    flex-direction: row;
    .label{
      line-height: 36px;
      padding: 0 4px;
      width: 50px;
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
