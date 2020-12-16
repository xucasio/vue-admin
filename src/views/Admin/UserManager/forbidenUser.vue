<template>
  <div class="forbid-user">
    <div
      v-if="!isstart"
      class="forbid-user-row"> 账号一经禁用，用户无法登陆本系统，且无法使用所有相关产品及权限，谨慎操作！</div>
    <div class="forbid-user-row ">
      <span class="is-required">原因：</span>
      <el-input
        v-model="reason"
        type="textarea"
        rows="5"
        style="width:390px"/>
    </div>
    <div class="forbid-user-row ">
      <span class="is-required">账号：</span>
      <div style="width:380px;padding:10px">
        <el-tag
          v-for="us in users"
          :key="us.USER_ID">
          {{ us.USER_NAME }}
        </el-tag>
      </div>
    </div>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { fetchUserState } from '@/api/user'
export default {
    name: 'ForbidUser',
    props: {
        users: {
            type: Array,
            default: () => {
                return []
            }
        },
        isstart: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            reason: ''
        }
    },
    methods: {
        add() {
            if (this.reason.trim() === '') {
                this.$message.error('请填写原因')
                return
            }
            var data = {
                UserID: this.users.map(m => { return m.USER_ID }),
                IsOk: this.isstart,
                reason: this.reason
            }
            fetchUserState(data).then(res => {
                this.$message.success('提交成功')
                this.$emit('success')
            })
        },
        closeDialog() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss">
.forbid-user-row{
  padding-top: 20px;
  display: flex;
  align-items: flex-start;
  span.is-required::before {
    content: "*";
    color: #CC0000;
    margin-right: 4px;
  }

}

</style>
