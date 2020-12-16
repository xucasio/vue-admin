<template>
  <div class="views-content">
    <div

      class="views-search">
      <div
        v-if="points.indexOf('SELECT')>-1"
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索权限标识、权限ID、权限类型、权限名称"
          class="input-with-select"
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
          @click="openAdd">新增默认权限</el-button>
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
        label="权限标识"
        width="150"
        show-overflow-tooltip
        header-align="center"
        prop="Mark"/>
      <el-table-column
        label="权限ID"
        width="120"
        header-align="center"
        prop="AUTHORITY_ID"/>
      <el-table-column
        label="权限类型"
        align="center"
        width="100"
        header-align="center"
        prop="AuthTypeStr"/>
      <el-table-column
        label="权限名称"
        header-align="center"
        prop="Name"/>
      <el-table-column
        align="center"
        min-width="220"
        label="有效期" >
        <template slot-scope="scope">
          {{ scope.row.START_TIME +' 至 '+scope.row.END_TIME }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="120"
        label="权限值" >
        <template slot-scope="{row}">
          {{ showRoleVal(row.AuthValue, row.AuthorityType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="产品标识"
        width="120"
        show-overflow-tooltip
        header-align="center"
        prop="Name">
        <template slot-scope="{row}">
          {{ row.ApplicationName+' ['+row.ApplicationMark+']' }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        header-align="center"
        width="100"
        prop="logiN_NAME">
        <template slot-scope="{row}">
          <div class="table-manage">
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="handleDel(row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="dialog.showAuthDialog"
      :append-to-body="false"
      width="800px"
      title="添加权限"
      @close="dialog.showAuthDialog=false">
      <UserRightList
        :selections="dialog.selections"
        :hasdate="!isBuser()"
        :hastypedata="!isBuser()"
        :hasadmintype="isSuper()"
        @close="dialog.showAuthDialog=false"
        @add="handleAddAuth"/>
    </cs-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchDefaultAuthlist, addAdminDefaultAuth, deleteDefaultAuth } from '@/api/role.js'
import { getStorage } from '@/utils/auth.js'
import UserRightList from '@/views/Admin/RoleManager/components/rightList'
export default {
    name: 'AuthSet',
    components: {
        UserRightList
    },
    data() {
        return {
            search: {
                keyWord: ''
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
            dialog: {
                showAuthDialog: false,
                selections: []
            }
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
        // B端管理员不需要设置有效期
        isBuser() {
            return +getStorage('TYPEID') === 4
        },
        // 超级和系统管理员需要选择产品
        isSuper() {
            return +getStorage('TYPEID') === 0 || +getStorage('TYPEID') === 1
        },
        handleSearch() {
            this.page.current = 1
            this.getList()
        },
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            fetchDefaultAuthlist(data).then(res => {
                this.table.data = res.Data || []
                // this.table.data = [{}]
                this.page.total = res.Total || 0
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
                this.hideLoading()
            }).catch(ex => {
                this.hideLoading()
            })
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    'conditionValue': this.search.keyWord,
                    'IsOverdue': true
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
        openAdd() {
            this.dialog.showAuthDialog = true
        },
        // 新增设置弹窗确认
        handleAddAuth(selections, dt, markObj, typeInfoId) {
            this.dialog.showAuthDialog = false
            let ListAdminDefaultAuth = []
            if (!this.isBuser()) {
                ListAdminDefaultAuth = selections.map(i => {
                    return { AuthorityID: i.AUTHORITY_ID, StartTime: dt[0], EndTime: dt[1], Value: markObj }
                })
            } else {
                ListAdminDefaultAuth = selections.map(i => {
                    return { AuthorityID: i.AUTHORITY_ID, StartTime: dt[0], EndTime: dt[1],
                        Value: i.AuthValue ? JSON.parse(i.AuthValue) : null }
                })
            }
            addAdminDefaultAuth({ ListAdminDefaultAuth, AdminTypeInfoID: this.isSuper() ? typeInfoId : getStorage('PTYPEID') }).then(res => {
                this.$message.success('新增成功')
                this.getList()
            })
        },
        handleDel(row) {
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 是否删除${row.Name}默认权限?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleteDefaultAuth(row.Primarykey).then(res => {
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
        showRoleVal(Val, type) {
            const obj = JSON.parse(Val) || {}
            if (type === 1) {
                return obj.BooleanValue
            } else if (type === 2) {
                return (obj.DataRangStart || '') + '-' + (obj.DataRangEnd || '')
            } else if (type === 3) {
                return obj.IntValue
            } else if (type === 4) {
                return '-'
            }
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
