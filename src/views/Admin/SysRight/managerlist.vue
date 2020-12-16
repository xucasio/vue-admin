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
            <span class="fiter-item-title">管理员类型：</span><div class="fiter-item-input">
              <el-select v-model="adminType">
                <el-option
                  :value="0"
                  label="全部"/>
                <el-option
                  v-for="ad in Admins"
                  :key="ad.ADMIN_TYPE_ID"
                  :label="ad.ADMIN_TYPE_NAME"
                  :value="ad.ADMIN_TYPE_ID"/>
              </el-select>
            </div>
          </el-col>
          <el-col
            :span="6"
            :offset="12"
            class="filter-item">
            <el-input
              v-model="key"
              style="margin-right:10px"
              placeholder="账号、手机号、昵称 "
              @keyup.enter.native="handleSearch"/>
            <el-button
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
      </el-row></div>
      <div/>
      <div class="search-btns">
        <el-button
          v-if="points.indexOf('ADD')>-1"
          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增管理员</el-button>
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
        label="账号"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="昵称"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="NICKNAME"/>
      <el-table-column
        min-width="150"
        show-overflow-tooltip
        label="管理员类型"
        header-align="center"
        prop="ADMIN_TYPE_NAME"/>
      <el-table-column
        min-width="150"
        show-overflow-tooltip
        label="所属组织"
        header-align="center"
        prop="CUSTOMER_NAME"/>
      <el-table-column
        label="详情"
        show-overflow-tooltip
        min-width="80"
        align="center"
        header-align="center"
        prop="UserStatusName">
        <template slot-scope="scope">
          <a
            v-if="points.indexOf('SELDTL')>-1"
            class="td-link"
            @click="showUserInfo(scope.row.USER_ID)">详情</a>
        </template>

      </el-table-column>
      <el-table-column
        v-if="points.indexOf('SELDTL')>-1||points.indexOf('DEL')>-1"
        label="管理"
        fixed="right"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="gotoDelete(scope.row.USER_ADMIN_ID)"/>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showAddDialog"
      width="600px"
      title="新增管理员"
      @close="closeAddDialog">
      <AddManager
        v-if="showAddDialog"

        @success="addSuccsee"
        @close="closeAddDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showInfo"
      width="720px"
      title="用户信息"
      @close="closeInfo">
      <UserInfo
        v-if="showInfo"
        :readonly="true"
        :userid="curUserid"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchAdminList, fetchAdminDel, fetchAdminTypeList } from '@/api/admin'
import AddManager from './addManager'
import UserInfo from '../UserManager/userInfo'
export default {
    name: 'ManagerList',
    components: { AddManager, UserInfo },
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            showAddDialog: false,
            showInfo: false,
            curUserid: ''
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    mounted() {
        this.getAdminTList()
        this.getList()
    },
    methods: {
        closeInfo() {
            this.showInfo = false
        },
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getAdminTList() {
            fetchAdminTypeList().then(res => {
                this.Admins = res
            })
        },
        getList() {
            var data = {
                'Condition': {
                    'AdminTypeId': this.adminType,
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
            fetchAdminList(data).then(res => {
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
        },
        showUserInfo(id) {
            this.curUserid = id
            this.showInfo = true
        },
        closeAddDialog() {
            this.showAddDialog = false
        },
        addSuccsee() {
            this.getList()
            this.showAddDialog = false
        },
        gotoDelete(id) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将永久删除, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchAdminDel(id).then(res => {
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
