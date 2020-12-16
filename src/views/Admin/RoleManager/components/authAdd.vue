<template>
  <div>
    <el-form
      ref="form"
      :model="Form"
      :rules="rules"
      class="authDialog"
      label-width="120px">
      <el-form-item
        label="权限名称"
        prop="Name">
        <el-input v-model="Form.Name"/>
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="Mark">
        <el-input v-model="Form.Mark"/>
      </el-form-item>
      <!-- <el-form-item
        label="产品名称"
        prop="ApplicationId">
        <el-select
          v-model="Form.ApplicationId"
          placeholder="请选择产品名称">
          <el-option
            v-for="(item,index) in productOptions"
            :key="index"
            :label="item.Name"
            :value="item.ID"/>
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="权限类型"
        class="itemflex"
        prop="AuthorityType">
        <el-select
          v-model="Form.AuthorityType"
          placeholder="请选择权限类型"
          @change="typeChange">
          <el-option
            v-for="(item,index) in roleTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <span
          v-if="Form.ID"
          class="msgTip">* 权限类型变更将会导致类型值无效，请谨慎操作！</span>
          <!-- <el-form-item
          v-if="Form.AuthorityType === 4"
          :error="typeErrorTip"
          :validate-status="typeStatus"
          class="dataVal"
          prop="Mark"
        >
          <el-input
            v-model="Form.Mark"/>
        </el-form-item>
        <el-form-item
          v-if="Form.AuthorityType === 3"
          :error="typeErrorTip"
          :validate-status="typeStatus"
          class="dataVal"
          prop="Mark"
        >
          <el-input
            v-model="Form.Mark"/>
        </el-form-item>
        <el-form-item
          v-if="Form.AuthorityType === 2"
          :error="typeErrorTip"
          :validate-status="typeStatus"
          class="dataVal"
        >
          <div
            class="datarange">
            <el-input
              v-model="data1"/>
            <span>-</span>
            <el-input
              v-model="data2"/>
          </div>
        </el-form-item> -->

      </el-form-item>
      <el-form-item
        v-if="Form.AuthorityType !== 4"
        label="权限合并类型"
        prop="PriorityType">
        <el-select
          v-model="Form.PriorityType"
          placeholder="请选择权限合并类型">
          <el-option
            v-for="(item,index) in PriorityTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <div class="footer">
        <el-button
          type="primary"
          @click="addAuth">{{ Form.ID? '编辑':'新增' }}</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { fecthApplicationList, validMark } from '@/api/role.js'
export default {
    name: 'AuthAdd',
    props: {
        visiable: {
            type: Boolean,
            default: false
        },
        formdata: {
            type: Object,
            default: () => {
                return {}
            }
        },
        curRow: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            Form: {
                Name: '',
                // ApplicationId: null,
                AuthorityType: null,
                Mark: ''
            },
            productOptions: [],
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }],
            PriorityTypeOptions: [{ name: '允许优先', id: 0 }, { name: '拒绝优先', id: 1 }, { name: '最小值优先', id: 2 }, { name: '最大值优先', id: 3 }],
            rules: {
                Name: [{ required: true, trigger: 'blur', message: '请输入' }],
                // ApplicationId: [{ required: true, trigger: 'change', message: '请选择产品名称' }],
                AuthorityType: [{ required: true, trigger: 'change', message: '请输入活动名称' }],
                Mark: [{ required: true, trigger: 'blur', validator: this.checkMark }],
                PriorityType: [{ required: true, trigger: 'change', message: '请选择权限合并类型' }]
            },
            typeStatus: '',
            typeErrorTip: '',
            ApplicationId: ''
        }
    },
    watch: {
        'visiable': {
            handler: function(n) {
                if (!n) {
                    this.resetForm()
                } else {
                    if (this.formdata.ID) {
                        const { Name, AuthorityType, Mark, ID, ParentId, ApplicationId, PriorityType } = this.formdata
                        this.ApplicationId = ApplicationId
                        this.getPriorityTypesByType(AuthorityType)
                        this.Form = {
                            Name,
                            AuthorityType,
                            ParentId,
                            Mark,
                            ID,
                            ApplicationId,
                            PriorityType
                        }
                    } else {
                        this.resetForm()
                    }
                }
            },
            immediate: true
        }
    },
    created() {
        // this.getProducts()
    },
    methods: {
        getProducts() {
            fecthApplicationList().then(res => {
                this.productOptions = res || []
            })
        },
        addAuth() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let obj = {}
                    if (this.Form.PriorityType === '') {
                        obj = Object.assign({}, this.Form)
                        obj.PriorityType = 0
                    } else {
                        obj = this.Form
                    }
                    this.$emit('add', obj)
                }
            })
        },
        closeDialog() {
            this.$emit('close')
        },
        typeChange(n) {
            this.Form.PriorityType = ''
            this.getPriorityTypesByType(n)
        },
        resetForm() {
            this.Form = {
                Name: '',
                ApplicationId: '',
                AuthorityType: '',
                PriorityType: '',
                Mark: ''
            }
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        checkMark(rule, value, callback) { // 校验权限标识不重复
            if (value === '') {
                return callback(new Error('权限标识不能为空！'))
            }
            validMark({ ApplicationId: this.curRow.ApplicationId || this.ApplicationId, mark: value, AuthId: this.Form.ID || 0 }).then(res => {
                if (!res) {
                    return callback(new Error('权限标识已存在！'))
                } else {
                    return callback()
                }
            }).catch(er => {
                return callback(new Error('权限标识不能为空！'))
            })
        },
        getPriorityTypesByType(n) {
            switch (n) {
                    case 1:
                        this.PriorityTypeOptions = [{ name: '允许优先', id: 0 }, { name: '拒绝优先', id: 1 }]
                        break
                    case 4:
                        this.PriorityTypeOptions = []
                        break
                    case 2:
                        this.PriorityTypeOptions = [{ name: '最小值优先', id: 2 }, { name: '最大值优先', id: 3 }]
                        break
                    case 3:
                        this.PriorityTypeOptions = [{ name: '最小值优先', id: 2 }, { name: '最大值优先', id: 3 }]
                        break
            }
        }
    }
}
</script>
<style lang="scss">
.authDialog{
  .itemflex{
    .el-form-item__content{
      display: flex;
      &>.el-input{
        margin: 0 15px;
        width: 120px;
      }
      .dataVal{
        .datarange{
          display: flex;
          margin: 0 15px;
          .el-input{
            margin: 0 5px;
            width: 120px;
          }
        }
        .el-form-item__error{
          left: 17px;
        }
      }
    }
  }
  .footer{
    text-align:center;
  }
  .msgTip{
    color:#F56C6C;
    display:inline-block;
    font-size:12px;
    padding-left:10px
  }
}
</style>
