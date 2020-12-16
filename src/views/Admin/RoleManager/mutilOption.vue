<template>
  <div class="views-content">
    <el-form class="mutilOption">
      <el-form-item
        label="导入角色、权限"
        class="form-item">
        <el-upload
          :on-exceed="handleExceed"
          :before-upload="getFile"
          :on-success="handleSuccess"
          :file-list="fileList"
          class="upload-form"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <el-button
            ref="upBtn"
            size="small"
            type="primary">{{ uploadtxt }}</el-button>
          <el-input
            v-model="filename"
            readonly/>
        </el-upload>

      </el-form-item>
      <el-form-item
        label="导出角色、权限"
        class="form-item">
        <el-button
          size="small"
          type="primary"
          @click="exportFile">下载文件</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import api from '@/api/api.js'
import common from '@/utils/common.js'
export default {
    name: 'MutilOption',
    data() {
        return {
            fileList: [],
            filename: '',
            fileBlob: null
        }
    },
    computed: {
        uploadtxt: function() {
            return this.fileBlob ? '重新上传' : '点击上传'
        }
    },
    methods: {
        handleExceed(files, fileList) {
            this.$message.warning(`上传出错`)
        },
        handleSuccess(res, file, fileList) {
            this.fileList = []
            this.fileList.push({ name: res.name, url: res.url })
        },
        getFile(file) {
            // const _URL = window.URL || window.webkitURL
            // const fileBuffer = new File()
            console.log('文件', file)
            this.filename = file.name
            this.fileBlob = file
        },
        exportFile() {
            common.downLoadFile(api.adminhost + '/aa/cc', '角色权限列表')
        }
    }
}
</script>
<style lang="scss">
.mutilOption{
  margin:  0 auto;
  text-align: center;
  display: flex;
  width: 50%;
  min-height: calc(100vh - 180px);
  flex-direction: column;
  .el-form-item{
    text-align: left;
    .el-form-item__content{
      .upload-form{
        .el-upload{
          display: flex;
          flex-direction: row;
        }
        .el-upload-list{
          display: none;
        }
      }
      .el-input{
        margin: 0 10px;
      }
    }
  }
}
</style>
