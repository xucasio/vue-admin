<template>
  <div :class="'cs-table ' +headbg" >
    <el-table
      ref="table"
      :data="data"
      :height="height===0? undefined :height"
      :max-height="maxheight===0? undefined :maxheight"
      :highlight-current-row="HighlightCurrentRow"
      :empty-text="emptyText"
      :span-method="spanMethod"
      :size="size"
      :row-class-name="rowclassname"
      :tree-props="treeProps"
      :row-key="rowKey"
      stripe
      style="width:100%"
      tooltip-effect="dark"
      border
      @cell-dblclick="cellDblclick"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="hasselection"
        :reserve-selection="reserveSelection"
        type="selection"
        header-align="center"
        align="center"
        width="40"/>
      <el-table-column
        v-if="hasindex && data.length > 0"
        :index="indexMethod"
        label="序号"
        type="index"
        header-align="center"
        align="center"
        class-name="rw-table-index"
        width="80"/>
      <slot/>
      <div slot="empty">暂无数据</div>
    </el-table>
    <div
      v-if="haspage"
      class="table-pagination">
      <el-pagination
        :total="total"
        :current-page="pageindex"
        :page-size="pagesize"
        background
        layout="total,sizes,prev, pager, next, jumper"
        @current-change="pageChange"
        @size-change="pageSizeChange"/>
    </div>
  </div>
</template>

<script>
export default {
    name: 'CsTable',
    props: {
        // 表格的数据
        data: {
            type: Array,
            required: true
        },
        rowKey: {
            type: String,
            default: ''
        },
        emptydata: {
            type: String,
            default: ''
        },
        height: {
            type: [Number, String],
            default: 0
        },
        maxheight: {
            type: [Number, String],
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        url: {
            type: String,
            default: ''
        },
        pagesize: {
            type: Number,
            default: 0
        },
        pageindex: {
            type: Number,
            default: 1
        },
        hasindex: {
            type: Boolean,
            default: false
        },
        hasselection: {
            type: Boolean,
            default: false
        },
        reserveSelection: {
            type: Boolean,
            default: false
        },
        haspage: {
            type: Boolean,
            default: false
        },
        HighlightCurrentRow: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'medium'
        },
        headbg: {
            type: String,
            default: ''
        },
        spanMethod: {
            type: Function,
            default: function({ row, column, rowIndex, columnIndex }) {}
        },
        // eslint-disable-next-line vue/require-default-prop
        rowclassname: [String, Function],
        treeProps: {
            type: Object,
            default: () => {
                return { children: 'children', hasChildren: 'hasChildren' }
            }
        }
    },
    data() {
        return {
            emptyText: '暂无数据'
        }
    },
    mounted() {
        // this.emptydata = this.$t('localization.userCenter.noData')
        if (this.emptydata !== '') {
            this.emptyText = this.emptydata
        }
        console.log('mounted:', this.emptydata)
    },
    methods: {
        pageChange(val) {
            // this.pageindex = val
            // this.pagesize = val
            console.log('this.total,', this.total)
            console.log('this.pageindex,', val)
            console.log('this.pagesize,', this.pagesize)
            this.$emit('pageChange', this.pagesize, val)
        },
        pageSizeChange(val) {
            if ((val * (this.pageindex - 1)) <= this.total) {
                this.$emit('pageChange', val, this.pageindex)
            } else {
                this.$emit('pageChange', val, 1)
            }
        },
        indexMethod(index) {
            return this.pagesize * (this.pageindex - 1) + index + 1
        },
        handleSelectionChange(val) {
            this.$emit('selection-change', val)
        },
        cellDblclick(row, column, cell, event) {
            this.$emit('cell-dblclick', row, column, cell, event)
        },
        clearSelection() {
            this.$refs.table.clearSelection()
        },
        toggleAllSelection() {
            this.$refs.table.toggleAllSelection()
        },
        toggleRowSelection(row) {
            this.$refs.table.toggleRowSelection(row)
        },
        doLayout() {
            this.$refs.table.doLayout()
        }
    }
}
</script>

<style scoped>

</style>
