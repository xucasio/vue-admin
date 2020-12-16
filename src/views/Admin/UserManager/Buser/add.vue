<template>
  <el-tabs
    v-model="activeName" >
    <el-tab-pane
      label="添加新用户"
      name="first">
      <B1
        @close="closeDialog"
        @success="success"/>
    </el-tab-pane>
    <el-tab-pane
      label="批量添加新用户"
      name="second">
      <B2
        @close="closeDialog"
        @success="success"/>
    </el-tab-pane>
    <el-tab-pane
      label="添加账号"
      name="third"><B3
        @close="closeDialog"
        @success="success"/></el-tab-pane>
    <el-tab-pane
      label="批量添加"
      name="fourth"><B4
        @close="closeDialog"
        @success="success"/></el-tab-pane>
  </el-tabs>
</template>
<script>
import B1 from './B1'
import B2 from './B2'
import B3 from './B3'
import B4 from './B4'
export default {
    name: 'AddBUser',
    components: { B1, B2, B3, B4 },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close')
        },
        success() {
            this.$emit('success')
        }
    }
}
</script>
