<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          class="filter-view">
          <!-- <el-col
            :span="6"
            class="filter-item">
            <el-button
              type="primary"
              @click="goBack">后退</el-button>
          </el-col> -->
          <el-col
            :span="6"
            :offset="18"
            class="filter-item">
            <el-input
              v-model="key"
              style="margin-right:10px"
              placeholder="请输入统计规则名称"
              @keyup.enter.native="handleSearch"/>
            <el-button
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
      </el-row></div>
      <div/>
      <div class="search-btns">
        <el-button
          @click="goBack">返回上一页</el-button>
        <el-button
          icon="iconfont iconxinzeng"
          @click="gotoAdd(null)">新增规则</el-button>
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
        label="统计规则名称"
        header-align="center"
        show-overflow-tooltip
        prop="STATISTICS_NAME"/>
      <el-table-column
        label="统计角色、权限"
        show-overflow-tooltip
        header-align="center"
        prop="AUTHORITY_LIST"/>
      <el-table-column
        label="规则描述"
        show-overflow-tooltip
        header-align="center"
        prop="DESC"/>
      <!-- <el-table-column
        label="状态"
        show-overflow-tooltip
        align="center"
        prop="AUTHORITY_LIST">
        <template slot-scope="{row}">
          {{ statusMap[row.IS_DISABLED] }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="编辑"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconguanli-bianji"
                @click.native="gotoAdd(scope.row.ID)"/>
            </el-tooltip>
            <!-- <el-tooltip
              content="禁用"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconjinyong"
                @click.native="updateRow(scope.row,'禁用')"/>
            </el-tooltip> -->
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshanchu"
                @click.native="updateRow(scope.row,'删除')"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { querystatisticsauthorityinfosdata, updatestatisticsauthoritystatus } from '@/api/dashboard'
import { getStorage } from '@/utils/auth'
import AddManager from './addRule'
export default {
    name: 'RuleList',
    components: { AddManager },
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showInfo: false,
            curUserid: '',
            statusOption: [{ name: '禁用', id: 1 }, { name: '正常', id: 0 }, { name: '删除', id: 2 }]
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        }),
        statusMap() {
            const obj = {}
            this.statusOption.map(item => {
                obj[item.id] = item.name
            })
            return obj
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        closeInfo() {
            this.showInfo = false
        },
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'Keyword': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize
            }
            this.showLoading('.cs-table')
            querystatisticsauthorityinfosdata(data).then(res => {
                this.data = res.Data || []
                this.total = res.Total || 0
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
        gotoAdd(id) {
            if (id) {
                this.$router.push({ path: '/rule/addRule', query: { id }})
            } else {
                this.$router.push({ path: '/rule/addRule' })
            }
        },
        showDetail(id) {
            this.curUserid = id
            this.showInfo = true
        },
        updateRow(row, option) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作对当前记录进行' + option + ', 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                updatestatisticsauthoritystatus({ ID: row.ID, IS_DISABLED: option === '删除' ? 2 : 1 }).then(res => {
                    if (res) {
                        this.$message({
                            type: 'success',
                            message: option + '成功!'
                        })
                        this.getList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: option + '失败!'
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消' + option
                })
            })
        }
    }
}
</script>
