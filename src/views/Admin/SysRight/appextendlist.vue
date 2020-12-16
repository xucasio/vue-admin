<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="search-btns"
        style="    font-weight: bold;    font-size: 16px;">
        当前产品：{{ appName }}
      </div>
      <div
        class="search-btns">
        <el-button
          icon="iconfont iconxinzeng"
          @click="gotoAdd">添加字段</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      haspage
      size="mini"
      @pageChange="pageChange">
      <el-table-column
        label="字段名称"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="EXTENDPARAMNAME">
        <template slot-scope="scope">
          {{ scope.row.ExtendParamInfo.EXTENDPARAMNAME }}
        </template>
      </el-table-column>
      <el-table-column
        label="字段标识"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="EXTENDPARAMID">
        <template slot-scope="scope">
          {{ scope.row.ExtendParamInfo.EXTENDPARAMID }}
        </template>
      </el-table-column>
      <el-table-column
        label="字段类型"
        show-overflow-tooltip
        header-align="center"
        width="80"
        align="center"
        prop="EXTENDPARAMTYPE">
        <template slot-scope="scope">
          {{ getTypeLabel(scope.row.ExtendParamInfo.EXTENDPARAMTYPE) }}
        </template>
      </el-table-column>
      <el-table-column
        label="校验规则"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="EXTENDPARAMRULE">
        <template slot-scope="scope">
          {{ scope.row.ExtendParamInfo.EXTENDPARAMRULE }}
        </template>
      </el-table-column>
      <el-table-column
        label="枚举项"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="extendParamEnums">
        <template slot-scope="scope">
          {{ getEnums(scope.row.ExtendParamInfo.extendParamEnums) }}
        </template>
      </el-table-column>
      <el-table-column
        label="是否允许为空"
        show-overflow-tooltip
        header-align="center"
        width="120"
        align="center"
        prop="DETAIL">
        <template slot-scope="scope">
          {{ scope.row.ISNULL?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="是否校验规则"
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="120"
        prop="DETAIL">
        <template slot-scope="scope">
          {{ scope.row.ISRULE?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        width="100" >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="修改"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconguanli-bianji"
                @click.native="showExtInfo(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshanchu"
                @click.native="gotoDelete(scope.row.APPLICAITONMARK,scope.row.ExtendParamInfo.EXTENDPARAMID)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAddDialog"
      width="860px"
      title="添加字段"
      @close="closeAddDialog">
      <AddAppExt
        v-if="showAddDialog"
        :isedit="isEdit"
        @success="addSuccess"
        @close="closeAddDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="updateShowDialog"
      width="600px"
      title="修改产品字段信息"
      @close="closeUpdateDialog">
      <UpdateExt
        v-if="updateShowDialog"
        :extid="curExtid"
        :cur="curRxt"
        @success="updateSuccess"
        @close="closeUpdateDialog"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchAppExtList, fetchDelAppExt } from '@/api/admin'
import UpdateExt from './updateAppExtend'
import AddAppExt from './addAppExtend'

import { setStorage, getStorage } from '@/utils/auth'
import common from '@/utils/common'
export default {
    name: 'ExtendList',
    components: { UpdateExt, AddAppExt },
    data() {
        return {
            updateShowDialog: false,
            data: [],
            curExtid: '',
            appName: '',
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showAddDialog: false,
            curRxt: {},
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
        this.appName = common.getUrlKey('appname')
        console.log('this.$router:', this.$router)
    },
    methods: {
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'ApplicationMark': common.getUrlKey('appid')
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': []
            }
            this.showLoading('.cs-table')
            fetchAppExtList(data).then(res => {
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
        updateSuccess() {
            this.getList()
            this.updateShowDialog = false
        },
        showExtInfo(row) {
            this.updateShowDialog = true
            this.isEdit = true
            this.curExtid = row.ExtendParamInfo.EXTENDPARAMID
            this.curRxt = row
        },
        closeAddDialog() {
            this.showAddDialog = false
        },
        closeUpdateDialog() {
            this.updateShowDialog = false
        },
        gotoDelete(id, eid) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchDelAppExt({ APPLICAITONMARK: id, EXTENDPARAMID: eid }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getList()
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
