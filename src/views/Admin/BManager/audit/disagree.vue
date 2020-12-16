<template>
  <div class="audit-agree">
    <div class="audit-agree-row">是否拒绝下列 {{ accounts.length }} 个账号的申请？</div>
    <div class="audit-agree-account" >
      {{ accounts.map(m=>{
        return m.LoginName
      }).join(',') }}
    </div>
    <div class="audit-agree-row">
      拒绝原因：
    </div>
    <div class="audit-agree-row">
      <el-input
        v-model="reason"
        type="textarea"
        maxlength="255"
        rows="4"/>
    </div>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="confirm">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { fetchApprovalLabel } from '@/api/label'
export default {
    name: 'Agree',
    props: {
        accounts: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            reason: ''
        }
    },
    mounted() {
        console.log('counts:', this.accounts)
    },
    methods: {
        confirm() {
            // 拒绝原因不能为空
            if (this.reason.trim() === '') {
                this.$message.error('拒绝原因不能为空')
                return
            }
            var ids = this.accounts.map(m => {
                return m.ORGANIZAION_APPLY_ID
            })
            var data = {
                'OrganizaionApplyID': ids.join(','),
                'ApprovalState': 3,
                'ApprovalReason': this.reason
            }
            fetchApprovalLabel(data).then(res => {
                this.$message.success('提交成功')
                this.$emit('success')
            }).catch(er => {
                this.$emit('error')
            })
        },
        closeDialog() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss">
.audit-agree{
  .audit-agree-row{
    padding-top: 20px;
  }
  .audit-agree-account{
    color: $--color-main;
    padding-top: 20px;
  }

}

</style>
