<template>
  <div
    id="authSet"
    class="views-content">
    <div class="form-search">
      <div
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索名称、标识"
          class="input-with-select"
          @keyup.enter.native="handleSearch" >
          <el-select
            slot="prepend"
            v-model="search.authType"
            clearable
            placeholder="请选择权限类型">
            <el-option
              v-for="item in roleTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"/>
        </el-input>
      </div>
    </div>
    <cs-table
      ref="authSelect"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :height="(screenHeight-280)"
      :pageindex="page.current"
      :reserve-selection="true"
      :row-key="'ID'"
      hasindex
      haspage
      @pageChange="pageChange">
      <el-table-column
        label="权限标识"
        header-align="center"
        show-overflow-tooltip
        prop="Mark"/>
      <el-table-column
        label="权限ID"
        header-align="center"
        prop="AUTHORITY_ID"/>
      <el-table-column
        label="权限类型"
        align="center"
        width="150"
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
    </cs-table>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchAuthList } from '@/api/role.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'AuthList2',
    data() {
        return {
            search: {
                keyWord: '',
                daterange: [],
                authType: ''
            },
            table: {
                data: [],
                selections: []
            },
            form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }]
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
            fetchAuthList(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
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
                    Token: getStorage('TOKEN'),
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0,
                    authType: this.search.authType || 0
                },
                pageIndex: this.page.current,
                pageSize: this.page.size

            }
            return data
        },
        handleSelectionChange(val) {
            this.table.selections = val
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
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

.form-search{
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  .filter-item{
    display: flex;
    flex-direction: row;
    .label{
      line-height: 36px;
      padding: 0 4px;
      width: 50px;
    }
    .el-button{
      background-color:  $--color-main;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      padding: 11px 20px;
    }
  }
}
.footer{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
<style lang="scss">
  #authSet{
    .el-input-group__prepend{
      background: none;
      width: 120px;
    }
  }
</style>
