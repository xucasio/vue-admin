<template>
  <div class="label-list">
    <div class="views-search">
      <el-row
        :gutter="20"
        class="filter-view">
        <el-col
          style="justify-content: flex-end;"
          class="filter-item">
          <cs-key-search
            :prepend="false"
            v-model="keyWord"
            placeholder="请输入关键字"
            @search="handleSearch"/>
        </el-col>
      </el-row>
    </div>
    <el-row class="label-table">
      <cs-table
        :data="data"
        :total="total"
        :pagesize="pagesize"
        :pageindex="pageindex"
        height="442"
        haspage
        hasindex
        hasselection
        @selection-change="handleSelectionChange"
        @pageChange="pageChange">
        <el-table-column
          label="标签名称"
          min-width="100"
          header-align="center"
          show-overflow-tooltip
          prop="LABEL_NAME"/>
        <el-table-column
          label="权限范围"
          header-align="center"
          min-width="100"
          show-overflow-tooltip
          prop="LABEL_AUTHS_STRING"/>
        <el-table-column
          label="描述"
          show-overflow-tooltip
          header-align="center"
          min-width="100"
          prop="LABEL_DESCRIBE"/>
        <el-table-column
          label="状态"
          width="100"
          align="center"
          show-overflow-tooltip
          header-align="center"
          prop="STATE">
          <template slot-scope="scope">
            <span :class="['font-color-label', 'state'+scope.row.STATE]"> {{ labelState(scope.row.STATE) }}</span>
          </template>
        </el-table-column>
      </cs-table>
    </el-row>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">添加</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { fetchLabelList } from '@/api/label.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'LabelList',
    props: {
        hasdate: {
            type: Boolean,
            default: true
        },
        allownull: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
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
    },
    methods: {
        getList() {
            const data = {
                'Condition': {
                    'AdminTypeInfoID': getStorage('PTYPEID'),
                    'ConditionValue': this.keyWord
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            fetchLabelList(data).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },
        add() {
            this.$emit('add', this.selectRow)
        },
        closeDialog() {
            this.$emit('close')
        },
        labelState(v) {
            var list = ['', '禁用', '激活', '待激活', '删除']
            return list[v]
        },
        handleSearch() {
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
        }
    }
}
</script>
<style lang="scss">
.label-list{

}
</style>
