<template>
  <div>
    <div class="views-search">
      <div
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="keyWord"
          placeholder="请搜索产品标识、权限ID、权限类型、权限名称"
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
          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增平台管理员权限</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="list"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      :height="(screenHeight-410)"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="产品标识"
        show-overflow-tooltip
        header-align="center"
        prop="Mark"/>
      <el-table-column
        label="权限ID"
        header-align="center"
        prop="AUTHORITY_ID"/>
      <el-table-column
        label="权限类型"
        header-align="center"
        prop="AuthTypeStr"/>
      <el-table-column
        label="权限名称"
        header-align="center"
        prop="Name"/>
      <el-table-column
        label="权限值"
        align="center"
        prop="Name">
        <template slot-scope="{row}">
          {{ showRoleVal(row) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="220"
        label="有效期" >
        <template slot-scope="scope">
          {{ scope.row.START_TIME +' 至 '+scope.row.END_TIME }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        align="center"
        header-align="center"
        width="100"
        prop="logiN_NAME">
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="handleDel(scope.row)">删除</a>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAuthDialog"
      :append-to-body="false"
      title="添加权限"
      @close="showAuthDialog=false">
      <UserRightList
        :is-show="showAuthDialog"
        :hastypedata="true"
        @close="showAuthDialog=false"
        @add="handleAddAuth"/>
    </cs-dialog>
  </div>

</template>
<script>
import { mapState } from 'vuex'
import { fetchAuthList, fetchUserSetBUserRight, fetchUserDeleteBUserRight } from '@/api/role'
import UserRightList from '@/views/Admin/RoleManager/components/rightList'
export default {
    name: 'PlatAuthList',
    components: {
        UserRightList
    },
    data() {
        return {
            activeName: 'first',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            keyWord: '',
            list: [],
            showAuthDialog: false,
            AdminTypeInfoId: 1 // 平台管理员固定
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    created() {
        this.getList()
    },
    methods: {
        handleSearch() {
            this.pageIndex = 1
            this.getList()
        },
        pageChange(size, index) {
            this.pageindex = index
            this.pagesize = size
            this.getList()
        },
        getList() {
            var data = this.getData()
            fetchAuthList(data).then(res => {
                this.list = res.Data
                this.total = res.Total
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
            }).catch(ex => {
                this.$message.error(ex.message)
            })
        },
        getData() {
            var data = {
                condition: {
                    'adminTypeInfoID': this.AdminTypeInfoId, // 暂时写固定
                    'conditionValue': this.keyWord,
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0,
                    'IsOverdue': true
                },
                pageIndex: this.pageindex,
                pageSize: this.pagesize,
                'acsFiles': [
                ],
                'descFiles': [
                ]

            }
            return data
        },
        gotoAdd() {
            this.showAuthDialog = true
        },
        // 弹窗确认
        handleAddAuth(selections, daterange, Value) {
            this.showAuthDialog = false
            var data = {
                'AdminTypeInfoId': this.AdminTypeInfoId,
                'rights': selections.map(m => {
                    return {
                        ID: m.ID,
                        Name: m.Name,
                        BeginTime: daterange[0],
                        EndTime: daterange[1],
                        Value
                    }
                })
            }
            fetchUserSetBUserRight(data).then(res => {
                if (res.Value && res.Value.length > 0) {
                    let warnStr = ''
                    res.Value.map((id, index) => {
                        const obj = selections.find(item => {
                            return item.ID === +id
                        })
                        if (obj) {
                            warnStr += `<font color="#1970FF">${obj.Name}</font>`
                            if (index < (res.Value.length - 1)) {
                                warnStr += ', '
                            }
                        }
                    })
                    this.$alert(warnStr + '已添加设置，请勿重复添加', '警告', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        dangerouslyUseHTMLString: true,
                        callback: action => {
                            this.getList()
                        }
                    })
                } else {
                    this.$message.success('新增成功')
                    this.getList()
                }
            })
        },
        handleDel(row) {
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 是否删除${row.Name}权限?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchUserDeleteBUserRight(this.AdminTypeInfoId, row.ID).then(res => {
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
        showRoleVal(Val) {
            let obj
            if (Val.AuthValue) {
                try {
                    obj = JSON.parse(Val.AuthValue)
                } catch (error) {
                    console.log(error)
                }
            }
            if (Val.AuthorityType === 1) {
                return obj.BooleanValue
            } else if (Val.AuthorityType === 2) {
                return (obj.DataRangStart || '') + '-' + (obj.DataRangEnd || '')
            } else if (Val.AuthorityType === 3) {
                return obj.IntValue
            } else if (Val.AuthorityType === 4) {
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
