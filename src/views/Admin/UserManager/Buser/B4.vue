<template>
  <div class="import-form">
    <el-row style="padding-top:40px;text-align:center">
      <el-upload
        ref="upload"

        :auto-upload="false"
        :action="action"
        :with-credentials="true"
        :show-file-list="false"
        :on-error="onError"
        :on-change="onChange"
        :before-upload="beforeUpload"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        name="excelfile"
        class="upload-demo">
        <el-button
          slot="trigger"
          icon="iconfont icondaochu"
          size="small"
          plain >上传账号文件</el-button>
      </el-upload>
      <el-input
        v-model="filename"
        readonly
        style="width:340px"/>
    </el-row>
    <el-row style="height:20px">
      <a
        type="primary"
        class="down-file"
        size="mini"
        @click="downLoadFile">下载导入模板</a>
    </el-row>
    <!-- 报错信息 -->
    <el-row
      v-if="errors.length > 1"
      class="error-content">
      <div
        class="errort">检验结果:</div>
      <div
        v-for="(item, index) in errors"
        :key="index"
        class="errortip">* {{ item }}</div>
    </el-row>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import api from '@/api/api.js'
const host = api.adminhost
import common from '@/utils/common.js'
import { getStorage } from '@/utils/auth'
import { fetchBUserImportsOrg } from '@/api/user.js'
export default {
    name: 'B4',
    data() {
        return {
            fileurl: host + 'api/Account/downfilebybatchuserorganrange', // 批量导入新用户 模板下载,
            action: host + 'api/Account/batchadduser?token=' + getStorage('TOKEN'),
            filename: '',
            file: {},
            errors: [],
            loading: false
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close')
        },
        add() {
            console.log('add:')
            // this.$refs.fileUpload.$children[0].post(file)
            // this.$refs.upload.submit()
            const param = new FormData()
            // 空提交处理
            if (!this.file.name) {
                this.$message.warning('请选择一个文件上传！')
                this.loading = false
                return
            }
            // 大小限制提示
            if (this.file.size > (2 * 1024 * 1024)) {
                this.$message.warning('文件上传不得大于2M！')
                this.loading = false
                return
            }
            this.loading = true
            // 通过append向form对象添加数据
            param.append('excelfile', this.file)
            fetchBUserImportsOrg(param).then(res => {
                this.$message.success('上传成功')
                this.loading = false
                this.$emit('success')
            }).catch(er => {
                // split字符串分割
                this.loading = false
                this.errors = er.split('split')
                // 报错不是验证信息的情况
                if (typeof er === 'string' && er.indexOf('split') === -1) {
                    this.$message.error(er)
                }
                console.log('导入错误')
            })
        },
        downLoadFile() {
            common.downLoadFile(this.fileurl, '批量新增用户模板.xlsx')
        },
        onError(err, file, fileList) {
            err = err + ''
            this.$message.error(err.indexOf('|') === -1 ? err : err.substr(0, err.indexOf('|')))
        },
        onChange(file, fileList) {
            console.log('onChange:', file)
            this.errors = []
            var reg = /^.*\.(?:xls|xlsx)$/i// 文件名可以带空格
            const isExcel = reg.test(file.name)
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isExcel) {
                this.$message.error('上传文件必须是excel 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            if (isExcel && isLt2M) {
                this.filename = file.name
                this.file = file.raw
            }
        },
        beforeUpload() {
            return true
        }
    }
}
</script>
<style lang="scss">
 .import-form{
   .upload-demo{
     display: inline-block;
     margin-right: 10px;
   }
   .down-file{
     font-size: 12px;
     position: absolute;
     right: 50px;
     top: 5px;
     cursor: pointer;
     color:$--color-main;
     &:hover{
       text-decoration: underline;
     }
   }
   .error-content{
     padding: 0 40px;
			max-height: 200px;
			overflow: auto;
   .errort{
     font-weight: bold;
     margin-bottom: 10px;
   }
      .errortip{
        color: #c00;
        margin: 5px 0;
      }
   }
 }
</style>
