<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          class="filter-view">
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              style="margin-right:10px"
              placeholder="字段名称、字段标识"
              @keyup.enter.native="getList"/>
            <el-button
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div/>
      <div
        v-if="points.indexOf('ADD')>-1"
        class="search-btns">
        <el-button

          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增字段</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :height="(screenHeight-340)"
      :pageindex="pageindex"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="字段名称"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="EXTENDPARAMNAME"/>
      <el-table-column
        label="字段标识"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="EXTENDPARAMID"/>
      <el-table-column
        label="字段类型"
        show-overflow-tooltip
        header-align="center"
        width="80"
        align="center"
        prop="EXTENDPARAMTYPE">
        <template slot-scope="scope">
          {{ getTypeLabel(scope.row.EXTENDPARAMTYPE) }}
        </template>
      </el-table-column>
      <el-table-column
        label="校验规则"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="EXTENDPARAMRULE"/>
      <el-table-column
        label="枚举项"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="DETAIL">
        <template slot-scope="scope">
          {{ getEnums(scope.row.extendParamEnums) }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="修改"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('UPDATE')>-1"
                icon="iconguanli-bianji"
                @click.native="showUserInfo(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="gotoDelete(scope.row.EXTENDPARAMID)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAddDialog"
      :title="isEdit?'编辑字段':'新增字段'"
      width="600px"
      @close="closeAddDialog">
      <AddExt
        v-if="showAddDialog"
        :cur="curApp"
        :isedit="isEdit"
        @success="addSuccess"
        @close="closeAddDialog"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchQueryextendparam, fetchDelextendparam } from '@/api/admin'
import AddExt from './addExt'
import { setStorage, getStorage } from '@/utils/auth'
export default {
    name: 'ExtendList',
    components: { AddExt },
    data() {
        return {
            data: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showAddDialog: false,
            curApp: {},
            isEdit: false,
            extTypes: [{ id: 0, name: '普通' }, { id: 1, name: '枚举' }, { id: 2, name: '地区' }, { id: 3, name: '时间' }, { id: 4, name: '学校' }]
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
                    'ApplicationMark': '',
                    'Keyword': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': []
            }
            this.showLoading('.cs-table')
            fetchQueryextendparam(data).then(res => {
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
        gotoAdd() {
            this.showAddDialog = true
            this.isEdit = false
        },
        addSuccess() {
            this.getList()
            this.showAddDialog = false
        },
        showUserInfo(row) {
            this.showAddDialog = true
            this.curApp = row
            this.isEdit = true
        },
        closeAddDialog() {
            this.showAddDialog = false
        },
        gotoDelete(id) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchDelextendparam(id).then(res => {
                    if (res) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        getTypeLabel(v) {
            var f = this.extTypes.find(f => f.id === v)
            console.log('f:', f)
            return (f ? f.name : '')
        },
        getEnums(list) {
            var txt = ''
            var txts = list.map(m => { return m.EXTENDPARAMENUMKEY + '(' + m.EXTENDPARAMENUMVALUE + ')' })
            return txts.join(',')
        }
    }
}
</script>
