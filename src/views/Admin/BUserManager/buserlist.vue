<template>
  <div
    id="userBList"
    class="views-content">
    <div
      class="views-search">
      <div
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索关键词"
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
          @click="goAddOrg">新增组织</el-button>
      </div>
    </div>
    <cs-table
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :height="(screenHeight-330)"
      class="buserList"
      hasindex
      haspage
      @pageChange="pageChange">
      <el-table-column
        label="组织名称"
        header-align="center"
        show-overflow-tooltip
        prop="CustomerFullName"/>
      <el-table-column
        label="所属产品"
        width="200"
        header-align="center"
        prop="APPLICATION_NAME"/>
      <el-table-column
        label="组织信息"
        header-align="center"
        align="center"
        width="100"
        prop="MOBILEPHONE">
        <template slot-scope="{row}">
          <a
            class="td-link"
            @click="gotoDetail(row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        label="组织成员上限"
        align="center"
        width="130"
        prop="ACCOUNT_COUNT"/>
      <el-table-column
        header-align="center"
        label="组织成员"
        width="120"
        align="center">
        <template slot-scope="{row}">
          <a
            class="td-link"
            @click="gotoAccounts(row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        label="备注"
        width="200"
        prop="Remark"
        align="center"/>
      <el-table-column
        label="管理"
        width="130"
        header-align="center"
        align="center"
        prop="">
        <template slot-scope="{row}">
          <div class="btn-flex">
            <el-tooltip
              content="设置"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshezhi"
                @click.native="setBUser(row)"/>
            </el-tooltip>
            <el-tooltip
              content="管理员秘钥"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshengchengkouling"
                @click.native="setKey(row)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshanchu"
                @click.native="delBUser(row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showBuserDetailDialog"
      :append-to-body="false"
      title="管理账号列表详情"
      width="800px"
      @close="closeBuserDetailDialog">
      <detailBUser
        :id="adminTypeInfoID"
        :is-show="showBuserDetailDialog"
        @close="closeBuserDetailDialog"/>
    </cs-dialog>
    <cs-dialog
      :show="showKeyDialog"
      :append-to-body="false"
      title="管理员秘钥"
      width="1000px"
      @close="closeKeyDialog">
      <setKey
        :is-show="showKeyDialog"
        :curid="curid"
        @close="closeKeyDialog"/>
    </cs-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchBUserListAdmin, fetchDeleteBuserAdmin } from '@/api/user.js'
import { fecthApplicationList } from '@/api/role.js'
import { userState } from '@/utils/basedata.js'
import CsRemoteSearch from '@/components/CsRemoteSearch'
import CsAutoComplete from '@/components/CsAutoComplete'
import detailBUser from '../TobManager/components/detailBUser'
import setKey from '../TobManager/components/setKey'
import { getStorage } from '@/utils/auth'
export default {
    name: 'UserList',
    components: {
        CsRemoteSearch, setKey, CsAutoComplete, detailBUser
    },
    data() {
        return {
            search: {
                keyWord: ''
            },
            table: {
                data: []
            },
            rules: {
                OrgName: [{ required: true, trigger: 'blur', message: '请输入机构/学校名称' }],
                BClientUserCount: [{ required: true, trigger: 'blur', message: '请输入可管理账号数量' }],
                ApplicationId: [{ required: true, trigger: 'change', message: '请选择归属产品管理' }]
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            ApplicationOptions: [],
            stateOptions: userState,
            showBuserDetailDialog: false,
            adminTypeInfoID: null, // 用于详情
            showKeyDialog: false, // 口令弹窗
            curid: '' // 当前typeinfoid
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        }),
        stateMap() {
            const obj = {}
            this.stateOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getStorage,
        fetchBUserListAdmin,
        handleSearch() {
            this.page.current = 1
            this.getList()
        },
        getList() {
            const data = this.getData()
            this.showLoading('.buserList')
            fetchBUserListAdmin(data).then(res => {
                this.table.data = res.Data || []
                this.page.total = res.Total || 0
                this.hideLoading()
            }).catch(ex => {
                this.hideLoading()
            })
        },
        goAddOrg() {
            this.$router.push('/tob/addOrg')
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    'KeyWords': this.search.keyWord,
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
        // 设置B端管理员
        setBUser(row) {
            this.$router.push({ path: '/tob/buseradminset', query: { userId: row.USER_ID, adminTypeInfoId: row.ADMIN_TYPE_INFO_ID }})
        },
        delBUser(row) {
            console.log(row)
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 确定删除该条记录?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchDeleteBuserAdmin(row.ADMIN_TYPE_INFO_ID).then(res => {
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
        getProducts() {
            fecthApplicationList().then(res => {
                this.ApplicationOptions = res || []
            })
        },
        ApplicationChange(val) {
            const obj = this.ApplicationOptions.find(i => i.ID === val)
            if (obj) {
                this.Form.ApplicationMark = obj.ApplicationMark
            }
        },
        gotoDetail(row) {
            this.$router.push({ path: '/tob/buserDetail', query: { adminTypeInfoId: row.ADMIN_TYPE_INFO_ID, account: row.ACCOUNT_COUNT }})
        },
        gotoAccounts(row) {
            this.showBuserDetailDialog = true
            this.adminTypeInfoID = row.ADMIN_TYPE_INFO_ID
        },
        closeBuserDetailDialog() {
            this.showBuserDetailDialog = false
        },
        // 设置口令
        setKey(row) {
            this.showKeyDialog = true
            this.curid = row.ADMIN_TYPE_INFO_ID
        },
        closeKeyDialog() {
            this.showKeyDialog = false
        }
    }
}
</script>
<style lang="scss">
#userBList{
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
  .rowBtn{
    color: #515365;
    cursor: pointer;
    padding: 0 5px;
    &:hover{
      color: $--color-main;
    }
  }
  .mb15{
    margin-bottom: 15px;
  }
  .mt20{
    margin-top: 20px;
  }
    thead{
      th.el-table-column--selection {
          .cell {
              display: none !important;
              height: 40px;
          }
      }
    }
  .footer{
    text-align:center;
    margin-top: 20px;
  }
  .btn-flex{
    display: flex;
    justify-content: center;
  }
}

</style>
