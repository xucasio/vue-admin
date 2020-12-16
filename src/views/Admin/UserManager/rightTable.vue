<template>
  <div class="role-table">
    <div class="role-table-top" >
      <el-button
        icon="el-icon-plus"
        size="small"
        @click="addRole">添加权限</el-button> </div>
    <cs-table
      :data="data"
      height="400">
      <el-table-column
        label="权限名称"
        width="200"
        show-overflow-tooltip
        prop="Name"
        header-align="center" />
      <el-table-column
        label="权限类型"
        min-width="80"
        align="center"
        prop="AuthType">
        <template slot-scope="{row}">
          <span>{{ roleTypeMap[row.AuthType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="220"
        label="有效期" >
        <template slot-scope="scope">
          {{ scope.row.BeginTimeStr +' 至 '+scope.row.EndTimeStr }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        label="权限值" >
        <template slot-scope="{row}">
          {{ showRoleVal(row,row.Value) }}
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        width="80"
        header-align="center"
        align="center" >
        <template slot-scope="scope">
          <div class="table-manage">
            <cs-round-button
              v-if="!isBuser()"
              icon="iconxuqi"
              @click.native="onGo(scope.row)"/>
            <cs-round-button
              icon="iconshanchu"
              @click.native="onDelete(scope.row)"/>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showRoleDialog"
      :append-to-body="false"
      title="添加权限"
      width="800px"
      @close="closeRoleDialog">
      <UserRightList
        :hasdate="hasdate"
        :is-show="showRoleDialog"
        :hastypedata="hastypedata"
        @close="closeRoleDialog"
        @add="handleAddRight"/>
    </cs-dialog>
    <cs-dialog
      :show="showDelayDialog"
      :append-to-body="false"
      width="500px"
      title="权限续期"
      @close="closeDelayDialog">
      <DelayDialog
        v-if="showDelayDialog"
        :rowid="rowid"
        :isover="isover"
        :orgrange="dateRange"
        :rolename="rolename"
        @close="closeDelayDialog"
        @add="addDelay"
        @confirm="handleGetDelay"/>
    </cs-dialog>
  </div>
</template>
<script>
import UserRightList from './rightList'
import DelayDialog from './delayDialog'
import { getStorage } from '@/utils/auth'
import { fetchUserDelayRight, fetchUserSetUserRight, fetchUserDeleteUserRight } from '@/api/user.js'
export default {
    name: 'UserRoles',
    components: { UserRightList, DelayDialog },
    props: {
        userid: {
            type: [String, Number],
            default: ''
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        hasdate: {
            type: Boolean,
            default: true
        },
        hastypedata: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showRoleDialog: false,
            showDelayDialog: false,
            rowid: '',
            rolename: '',
            isover: true,
            Primarykey: '',
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }]
        }
    },
    computed: {
        roleTypeMap() {
            const obj = {}
            this.roleTypeOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
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
        handleAddRight(rights, dt, Value) {
            var data = {}
            if (!this.isBuser()) {
                data = {
                    'userId': this.userid,
                    'rights': rights.map(m => {
                        return {
                            id: m.ID,
                            name: m.Name,
                            beginTime: dt[0],
                            endTime: dt[1],
                            Value,
                            AssignMax: m.AssignMax
                        }
                    })
                }
            } else {
                data = {
                    'userId': this.userid,
                    'rights': rights.map(m => {
                        return {
                            id: m.ID,
                            name: m.Name,
                            beginTime: m.START_TIME,
                            endTime: m.END_TIME,
                            Value: m.AuthValue ? JSON.parse(m.AuthValue) : null,
                            AssignMax: m.AssignMax
                        }
                    })
                }
            }

            fetchUserSetUserRight(data).then(res => {
                if (res.Value && res.Value.length > 0) {
                    let warnStr = ''
                    res.Value.map((id, index) => {
                        const obj = this.data.find(item => {
                            return item.ID === +id
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
                    this.$message.success('添加权限成功')
                    this.showRoleDialog = false
                    this.$emit('reload')
                }
            })
        },
        onGo(row) {
            this.showDelayDialog = true
            this.rowid = row.ID
            this.rolename = row.Name
            this.isover = row.IsExpire
            this.dateRange = [row.BeginTimeStr, row.EndTimeStr]
            this.Primarykey = row.Primarykey
        },
        onDelete(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将删除改权限, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchUserDeleteUserRight(this.userid, row.ID, row.Primarykey).then(res => {
                    if (res) {
                        this.$message.success('删除权限成功')
                        this.$emit('reload')
                    } else {
                        this.$message.error('删除权限失败')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        addDelay(delay) {
            fetchUserDelayRight({ userId: this.userid, id: this.rowid, ...delay, Primarykey: this.Primarykey }).then(res => {
                if (res) {
                    this.$message.success('提交成功')
                    this.$emit('reload')
                    this.showDelayDialog = false
                } else {
                    this.$message.error('提交失败')
                }
            }).catch(ex => {

            })
        },
        isBuser() {
            console.log('TYPEID' + getStorage('TYPEID'))
            return +getStorage('TYPEID') === 4
        },
        showRoleVal(row, Val) {
            if (row.AuthType === 1) {
                return Val.BooleanValue
            } else if (row.AuthType === 2) {
                return (Val.DataRangStart || '') + '-' + (Val.DataRangEnd || '')
            } else if (row.AuthType === 3) {
                return Val.IntValue
            } else if (row.AuthType === 4) {
                return '-'
            }
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
