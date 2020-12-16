<template>
  <div class="add-app">
    <div
      class="app-form "
      style="padding-top:40px">
      <el-form
        ref="form"
        :model="Form"
        :rules="rules"
        label-width="120px" >
        <el-form-item
          label="字段名称"
          required
          prop="EXTENDPARAMNAME">
          <el-input
            v-model.trim="Form.EXTENDPARAMNAME"
            maxlength="50"
            placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item
          label="字段类型"
          required
          prop="EXTENDPARAMTYPE">
          <el-select v-model="Form.EXTENDPARAMTYPE">
            <el-option
              v-for="t in extTypes"
              :key="t.id"
              :value="t.id"
              :label="t.name"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===1"
          label="枚举项"
          required
          prop="extendParamEnums">
          <div class="enum-view">
            <el-row>
              <el-button
                size="mini"
                @click="addData">新增</el-button>
            </el-row>
            <cs-table
              ref="cstable"
              :data="Form.extendParamEnums"
              :height="200"
              border
              size="mini"
              hasindex
            >
              <el-table-column
                label="Key"
                min-width="100"
                header-align="center"
                show-overflow-tooltip
                prop="EXTENDPARAMENUMKEY">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.EXTENDPARAMENUMKEY"
                    size="mini"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                show-overflow-tooltip
                header-align="center"
                min-width="100"
                prop="EXTENDPARAMENUMVALUE">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.EXTENDPARAMENUMVALUE"
                    size="mini"/>
                </template>
              </el-table-column>
              <el-table-column
                label="管理"
                fixed="right"
                align="center"
                width="80" >
                <template slot-scope="scope">
                  <div class="table-manage">
                    <el-tooltip
                      content="删除"
                      placement="top"
                      effect="light">
                      <cs-round-button
                        icon="iconshanchu"
                        @click.native="delData(scope.$index)"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </cs-table>
          </div>
        </el-form-item>
        <el-form-item
          label="标题描述"
          prop="EXTENDTITLE">
          <el-input
            v-model.trim="Form.EXTENDTITLE"
            maxlength="100"
            placeholder="扩展字段标题描述" />
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===0"
          label="校验规则"
          prop="EXTENDPARAMRULE">
          <el-input
            v-model.trim="Form.EXTENDPARAMRULE"
            maxlength="200"
            placeholder="扩展字段校验规则" />
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===0"
          label="限制描述"
          prop="EXTENDDESC">
          <el-input
            v-model.trim="Form.EXTENDDESC"
            maxlength="200"
            placeholder="扩展字段限制描述" />
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===0"
          label="最小长度"
          prop="EXTENDMIN">
          <el-input
            v-number-only
            v-model.trim="Form.EXTENDMIN"
            placeholder="扩展字段最小长度" />
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===0"
          label="最大长度"
          prop="EXTENDMAX">
          <el-input
            v-number-only
            v-model.trim="Form.EXTENDMAX"
            placeholder="扩展字段最大长度" />
        </el-form-item>
        <!-- <el-form-item
          label="是否允许为空"
          required
          prop="ISNULL">
          <el-radio-group v-model="Form.ISNULL">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="Form.EXTENDPARAMTYPE===0"
          label="是否校验规则"
          required
          prop="ISRULE">
          <el-radio-group v-model="Form.ISRULE">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">确定</el-button>
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fetchAddextendparam, fetchUpdateextendparam } from '@/api/admin'
// import { watch } from 'fs'
export default {
    name: 'AddApp',
    props: {
        isedit: {
            type: Boolean,
            default: false
        },
        cur: {
            type: Object,
            default: () => {
                return { }
            }
        }
    },
    data() {
        var validateEnum = (rule, value, callback) => {
            if (!value || value.length <= 0) {
                callback(new Error('枚举项不能为空'))
            } else {
                var msg = ''
                value.forEach((l, i) => {
                    if (l.EXTENDPARAMENUMKEY === '') {
                        msg = '枚举项key不能为空'
                    } else if (!/^[a-zA-Z0-9_]+$/.test(l.EXTENDPARAMENUMKEY)) {
                        msg = '枚举项key只能为数字、字母或下划线'
                    }
                })
                if (msg === '') {
                    callback()
                } else {
                    callback(new Error(msg))
                }
            }
        }
        return {
            data: [],
            Form: {
                EXTENDPARAMNAME: '',
                EXTENDPARAMTYPE: 0,
                EXTENDPARAMRULE: '',
                EXTENDDESC: '',
                EXTENDTITLE: '',
                // ISNULL: false,
                // ISRULE: false,
                extendParamEnums: []
            },
            curId: '',
            extTypes: [{ id: 0, name: '普通' }, { id: 1, name: '枚举' }, { id: 2, name: '地区' }, { id: 3, name: '时间' }, { id: 4, name: '学校' }],

            rules: {
                EXTENDPARAMNAME: [
                    { required: true, message: '请输入字段名称', trigger: ['blur', 'change'] }
                ],
                extendParamEnums: [
                    { validator: validateEnum, trigger: ['blur', 'change'] }
                ],
                Describe: [
                    { required: true, message: '请输入描述', trigger: ['blur', 'change'] },
                    { max: 255, message: '长度不得超过255字符', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        'Form.extendParamEnums': {
            handler: function() {
                this.$refs.form.validateField('extendParamEnums')
            },
            deep: true
        }
    },
    mounted() {
        if (this.isedit) {
            this.Form = JSON.parse(JSON.stringify(this.cur))
            this.curId = this.Form.EXTENDPARAMID
        }
    },
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var data = this.getData()
                    if (this.isedit) {
                        fetchUpdateextendparam(data).then(res => {
                            this.$message.success('修改成功')
                            this.$emit('success')
                        }).catch(error => {
                            this.$message.error(error || '修改失败')
                        })
                    } else {
                        fetchAddextendparam(data).then(res => {
                            this.$message.success('新增成功')
                            this.$emit('success')
                        }).catch(error => {
                            this.$message.error(error || '新增失败')
                        })
                    }
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.Form.extendParamEnums = []
            this.$refs['form'].resetFields()
        },
        cancel() {
            this.$emit('close')
        },
        addData() {
            this.Form.extendParamEnums.push({
                EXTENDPARAMENUMKEY: '',
                EXTENDPARAMENUMVALUE: ''
            })
            this.$nextTick(() => {
                this.$refs.cstable.doLayout()
            })
        },
        delData(i) {
            this.Form.extendParamEnums.splice(i, 1)
        },
        getData() {
            var data = this.Form
            if (this.Form.EXTENDPARAMTYPE === 1) {
            // 枚举
                data.EXTENDPARAMRULE = ''
                data.EXTENDDESC = ''
                data.EXTENDMIN = 0
                data.EXTENDMAX = 0
                // data.extendParamEnums = this.data
            } else {
                data.extendParamEnums = []
            }
            return data
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
