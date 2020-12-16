<template>
  <div class="views-content">
    <div
      class="views-search"
      style="padding-bottom:10px">
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
              placeholder="字段名称、字段标识"
              @keyup.enter.native="getList"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-button
              type="primary"
              size="medium"
              @click="handleSearch">查询</el-button>
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
      haspage
      hasindex
      hasselection
      @selection-change="handleSelectionChange"
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
        label="允许为空"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="100"
        prop="DETAIL">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.ISNULL"/>
        </template>
      </el-table-column>
      <el-table-column
        label="校验规则"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        align="center"
        prop="DETAIL">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.ISRULE"/>
        </template>
      </el-table-column>
    </cs-table>
    <div style="text-align:right" > <el-button
      type="primary"
      @click="submitForm()">确定</el-button>
    <el-button @click="cancel">取消</el-button></div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchQueryextendparam, fetchAddAppExt } from '@/api/admin'
import AddExt from './addExt'
import { setStorage, getStorage } from '@/utils/auth'
import common from '@/utils/common'
export default {
    name: 'ExtendList',
    components: { AddExt },
    data() {
        return {
            data: [],
            checkedExt: [],
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
                    'ApplicationMark': common.getUrlKey('appid'),
                    'KeyWords': this.key
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
        getTypeLabel(v) {
            var f = this.extTypes.find(f => f.id === v)
            console.log('f:', f)
            return (f ? f.name : '')
        },
        getEnums(list) {
            var txt = ''
            var txts = list.map(m => { return m.EXTENDPARAMENUMKEY + '(' + m.EXTENDPARAMENUMVALUE + ')' })
            return txts.join(',')
        },
        handleSelectionChange(val) {
            this.checkedExt = val
        },
        cancel() {
            this.$emit('close')
        },
        submitForm() {
            var data = this.checkedExt.map(m => {
                return {
                    'ISNULL': m.ISNULL,
                    'ISRULE': m.ISRULE,
                    'EXTENDPARAMID': m.EXTENDPARAMID
                }
            })
            if (!data || data.length <= 0) {
                this.$message.error('请选择字段')
                return
            }
            fetchAddAppExt({ ListApplicaitonExtend: data, APPLICAITONMARK: common.getUrlKey('appid') }).then(res => {
                this.$message.success('新增成功')
                this.$emit('success')
            }).catch(error => {
                this.$message.error(error || '新增失败')
            })
        }
    }
}
</script>
