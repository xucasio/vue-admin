<template>
  <div class="add-app">
    <div
      class="app-form "
      style="padding-top:40px">
      <el-form
        ref="form"
        :model="Form"
        label-width="120px" >
        <el-form-item
          label="字段名称"
        >
          <el-input
            v-model="cur.ExtendParamInfo.EXTENDPARAMNAME"
            disabled/>
        </el-form-item>
        <el-form-item
          label="字段标识" >
          <el-input
            v-model="cur.ExtendParamInfo.EXTENDPARAMID"
            disabled/>
        </el-form-item>
        <el-form-item
          label="字段类型" >
          <el-input
            v-model="extType"
            disabled/>
        </el-form-item>
        <el-form-item
          label="是否允许为空"
          required
          prop="ISNULL">
          <el-radio-group v-model="Form.ISNULL">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否校验规则"
          required
          prop="ISRULE">
          <el-radio-group v-model="Form.ISRULE">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fetchUpdateAppExt } from '@/api/admin'
import common from '@/utils/common'
export default {
    name: 'AddApp',
    props: {
        isrule: {
            type: Boolean,
            default: false
        },
        isrnull: {
            type: Boolean,
            default: false
        },
        extid: {
            type: [Number, String],
            default: 0
        },
        cur: {
            type: Object,
            default: () => {
                return { }
            }
        }
    },
    data() {
        return {
            Form: {
                ISNULL: false,
                ISRULE: false,
                'APPLICAITONMARK': common.getUrlKey('appid'),
                'EXTENDPARAMID': 0
            },
            extType: '',
            extTypes: [{ id: 0, name: '普通' }, { id: 1, name: '枚举' }, { id: 2, name: '地区' }, { id: 3, name: '时间' }, { id: 4, name: '学校' }]

        }
    },
    mounted() {
        this.Form.ISNULL = this.cur.ISNULL
        this.Form.ISRULE = this.cur.ISRULE
        this.Form.EXTENDPARAMID = this.extid
        console.log('cur:', this.cur)
        this.extType = this.getTypeLabel(this.cur.ExtendParamInfo.EXTENDPARAMTYPE)
    },
    methods: {
        submitForm() {
            fetchUpdateAppExt(this.Form).then(res => {
                this.$message.success('修改成功')
                this.$emit('success')
            }).catch(error => {
                this.$message.error(error || '修改失败')
            })
        },
        cancel() {
            this.$emit('close')
        },
        getTypeLabel(v) {
            var f = this.extTypes.find(f => f.id === v)
            console.log('f:', f)
            return (f ? f.name : '')
        }

    }
}
</script>
<style lang="scss" scoped>
.enum-view{
  .cs-table{
    line-height: initial;
  }

}
</style>
