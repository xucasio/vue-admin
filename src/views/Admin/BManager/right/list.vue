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
              placeholder="权限名称，产品名称"/>
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
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      :height="(screenHeight-285)"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="权限名称"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="Name"/>
      <el-table-column
        label="产品名称"
        header-align="center"
        min-width="100"
        show-overflow-tooltip
        prop="ApplicationName"/>
      <!-- <el-table-column
        label="归属平台"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="LABEL_MARK"/> -->
      <el-table-column
        label="开通日期"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="START_TIME"/>
      <el-table-column
        label="到期日期"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="END_TIME"/>
        <!-- <el-table-column
        label="管理"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <a
            v-if="scope.row.STATE===2"
            class="td-link"
            @click="handleCreate(scope.row)">续期</a>
        </template>
      </el-table-column> -->
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchUserRightList } from '@/api/user.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'BRightList',
    components: { },
    data() {
        return {
            key: '',
            data: [],
            curLabels: [],
            total: 0,
            pagesize: 10,
            pageindex: 1,
            curLabel: {}
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
            const data = {
                'condition': {
                    adminTypeInfoID: getStorage('PTYPEID'),
                    toKen: getStorage('TOKEN'),
                    'conditionValue': this.key
                },
                'pageIndex': this.pageindex,
                'pageSize': this.pagesize,
                'acsFiles': [],
                'descFiles': []
            }
            fetchUserRightList(data).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        }

    }
}
</script>
