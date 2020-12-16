<template>
  <div class="row-tab">
    {{ title }}
    <div
      v-if="hasRightBtn"
      class="rBtn">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
    name: 'CsRowTab',
    props: {
        title: {
            type: String,
            default: ''
        },
        hasRightBtn: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss">
  .row-tab{
    padding-left: 10px;
    border-left: 3px solid $--color-main;
    font-size: 16px;
    // height: 14px;
    // line-height: 14px;
    .rBtn{
      float: right;
    }

  }
</style>
