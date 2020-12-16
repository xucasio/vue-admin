<template>
  <div class="role-table">
    <div class="role-table-top" >
      <el-button
        icon="el-icon-plus"
        size="small"
        @click="addRole">添加角色</el-button> </div>
    <cs-table
      :data="data"
      :height="400">
      <el-table-column
        label="角色名称"
        width="200"
        show-overflow-tooltip
        prop="Name"
        header-align="center" />
      <el-table-column
        header-align="center"
        label="有效期" >
        <template slot-scope="scope">
          {{ scope.row.BeginTimeStr +' 至 '+scope.row.EndTimeStr }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="AssignMax"
        label="使用上限">
        <template slot-scope="{row}">
          {{ row.AssignMax||'不限' }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        width="80"
        header-align="center"
        align="center" >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="续期"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="!isBuser()"
                icon="iconxuqi"
                @click.native="onGo(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                icon="iconshanchu"
                @click.native="onDelete(scope.row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showRoleDialog"
      :append-to-body="false"
      title="添加角色"
      width="800px"
      @close="closeRoleDialog">
      <UserRoleList
        :is-show="showRoleDialog"
        @close="closeRoleDialog"
        @add="handleAddRole"/>
    </cs-dialog>
    <cs-dialog
      :show="showDelayDialog"
      :append-to-body="false"
      width="500px"
      title="角色续期"
      @close="closeDelayDialog">
      <DelayDialog
        v-if="showDelayDialog"
        :rowid="rowid"
        :orgrange="dateRange"
        :isover="isover"
        :rolename="rolename"
        @close="closeDelayDialog"
        @add="addDelay"
        @confirm="handleGetDelay"/>
    </cs-dialog>
  </div>
</template>
<script>
import UserRoleList from './roleList'
import DelayDialog from './delayDialog'
import common from '@/utils/common.js'
import { getStorage } from '@/utils/auth'
import { fetchUserAdminDelayRole, fetchUserSetBUserRole, fetchUserDeleteBUserRole } from '@/api/user.js'
export default {
    name: 'UserRoles',
    components: { UserRoleList, DelayDialog },
    props: {
        AdminTypeInfoId: {
            type: [String, Number],
            default: ''
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            showRoleDialog: false,
            showDelayDialog: false,
            rowid: '',
            rolename: '',
            isover: true,
            userId: common.getUrlKey('userId')
        }
    },
    methods: {
        closeRoleDialog() {
            this.showRoleDialog = false
        },
        closeDelayDialog() {
            this.showDelayDialog = false
        },
        handleGetDelay(val, id) {

        },
        addRole() {
            this.showRoleDialog = true
        },
        handleAddRole(roles, dt, limit) {
            var data = {
                'AdminTypeInfoId': this.AdminTypeInfoId,
                'roles': roles.map(m => {
                    return {
                        id: m.ROLE_ID,
                        name: m.ROLE_NAME,
                        beginTime: dt[0],
                        endTime: dt[1],
                        AssignMax: limit
                    }
                })
            }
            fetchUserSetBUserRole(data).then(res => {
                if (res.Value && res.Value.length > 0) {
                    let warnStr = ''
                    res.Value.map((id, index) => {
                        const obj = this.data.find(item => {
                            return item.ID === id
                        })
                        if (obj) {
                            warnStr += `<font color="#1970FF">${obj.Name}</font>`
                            if (index < (res.Value.length - 1)) {
                                warnStr += ', '
                            }
                        }
                    })
                    this.showRoleDialog = false
                    this.$alert(warnStr + '已添加设置，请勿重复添加', '警告', {
                        confirmButtonText: '确定',
                        dangerouslyUseHTMLString: true,
                        type: 'warning',
                        callback: action => {
                            this.$emit('reload')
                        }
                    })
                } else {
                    this.$message.success('添加角色成功')
                    this.showRoleDialog = false
                    this.$emit('reload')
                }
            })
        },
        onGo(row) {
            console.log('111')
            this.showDelayDialog = true
            this.rowid = row.ID
            this.rolename = row.Name
            this.isover = row.IsExpire
            this.dateRange = [row.BeginTimeStr, row.EndTimeStr]
        },
        onDelete(row) {
            console.log(row)
            fetchUserDeleteBUserRole(this.AdminTypeInfoId, row.ID).then(res => {
                this.$message.success('删除角色成功')
                this.$emit('reload')
            })
        },
        addDelay(delay) {
            fetchUserAdminDelayRole({ AdminTypeInfoId: this.AdminTypeInfoId, id: this.rowid, ...delay, UserId: this.userId }).then(res => {
                this.$emit('reload')
                this.showDelayDialog = false
            }).catch(ex => {

            })
        },
        isBuser() {
            return +getStorage('TYPEID') === 4
        }
    }
}
</script>
<style lang="scss">
.role-table{
  .role-table-top{
    padding: 20px 0;
  }

}
</style>
