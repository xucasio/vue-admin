<template>
  <div class="add-app">
    <div
      class="app-form "
      style="padding-top:40px">
      <el-form
        ref="form"
        :model="Form"
        :rules="rules"
        label-width="100px" >
        <el-form-item
          label="产品名称"
          required
          prop="ApplicationName">
          <el-input
            v-model.trim="Form.ApplicationName"
            maxlength="50"
            placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item
          label="产品标识"
          required
          prop="ApplicationMark">
          <el-input
            v-number-only
            :readonly="isedit"
            v-model.trim="Form.ApplicationMark"
            placeholder="请输入产品标识"
            maxlength="10"/>
        </el-form-item>
        <el-form-item
          label="描述"
          required
          prop="Describe">
          <el-input
            v-model="Form.Describe"
            type="textarea"
            maxlength="255"
            placeholder="请输入描述"/>
        </el-form-item>
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
import { fetchAppAdd, fetchAppUpdate } from '@/api/admin'
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
                return {

                }
            }
        }

    },
    data() {
        return {
            Form: {
                ApplicationId: 0,
                ApplicationName: '',
                ApplicationMark: '',
                Describe: ''
            },
            rules: {
                ApplicationName: [
                    { required: true, message: '请输入产品名称', trigger: ['blur', 'change'] }
                ],
                ApplicationMark: [
                    { required: true, message: '请输入产品标识', trigger: ['blur', 'change'] },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                Describe: [
                    { required: true, message: '请输入描述', trigger: ['blur', 'change'] },
                    { max: 255, message: '长度不得超过255字符', trigger: 'blur' }
                ]
            }
        }
    },

    mounted() {
        if (this.isedit) {
            this.Form = {
                ApplicationId: this.cur.APPLICATION_ID,
                Describe: this.cur.DETAIL,
                ApplicationName: this.cur.NAME,
                ApplicationMark: this.cur.APPLICATION_MARK

            }
        }
    },
    methods: {
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.isedit) {
                        fetchAppUpdate(this.Form).then(res => {
                            this.$message.success('修改成功')
                            this.$emit('success')
                        }).catch(error => {
                            this.$message.error(error || '修改失败')
                        })
                    } else {
                        fetchAppAdd(this.Form).then(res => {
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
            this.Form.ApplicationName = ''
            this.Form.Describe = ''
            if (!this.isedit) {
                this.Form.ApplicationMark = ''
            }
            // this.$refs['form'].resetFields()
        },
        cancel() {
            this.$emit('close')
        }
    }
}
</script>
