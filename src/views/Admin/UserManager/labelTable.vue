<template>
  <div class="role-table">
    <div class="role-table-top" >
      <el-button
        icon="el-icon-plus"
        size="small"
        @click="addRole">添加标签</el-button> </div>
    <cs-table
      :data="data"
      height="400">
      <el-table-column
        label="标签ID"
        align="center"
        show-overflow-tooltip
        prop="ID"/>
      <el-table-column
        label="标签名称"
        align="center"
        show-overflow-tooltip
        prop="Name"/>
      <el-table-column
        label="管理"
        width="80"
        header-align="center"
        align="center" >
        <template slot-scope="scope">
          <div class="table-manage">
            <cs-round-button
              icon="iconshanchu"
              @click.native="onDelete(scope.row)"/>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showLabelDialog"
      :append-to-body="false"
      title="添加标签"
      width="750px"
      @close="closeLabelDialog">
      <UserLabelList
        :is-show="showLabelDialog"
        @close="closeLabelDialog"
        @add="handleAddLabel"/>
    </cs-dialog>
  </div>
</template>
<script>
import UserLabelList from './labelList'
import { getStorage } from '@/utils/auth'
import { fetchUserSetUserLabel, fetchUserDeleteUserLabel } from '@/api/user.js'
export default {
    name: 'LabelTable',
    components: { UserLabelList },
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
        }
    },
    data() {
        return {
            showLabelDialog: false,
            showDelayDialog: false,
            rowid: '',
            rolename: '',
            isover: true
        }
    },
    methods: {
        closeLabelDialog() {
            this.showLabelDialog = false
        },
        closeDelayDialog() {
            this.showDelayDialog = false
        },
        handleGetDelay(val, id) {

        },
        addRole() {
            this.showLabelDialog = true
        },
        handleAddLabel(labels, dt) {
            var data = {
                'userId': this.userid,
                'LabelsID': labels.map(m => m.LABEL_ID)
            }
            fetchUserSetUserLabel(data).then(res => {
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
                    this.showLabelDialog = false
                    this.$alert(warnStr + '已添加设置，请勿重复添加', '警告', {
                        confirmButtonText: '确定',
                        dangerouslyUseHTMLString: true,
                        type: 'warning',
                        callback: action => {
                            this.$emit('reload')
                        }
                    })
                } else {
                    this.$message.success('添加标签成功')
                    this.showLabelDialog = false
                    this.$emit('reload')
                }
            })
        },
        onDelete(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 此操作将删除该标签, 是否继续?</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchUserDeleteUserLabel(this.userid, row.ID).then(res => {
                    if (res) {
                        this.$message.success('删除标签成功')
                        this.$emit('reload')
                    } else {
                        this.$message.error('删除标签失败')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        isBuser() {
            console.log('TYPEID' + getStorage('TYPEID'))
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
