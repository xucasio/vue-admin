<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :title="title"
    :width="width"
    :show-close="showclose"
    :append-to-body="appendToBody"
    class="csmar-dialog">
    <slot />
    <span
      slot="footer"
      class="dialog-footer">
      <slot name="footer"/>
    </span>
  </el-dialog>
</template>
<script>
export default {
    name: 'CsDialog',
    props: {
        title: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '50%'
        },
        showclose: {
            type: Boolean,
            default: true
        },
        appendToBody: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            dialogVisible: false
        }
    },
    mounted() {

    },
    methods: {
        handleClose() {
            this.$emit('close')
        }

    }
}
</script>
<style lang="scss">
.csmar-dialog{
  .el-dialog__header{
    display: block;
    text-align: left;
    line-height: 0px;
  }
  .el-dialog__header{
    background:  $--color-main;
    padding: 15px 20px;
    .el-dialog__title{
      color: #fff;
      font-size: 16px;
      user-select: none;
    }
    .el-dialog__headerbtn{
      font-size: 18px;
      top: 18px;
      .el-dialog__close{
        color: #ccc;
      }
    }
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: #fff !important;
    }
  }
  .el-dialog__body{
    padding: 20px;
    padding-bottom: 0;
    text-align: left;
  }
  .el-dialog__footer{
    text-align: left;
  }
}
</style>
