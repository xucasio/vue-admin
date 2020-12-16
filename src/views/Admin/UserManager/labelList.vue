<template>
  <div class="user-label-list">
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
            placeholder="请输入标签名称、标签描述"
            @search="handleSearch"/>
        </el-col>
      </el-row>
    </div>
    <el-row class="label-table">
      <cs-table
        ref="labelList"
        :data="data"
        :total="total"
        :pagesize="pagesize"
        :pageindex="pageindex"
        :height="(screenHeight-340)"
        haspage
        hasindex
        hasselection
        @selection-change="handleSelectionChange"
        @pageChange="pageChange">
        <el-table-column
          label="标签名称"
          header-align="center"
          show-overflow-tooltip
          prop="LABEL_NAME"/>
        <el-table-column
          label="权限范围"
          header-align="center"
          show-overflow-tooltip
          prop="LABEL_AUTHS_STRING"/>
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
        <el-table-column
          label="标签描述"
          header-align="center"
          show-overflow-tooltip
          prop="LABEL_DESCRIBE"/>
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
import { mapState } from 'vuex'
import { fetchLabelList } from '@/api/user.js'
// import common from '@/utils/common.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'UserLabelList',
    props: {
        isShow: {
            type: Boolean,
            default: false
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
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    watch: {
        isShow(n) {
            if (n) {
                this.$nextTick(() => {
                    this.$refs['labelList'].clearSelection()
                    this.search.beginTime = ''
                    this.search.endTime = ''
                    this.keyWord = ''
                    this.selectRow = []
                })
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            const data = {
                'Condition': {
                    'ConditionValue': this.keyWord,
                    'AdminTypeInfoID': getStorage('PTYPEID')
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [],
                'DescFiles': []
            }
            fetchLabelList(data).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },
        getRoleText(typeList) {
            return typeList.map(m => {
                return m.ADMIN_TYPE_INFO_NAME
            }).join(',')
        },
        add() {
            if (this.selectRow.length <= 0) {
                this.$message.error('请选择标签')
                return
            }

            this.$emit('add', this.selectRow, this.search)
        },
        closeDialog() {
            this.$emit('close')
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
        },
        labelState(v) {
            var list = ['', '禁用', '激活', '待激活', '删除']
            return list[v]
        }
    }
}
</script>
<style lang="scss">
.user-role-list{

}
</style>
