<template>
  <div class="delay-content">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick">
      <el-tab-pane
        label="用户管理"
        name="1">
        <div class="delay-content-row rolename"> {{ rolename }}:</div>
        <div class="delay-content-row ">
          <div class="delay-title"><el-checkbox
            :disabled="!isover"
            v-model="hasStart">生效时间：</el-checkbox></div>
          <el-date-picker
            :disabled="!hasStart"
            v-model="startDate"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width:210px"/>
        </div>
        <div class="delay-content-row">
          <div class="delay-title">续期时间：</div>
          <el-input
            v-model="freq"
            style="width:100px;margin-right:10px"/>
          <el-select
            v-model="freqType"
            style="width:100px">
            <el-option
              v-for="ft in freqTypes"
              :key="ft.key"
              :value="ft.key"
              :label="ft.value" />
          </el-select>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="配置管理"
        name="2">
        <div class="delay-content-row rolename"> {{ rolename }}:</div>
        <div class="delay-content-row ">
          <div class="delay-title">续期时间：</div>
          <el-date-picker
            v-model="delayStartDate"
            :disabled="!isover"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width:210px"/>
          <span style="margin:0 5px"> 至</span>
          <el-date-picker
            v-model="delayEndDate"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width:210px"/>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { freqTypes } from '@/utils/basedata'
import common from '@/utils/common.js'
export default {
    name: 'DelayDialog',
    props: {
        rolename: {
            type: String,
            default: ''
        },
        isover: {
            type: Boolean,
            default: true
        },
        orgrange: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            activeName: '1',
            hasStart: false,
            startDate: '',
            freq: '',
            freqType: 1,
            freqTypes: freqTypes,
            delayEndDate: '',
            delayStartDate: '',
            startPickerOptions: { // 生效时间，禁用当前时间之前的时间
                disabledDate: (time) => {
                    const nowTime = new Date().getTime()
                    return time.getTime() < nowTime
                }
            }

        }
    },
    mounted() {
        // 还没结束的权限只能选择续期结束时间，开始时间默认为原来权限的结束时间
        if (!this.isover) {
            this.delayStartDate = this.orgrange[1]
        }
    },
    methods: {
        add() {
            if (this.activeName === '1') {
                if (this.hasStart) {
                    if (!this.startDate) {
                        this.$message.error('请选择生效时间')
                        return
                    }
                }
                if (!this.freq) {
                    this.$message.error('请填写续期时间')
                    return
                }
                this.$emit('add', { type: this.activeName, startTime: this.startDate, freqType: this.freqType, freqValue: this.freq })
            } else {
                if (!this.delayEndDate || !this.delayStartDate) {
                    this.$message.error('请填写续期时间')
                    return
                }
                if (!common.compareDate(this.delayStartDate, this.delayEndDate)) {
                    this.$message.error('开始时间不能大于结束时间')
                    return
                }
                this.$emit('add', { type: this.activeName, startTime: this.delayStartDate || null, endTime: this.delayEndDate || null })
            }
        },
        closeDialog() {
            this.$emit('close')
        },
        handleClick() {

        }
    }
}
</script>
<style lang="scss">
.delay-content{
  .delay-content-row{
    display: flex;
    flex-direction: row;
    padding-top: 10px;
    align-items: center;
    &.rolename{
      color: $--color-main;
    }
    .delay-title{
      width: 200px;
      text-align: right;
      padding-right: 5px;
    }
  }
}
</style>
