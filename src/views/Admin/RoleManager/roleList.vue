<template>
  <div class="views-content">
    <div
      class="views-search">
      <div
        v-if="points.indexOf('SELECT')>-1"
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.KeyWords"
          placeholder="请搜索角色ID、角色名称、角色描述"
          @keyup.enter.native="handleSearch">
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"/>
        </el-input>
      </div>
      <div class="search-btns">
        <el-button
          v-if="points.indexOf('ADD')>-1"
          icon="iconfont iconxinzeng"
          @click="gotoAdd()">新增角色</el-button>
        <el-button
          icon="iconfont iconpiliangxinzeng"
          @click="importData">批量导入</el-button>
        <el-button
          icon="iconfont icondaochu"
          @click="exportData">导出</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :height="(screenHeight-330)"
      hasindex
      haspage
      @pageChange="pageChange">

      <el-table-column
        label="角色ID"
        show-overflow-tooltip
        min-width="80"
        header-align="center"
        prop="ROLE_ID"/>
      <el-table-column
        label="角色名称"
        header-align="center"
        prop="ROLE_NAME"/>
      <el-table-column
        label="角色描述"
        header-align="center"
        prop="DESCRIPTION"/>
      <el-table-column
        label="角色归属"
        header-align="center"
        show-overflow-tooltip
        prop="">
        <template slot-scope="scope">
          {{ getRoleText(scope.row.admintypeinfoList) }}
        </template>
      </el-table-column>
      <el-table-column
        label="角色详情"
        align="center"
        width="100"
        prop="">
        <template slot-scope="{row}">
          <a
            class="td-link"
            @click="showAuthList(row)">查看</a>
      </template></el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        header-align="center"
        width="100"
        align="center"
        prop="logiN_NAME">
        <template slot-scope="{row}">
          <div class="table-manage">
            <el-tooltip
              content="编辑"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('UPDATE')>-1"
                icon="iconguanli-bianji"
                @click.native="gotoAdd(row.ROLE_ID)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="delRole(row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <el-drawer
      :visible.sync="showAuthDialog"
      :with-header="false"
      :show-close="false"
    >
      <RoleAuths
        :auths="curAuths"
        :rolers="curRolers"
        :title="curTitle"
        @close="closeAuthDialog"/>
    </el-drawer>
    <cs-dialog
      :show="showAllImport"
      width="500px"
      height="300px"
      title="批量导入"
      @close="closeImportDialog">
      <ImportDialog
        @close="closeImportDialog"
        @success="importSuccess"/>
    </cs-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchRoleList, deleterole, getRoleAuths } from '@/api/role.js'
import RoleAuths from './components/roleAuths'
import ImportDialog from './components/importDialog'
import { getStorage } from '@/utils/auth'
import api from '@/api/api'
import common from '@/utils/common'
export default {
    name: 'RoleList',
    components: {
        RoleAuths,
        ImportDialog
    },
    data() {
        return {
            search: {
                KeyWords: ''
            },
            table: {
                data: []
            },
            form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            showAuthDialog: false,
            curAuths: [],
            curRolers: [],
            curTitle: '',
            showAllImport: false // 批量导入弹窗
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
            this.page.current = 1
            this.getList()
        },
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            fetchRoleList(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
                this.hideLoading()
            }).catch(ex => {
                this.hideLoading()
            })
        },
        getRoleText(typeList) {
            return typeList.map(m => {
                return m.CUSTOMER_NAME
            }).join(',')
        },
        gotoAdd(id) {
            this.$router.push({ path: '/role/addRole', query: { id: id }})
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    // 'adminTypeInfoID': 1, // 后台要求固定
                    'KeyWords': this.search.KeyWords,
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0
                },
                pageIndex: this.page.current,
                pageSize: this.page.size

            }
            return data
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        },
        delRole(row) {
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 是否删除${row.ROLE_NAME}角色?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleterole(row.ROLE_ID).then(res => {
                    this.$message.success('删除成功')
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        showAuthList(row) {
            this.curRolers = row.admintypeinfoList || []
            this.curTitle = row.ROLE_NAME
            getRoleAuths({ RoleId: row.ROLE_ID }).then(res => {
                this.curAuths = res || []
                this.showAuthDialog = true
            })
        },
        closeAuthDialog() {
            this.showAuthDialog = false
        },
        importData() {
            this.showAllImport = true
        },
        closeImportDialog() {
            this.showAllImport = false
        },
        exportData() {
            const Token = getStorage('TOKEN')
            const typeid = getStorage('TYPEID')
            const typeinfoid = getStorage('PTYPEID')
            const conditionStr = '?token=' + Token + '&typeid=' + typeid + '&typeinfoid=' + typeinfoid + '&PageIndex=' + this.page.current + '&PageSize=' + this.page.size
            var url = api.upmshost + 'api/Role/exportrolelist' + conditionStr
            Object.keys(this.search).forEach(m => {
                if (m === 'roles') {
                    var urlStr = ''
                    this.search[m].forEach(e => {
                        urlStr += '&Condition.' + m + '=' + e
                    })
                    url += urlStr
                } else {
                    url += ('&Condition.' + m + '=' + this.search[m])
                }
            })
            common.downLoadFile(url, '角色列表.xlsx')

            // fetchUserExport(this.getData()).then(res => {
            //     common.base64ToFile(res, '用户列表.xlsx')
            // })
        },
        importSuccess() {
            this.page.current = 1
            this.showAllImport = false
            this.getList()
        }
    }
}
</script>
<style lang="scss" scoped>
.filter-item{
  display: flex;
  flex-direction: row;
  .el-button{
    background-color:  $--color-main;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #fff;
    padding: 11px 20px;
  }
}
</style>
