<template>
  <div class="views-content">
    <div class="content-form">
      <el-form
        ref="form"
        :model="Form"
        :rules="rules"
        label-width="100px" >
        <el-form-item
          label="标签名称："
          required
          prop="LabelName">
          <el-input
            v-model.trim="Form.LabelName"
            maxlength="60"
            placeholder="请输入标签名称"/>
        </el-form-item>
        <el-form-item
          label="标签描述："
          prop="LabelDescribe">
          <el-input
            v-model.trim="Form.LabelDescribe"
            placeholder="请输入标签描述"
            rows="5"
            maxlength="255"
            type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            @click="addRight()">添加权限</el-button>
        </el-form-item>
        <el-form-item
          label="账号权限："
          style="margin-bottom: 50px;"
          prop="AuthorityIDs">
          <el-card
            shadow="never"
            class="roleadd-card">
            <el-tag
              v-for="(tag,i) in rights"
              :key="tag.ID"
              closable
              @close="handleCloseTag(i)">
              {{ tag.Name }}
            </el-tag>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <cs-dialog
      :show="showRightDialog"
      :append-to-body="false"
      title="添加权限"
      @close="closeRightDialog">
      <UserRightList
        v-if="showRightDialog"
        :hasdate="!isBuser()"
        :hastypedata="!isBuser()"
        @close="closeRightDialog"
        @add="handleAddRight"/>
    </cs-dialog>
  </div>
</template>
<script>
import { fetchLabelAdd, fetchQuerylabelauth, fetchQuerylabelinfo, fetchLabelUpdate } from '@/api/label'
import UserRightList from '@/views/Admin/RoleManager/components/rightList'
import { getStorage } from '@/utils/auth'
import common from '@/utils/common.js'
export default {
    name: 'AddLabel',
    components: { UserRightList },
    data() {
        // var validateRights = (rule, value, callback) => {
        //     if (this.rights.length <= 0) {
        //         callback(new Error('请添加权限!'))
        //     } else {
        //         callback()
        //     }
        // }
        var validateLabeName = (rule, value, callback) => {
            if (value.trim() == '') {
                callback(new Error('请输入标签名称!'))
            } else if (!/^[A-Za-z0-9\u4e00-\u9fa5\.\(\)（）_\-——\s]*$/.test(value)) {
                callback(new Error('标签名称上限60字符，支持中文、字母、数字、括号、下划线或中划线'))
            } else {
                callback()
            }
        }
        var validateDesc = (rule, value, callback) => {
            // if (value.trim() == '') {
            //     callback(new Error('请输入标签描述!'))
            // } else if (!/^[A-Za-z0-9\u4e00-\u9fa5\.\(\)（）_\-——,，\s]*$/.test(value)) {
            //     callback(new Error('标签描述上限255字符，支持中文、字母、数字、括号、下划线或中划线'))
            // } else {
            //     callback()
            // }
            if (!/^[A-Za-z0-9\u4e00-\u9fa5\.\(\)（）_\-——,，\s]*$/.test(value)) {
                callback(new Error('标签描述上限255字符，支持中文、字母、数字、括号、下划线或中划线'))
            } else {
                callback()
            }
        }
        return {
            isEdit: !!common.getUrlKey('labelid'),
            showRightDialog: false,
            Form: {
                LabelDescribe: '',
                LabelName: '',
                AuthorityIDs: []
            },
            rights: [],
            rules: {
                LabelName: [
                    { required: true, message: '请输入标签名称', trigger: ['blur', 'change'] },
                    { validator: validateLabeName, trigger: ['blur', 'change'] }
                ],
                LabelDescribe: [
                    { message: '请输入标签描述', trigger: ['blur', 'change'] },
                    { validator: validateDesc, trigger: ['blur', 'change'] }

                ]
                // AuthorityIDs: [
                //     { validator: validateRights, trigger: 'blur' }
                // ]
            }
        }
    },
    mounted() {
        var labelID = common.getUrlKey('labelid')
        if (labelID) {
            fetchQuerylabelauth(labelID).then(res => {
                this.rights = res
            })
            fetchQuerylabelinfo(labelID).then(res => {
                if (res && res[0]) {
                    this.Form.LabelName = res[0].LABEL_NAME
                    this.Form.LabelDescribe = res[0].LABEL_DESCRIBE
                }
            })
        }
    },
    methods: {
        // B端管理员不需要设置有效期
        isBuser() {
            return +getStorage('TYPEID') === 4
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var data = {
                        AdminTypeInfoID: getStorage('PTYPEID'),
                        LabelDescribe: this.Form.LabelDescribe,
                        LabelName: this.Form.LabelName,
                        AuthorityIDs: this.rights.map(m => {
                            return m.ID
                        })
                    }
                    if (this.isEdit) {
                        data.LabelID = common.getUrlKey('labelid')
                        fetchLabelUpdate(data).then(res => {
                            this.$message.success('修改成功')
                            this.$router.push('/bsysright/labellist')
                        })
                    } else {
                        fetchLabelAdd(data).then(res => {
                            this.$message.success('新增成功')
                            this.$router.push('/bsysright/labellist')
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
            this.$refs['form'].resetFields()
            this.rights = []
        },
        handleCloseTag(i) {
            this.rights.splice(i, 1)
        },
        addRight() {
            this.showRightDialog = true
        },
        closeRightDialog() {
            this.showRightDialog = false
        },
        handleAddRight(rights, dt) {
            this.rights = this.rights.concat(rights)
            this.closeRightDialog()
        }
    }
}
</script>
<style lang="scss">

</style>
