<template>
  <div class="user-role-list">
    <div class="views-search">
      <el-row
        :gutter="20"
        class="filter-view">
        <el-col
          :span="24"
          style="justify-content: flex-start;height:auto"
          class="filter-item">
          <span style="width:100px;flex-shrink:0"> 当前标签:</span>
          <div style="height:auto;max-height:60px">
            {{ labels.map(m=>{return m.LABEL_NAME}).join(';') }}
            <!-- <el-tag
              v-for="lab in labels"
              :key="lab.LABEL_ID" >
              {{ lab.LABEL_NAME }}
            </el-tag> -->
          </div>

        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="filter-view">
        <el-col
          :span="24"
          style="justify-content: flex-start;"
          class="filter-item">
          成员数量：{{ total }}
        </el-col>
      </el-row>
    </div>
    <el-row class="role-table">
      <cs-table
        :data="data"
        :total="total"
        :pagesize="pagesize"
        :pageindex="pageindex"
        :height="400"
        haspage
        hasindex
        @pageChange="pageChange">
        <el-table-column
          label="账号"
          show-overflow-tooltip
          width="150"
          header-align="center"
          prop="LoginName"/>
        <el-table-column
          label="姓名"
          width="150"
          header-align="center"
          show-overflow-tooltip
          prop="UserName"/>
        <el-table-column
          label="手机号"
          width="150"
          header-align="center"
          show-overflow-tooltip
          prop="MobilePhone"/>
        <el-table-column
          label="联系邮箱"
          width="150"
          header-align="center"
          show-overflow-tooltip
          prop="Email"/>
        <el-table-column
          label="学校/公司名称"
          width="200"
          header-align="center"
          show-overflow-tooltip
          prop="Company"/>
        <el-table-column
          header-align="center"
          label="用户状态"
          width="80"
          align="center"
          prop="Name">
          <template slot-scope="scope">
            <span :class="['font-color', 'state'+scope.row.State]"> {{ labelState(scope.row.State) }}</span>

          </template>
        </el-table-column>

      </cs-table>
    </el-row>
  </div>
</template>
<script>
import { fetchLabelQueryLabeluser } from '@/api/label.js'
export default {
    name: 'StudentList',
    props: {
        labels: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            search: {
                beginTime: '',
                endTime: ''
            },
            data: [],
            total: 0,
            pagesize: 10,
            pageindex: 1,
            keyWord: '',
            selectRow: []

        }
    },
    mounted() {
        this.getList()
        console.log(this.labels)
    },
    methods: {
        getList() {
            const data = {
                'condition': {
                    'LabelIDs': this.labels.map(m => {
                        return m.LABEL_ID
                    })
                },
                'pageIndex': this.pageindex,
                'pageSize': this.pagesize,
                'acsFiles': [],
                'descFiles': []
            }
            fetchLabelQueryLabeluser(data).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },

        closeDialog() {
            this.$emit('close')
        },
        handleSearch() {
            this.pagesize = 10
            this.pageindex = 1
            this.getList()
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        handleSelectionChange(row) {
            this.selectRow = row
        },
        labelState(v) {
            console.log('vvvv:', v)
            var list = ['', '正常', '禁用', '未激活', '已删除']
            console.log('vvvv:', list[1])
            return list[v]
        }
    }
}
</script>
<style lang="scss">
.user-role-list{

}
</style>
