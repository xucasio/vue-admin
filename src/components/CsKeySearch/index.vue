<template>
  <div class="cs-key-search">
    <el-input
      v-model="input3"
      :placeholder="placeholder"
      class="input-with-select"
      @keyup.enter.native="handleSearch"
      @input="keyInput"
    >
      <el-button
        v-if="prepend"
        slot="prepend"
        class="prebtn"
        icon="el-icon-search"
        @click.native="handleFilter">
        高级
      </el-button>
      <el-button
        slot="append"
        type="primary"
        class="searchbtn"
        icon="el-icon-search"
        @click.native="handleSearch"
      />
    </el-input>
  </div>
</template>
<script>
export default {
    name: 'CsKeySearch',
    props: {
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        prepend: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            input3: '',
            select: ''
        }
    },
    methods: {
        handleFilter() {
            this.$emit('filter')
        },
        handleSearch() {
            this.$emit('search', this.input3)
        },
        keyInput() {
            this.$emit('input', this.input3)
        }

    }
}
</script>
<style lang="scss">
.cs-key-search{
  width: 350px;
  .el-input-group__append{
    padding-left: 0;
    padding-right: 0;
  }
  .el-input-group__append button.el-button.el-button--primary,.el-button--default:hover{
   border-color: $--color-main;
   background-color: $--color-main;
   color: #fff;
   padding: 11px 20px;
  }
  .prebtn:hover{
    padding: 11px 20px;
    border-radius: 4px  0 0 4px;
  }
  .searchbtn{
    border-radius: 0 4px 4px 0;
  }

}

</style>
