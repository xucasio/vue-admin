<template>
  <div class="config-item config-base">
    <el-row class="config-title">图表名称</el-row>
    <el-row class="config-content">
      <el-input
        v-model="Base.titleName"
        placeholder=""/>
    </el-row>
    <el-row class="config-title">标题对齐</el-row>
    <el-row class="config-content">
      <el-radio-group v-model="Base.titleAlign">
        <el-radio-button label="left">左</el-radio-button>
        <el-radio-button label="center">中</el-radio-button>
        <el-radio-button label="right">右</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="config-title">标题颜色</el-row>
    <el-row class="config-content">
      <el-color-picker v-model="Base.titleColor"/>
    </el-row>
    <el-row class="config-title">宽</el-row>
    <el-row
      class="config-content"
      style="padding:5px 20px">
      <el-slider
        v-model="Base.width"
        :min="1"
        :step="1"
        :max="12"
        :marks="marks"
        show-stops/>
    </el-row>
    <el-row class="config-title">高</el-row>
    <el-row class="config-content">
      <el-input-number
        v-model="Base.height"
        :min="1"
        :max="10"
        style="width:100%"
        controls-position="right"
        @change="handleChange"/>
    </el-row>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
export default {
    name: 'ConfigBase',
    data() {
        return {
            name: 'first',
            titleAlign: '',
            titleColor: '',
            width: 1,
            height: 5,

            marks: {
                1: '1',
                6: '6',
                12: '12' }
        }
    },
    computed: {
        ...mapState({
            selectedId: state => state.chart.SelectId
        }),
        Base() {
            return this.$store.state.chart.List.find(e => e.i === this.selectedId) ? this.$store.state.chart.List.find(e => e.i === this.selectedId).option.base:{}
        }
    },
    methods: {
        handleClick() {

        },
        handleChange(val) {

        }
    }
}
</script>
