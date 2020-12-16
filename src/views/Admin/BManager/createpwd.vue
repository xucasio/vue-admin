<template>
  <div class="create-pwd">
    <el-row style="padding-top:40px;text-align:left">
      已为您生成 <span style="color:#1970FF"> {{ label.LABEL_NAME }}</span> 口令如下：
    </el-row>
    <el-row style="padding-top:20px;text-align:center">
      <el-input
        v-model="pwd"
        style="width:200px;text-align:center"
        readonly/>
    </el-row>
    <el-row style="padding-top:40px;text-align:center;color:#1970FF">
      <el-button
        type="text"
        plain
        @click="copy"> 复制口令并关闭</el-button>

    </el-row>
    <el-row style="padding-top:40px;text-align:center;color:#BBBECA">
      注：生成新的口令时，旧口令将会失效
    </el-row>
  </div>
</template>
<script>
import { fetchRefLabelmark } from '@/api/label.js'
export default {
    name: 'CreatePWd',
    props: {
        label: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            pwd: ''
        }
    },
    mounted() {
        fetchRefLabelmark(this.label.LABEL_ID).then(res => {
            console.log('res:', res)
            this.pwd = res.toString()
        })
    },
    methods: {
        copy() {
            const transfer = document.createElement('input')
            document.body.appendChild(transfer)
            transfer.value = this.pwd // 这里表示想要复制的内容
            transfer.focus()
            transfer.select()
            if (document.execCommand('copy')) {
                document.execCommand('copy')
            }
            transfer.blur()
            this.$message.success('复制成功！')
            document.body.removeChild(transfer)
            this.$emit('close')
        }
    }
}
</script>
