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
              placeholder="请搜索产品名称、产品标识、描述 "
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
          @click="gotoAdd">新增产品</el-button>
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
        label="产品名称"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="NAME"/>
      <el-table-column
        label="产品标识"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="APPLICATION_MARK"/>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="DETAIL"/>
      <el-table-column
        label="扩展字段"
        show-overflow-tooltip
        header-align="center"
        width="80"
        align="center"
        prop="DETAIL">
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="showExtendInfo(scope.row.APPLICATION_MARK,scope.row.NAME)">详情</a>
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
                @click.native="gotoDelete(scope.row.APPLICATION_ID)"/>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAddDialog"
      width="600px"
      title="新增产品"
      @close="closeAddDialog">
      <AddApp
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
import { Admins } from '@/utils/basedata'
import { fetchAppList, fetchAppDel } from '@/api/admin'
import AddApp from './addApp'
export default {
    name: 'ProductList',
    components: { AddApp },
    data() {
        return {
            data: [],
            Admins: Admins,
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showAddDialog: false,
            curApp: {},
            isEdit: false
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
                    // 'AdminTypeId': this.adminType,
                    'KeyWords': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            this.showLoading('.cs-table')
            fetchAppList(data).then(res => {
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
        showExtendInfo(appid, appname) {
            this.$router.push({ path: '/sysright/appextendlist', query: { appid, appname }})
        },
        gotoDelete(id) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchAppDel(id).then(res => {
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
        }
    }
}
</script>
