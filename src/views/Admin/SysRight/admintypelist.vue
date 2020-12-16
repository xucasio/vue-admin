<template>
  <div class="views-content">
    <div class="views-search">
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
              placeholder="请搜索名称、标识、描述 "
              @keyup.enter.native="handleSearch"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-button
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div/>
      <div class="search-btns">
        <el-button
          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增产品</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :height="(screenHeight-335)"
      hasindex
    >
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
        label="管理"
        fixed="right"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <a
            class="td-link"
            @click="showUserInfo(scope.row.USER_ID)">详情</a>
          <a
            class="td-link"
            @click="gotoDelete(scope.row.USER_ID)">删除</a>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchAdminDel, fetchAdminTypeList } from '@/api/admin'
export default {
    name: 'AdminTypeList',
    data() {
        return {
            data: [],
            key: ''
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
            this.getList()
        },
        getList() {
            fetchAdminTypeList().then(res => {
                this.data = res
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
            })
        },
        gotoAdd() {

        },
        showUserInfo() {

        },
        gotoDelete(id) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除该, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchAdminDel(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
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
