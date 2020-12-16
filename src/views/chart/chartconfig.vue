<template>
  <div class="page-config">
    <div class="config-title">
      <div class="main-title">控制面板 </div>
    </div>
    <div class="config-tabs">
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick">
        <el-tab-pane
          label="基础"
          name="first">
          <ConfigBase/>
        </el-tab-pane>
        <el-tab-pane
          label="数据"
          name="second">数据</el-tab-pane>
        <el-tab-pane
          label="高级"
          name="third">高级</el-tab-pane>
        <el-tab-pane
          label="下转"
          name="fourth">定时任务补偿</el-tab-pane>
        <el-tab-pane
          label="联动"
          name="fifth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
<script>
import ConfigBase from './config/base'
export default {
    name: 'Chartconfig',
    components: {
        ConfigBase
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick() {

        }
    }
}
</script>
