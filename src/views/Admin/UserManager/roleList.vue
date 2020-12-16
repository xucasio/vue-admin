<template>
  <div class="user-role-list">
    <div class="views-search">
      <el-row
        class="filter-view">
        <el-col
          v-if="hasdate"
          :span="14"
          class="filter-item">
          <span class="fiter-item-title left">有效期</span>
          <div class="fiter-item-input">
            <el-date-picker
              v-model="search.beginTime"
              value-format="yyyy-MM-dd"
              style="width:150px"
              format="yyyy-MM-dd"/>
            <span class="diff">至</span>
            <el-date-picker
              v-model="search.endTime"
              value-format="yyyy-MM-dd"
              style="width:150px"
              format="yyyy-MM-dd"
            />
          </div>
        </el-col>
        <el-col
          :span="hasdate?10:24"
          style="justify-content: flex-end;padding-right:20px"
          class="filter-item">
          <cs-key-search
            :prepend="false"
            v-model="keyWord"
            placeholder="请输入关键字"
            @search="handleSearch"/>
        </el-col>
      </el-row>
    </div>
    <el-row class="role-table">
      <cs-table
        ref="roleList"
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
          label="角色ID"
          header-align="center"
          width="150"
          prop="ROLE_ID"/>
        <!-- <el-table-column
          label="所属平台"
          prop="ID"/> -->
        <el-table-column
          label="角色名称"
          header-align="center"
          show-overflow-tooltip
          prop="ROLE_NAME"/>
        <el-table-column
          label="角色归属"
          header-align="center"
          show-overflow-tooltip
          prop="">
          <template slot-scope="scope">
            {{ getRoleText(scope.row.admintypeinfoList) }}
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
import { fetchRoleList } from '@/api/user.js'
import common from '@/utils/common.js'
export default {
    name: 'UserRoleList',
    props: {
        hasdate: {
            type: Boolean,
            default: true
        },
        isShow: {
            type: Boolean,
            default: false
        },
        allownull: {
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
    watch: {
        isShow(n) {
            if (n) {
                this.$nextTick(() => {
                    this.$refs['roleList'].clearSelection()
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
                'condition': {
                    'keyWords': this.keyWord
                },
                'pageIndex': this.pageindex,
                'pageSize': this.pagesize,
                'acsFiles': [],
                'descFiles': []
            }
            fetchRoleList(data).then(res => {
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
            if (this.selectRow.length <= 0 && !this.allownull) {
                this.$message.error('请选择角色')
                return
            }
            if (this.hasdate) {
                if (!this.search.beginTime || !this.search.endTime) {
                    this.$message.error('请填写有效期')
                    return
                }
                if (!common.compareDate(this.search.beginTime, this.search.endTime)) {
                    this.$message.error('开始时间不能大于结束时间')
                    return
                }
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
        }
    }
}
</script>
<style lang="scss">
.user-role-list{

}
</style>
