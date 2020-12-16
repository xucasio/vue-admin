<template>
  <div>
    <div
      style="width:400px;margin-bottom:20px">
      <el-input
        v-model="Form.keyWord"
        placeholder="关键词搜索"
        class="input-with-select">
        <el-button
          slot="append"
          type="primary"
          icon="el-icon-search"
          @click="getUserList"/>
      </el-input>
    </div>
    <cs-table
      ref="userList"
      :data="dialog.userList"
      :total="dialog.total"
      :pagesize="dialog.pagesize"
      :pageindex="dialog.pageindex"
      :height="(screenHeight-340)"
      hasselection
      haspage
      @selection-change="handleUserSelectionChange"
      @pageChange="pageUserChange">
      <el-table-column
        fixed="left"
        label="账号"
        min-width="140"
        align="center"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="姓名"
        fixed="left"
        align="center"
        show-overflow-tooltip
        min-width="100"
        prop="USER_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        align="center"
        min-width="140"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="联系邮箱"
        show-overflow-tooltip
        align="center"
        min-width="180"
        prop="EMAIL"/>
      <el-table-column
        min-width="240"
        show-overflow-tooltip
        label="学校/公司名称"
        align="center"
        prop="COMPANY"/>
      <el-table-column
        label="账号类型"
        show-overflow-tooltip
        align="center"
        min-width="100"
        prop="AccountTypeName"/>
      <el-table-column
        label="账号属性"
        align="center"
        min-width="100"
        show-overflow-tooltip
        prop="ACCOUNT_PURPOSE"/>
      <el-table-column
        label="开通日期"
        show-overflow-tooltip
        min-width="240"
        align="center"
        prop="CREATE_TIME"/>
      <el-table-column
        label="更新时间"
        min-width="240"
        show-overflow-tooltip
        align="center"
        prop="CREATE_TIME"/>
      <el-table-column
        label="用户状态"
        show-overflow-tooltip
        min-width="100"
        align="center"
        prop="UserStatusName"/>
    </cs-table>
    <div class="footer">
      <el-button
        type="primary"
        @click="addUser">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchUserList } from '@/api/user.js'
export default {
    name: 'UserList',
    data() {
        return {
            Form: {
                keyWord: ''
            },
            dialog: {
                pageindex: 1,
                pagesize: 10,
                total: 0,
                singleSelection: [],
                userList: []
            }
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight,
            MENUS: state => state.admin.menus
        })
    },
    mounted() {
        this.getUserList()
    },

    methods: {
        getUserList() {
            this.dialog.pageindex = 1
            this.getList()
        },
        getList() {
            const data = this.getUserData()
            fetchUserList(data).then(res => {
                this.dialog.userList = res.Data || []
                this.dialog.total = res.Total || 0
            })
        },
        getUserData() {
            const data = {
                condition: {
                    'adminTypeInfoID': 0,
                    'conditionValue': this.Form.keyWord,
                    'roles': [
                    ],
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0
                },
                pageIndex: this.dialog.pageindex,
                pageSize: this.dialog.pagesize

            }
            return data
        },
        addUser() {
            if (!this.dialog.singleSelection.length) {
                this.$message.warning('请选择一个账号进行添加！')
                return
            }
            this.$emit('add', this.dialog.singleSelection[0])
            this.$emit('close')
        },
        handleClose() {
            this.$emit('close')
        },
        handleUserSelectionChange(val) {
            if (val.length > 1) {
                this.$refs.userList.clearSelection()
                this.$refs.userList.toggleRowSelection(val[val.length - 1])
            }
            this.dialog.singleSelection = [val[val.length - 1]]
        },
        pageUserChange(size, current) {
            this.dialog.pageindex = current
            this.dialog.pagesize = size
            this.getList()
        }
    }
}
</script>
<style lang="scss" scoped>
.footer{
  width: 100%;
  text-align: center;
  margin: 15px 0;
}
</style>
