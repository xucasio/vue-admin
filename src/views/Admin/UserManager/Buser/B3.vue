<template>
  <div>
    <el-row style="padding-top:40px;text-align:center">
      用户账户：
      <cs-remote-search
        ref="remote"
        v-model="UserId"
        :is-multiple="false"
        :requestfn="getUsers"
        :res-path="[]"
        :default-props="{value:'USER_ID',label:'LOGIN_NAME'}"
        placeholder="请输入用户名或手机号"
        style="width:340px"
        key-attr="ConditionValue"/>
    </el-row>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { fetchExistsname, fetchExistsphone, fetchAddBuserToOrg } from '@/api/user'
import { fetchSearchUserList } from '@/api/admin'
import { getStorage } from '@/utils/auth'
export default {
    name: 'B3',
    data() {
        return {
            UserId: ''

        }
    },
    methods: {
        async checkUserName() {
            if (this.name.trim() !== '') {
                var res = await fetchExistsname(this.name)
                if (res) {
                    this.$message.error('已存在')
                    return false
                }
                res = await fetchExistsphone(this.name)
                if (res) {
                    this.$message.error('已存在')
                    return false
                }
                return true
            } else {
                this.$message.error('请输入')
            }
        },
        add() {
            if (!this.UserId) {
                this.$message.error('请输入')
                return
            }
            if (this.checkUserName()) {
                fetchAddBuserToOrg({
                    'ORGANIZAION_NAME': '',
                    'USER_ID': this.UserId,
                    'ADMIN_TYPE_INFO_ID': getStorage('PTYPEID')
                }).then(res => {
                    this.$message.success('添加成功')
                    this.$emit('success')
                })
            }
        },
        closeDialog() {
            this.$emit('close')
        },
        getUsers(key) {
            return fetchSearchUserList(key)
        }

    }
}
</script>
