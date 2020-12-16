<template>
  <div>
    <div class="form-search">
      <div class="filter-item">
        <div class="label">有效期至</div>
        <el-date-picker
          v-model="keyDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"/>
      </div>
      <div class="filter-item">
        <el-button
          type="primary"
          @click="addKey">生成密钥</el-button>
      </div>
    </div>
    <cs-table
      ref="detailBUser"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :row-key="'ID'"
      :height="440"
      hasselection
      hasindex
      @cell-dblclick="cellDbClick"
      @pageChange="pageChange">
      <el-table-column
        label="管理员秘钥"
        show-overflow-tooltip
        min-width="140"
        prop="SecretKey"/>
      <el-table-column
        label="有效期"
        min-width="140"
        prop="EndTime"/>
      <el-table-column
        min-width="80"
        label="状态">
        <template slot-scope="{row}">
          <span :class="['key-font-color', 'state'+row.State]"> {{ stateMap[row.State] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="激活用户"
        prop="UseLoginName" />
      <el-table-column
        label="管理">
        <template slot-scope="{row}">
          <el-button
            :disabled="row.State>0"
            type="text"
            @click="delKey(row)">删除</el-button>
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
import { fetchInfoSecretkeyList, addInfoSecretkey, delInfoSecretkey } from '@/api/user.js'
import { keyState } from '@/utils/basedata.js'
export default {
    props: {
        curid: {
            type: String | Number,
            default: ''
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            table: {
                data: [],
                selections: []
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            keyDate: '',
            stateOptions: keyState
        }
    },
    computed: {
        stateMap() {
            const obj = {}
            this.stateOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    watch: {
        isShow(n) {
            if (n) {
                this.getList()
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            fetchInfoSecretkeyList({ AdminTypeInfoId: this.curid }).then(res => {
                this.table.data = res.map(item => {
                    const { SecretKey, EndTime, State, UseUser, UseLoginName } = item
                    return { SecretKey, EndTime, State, UseUser, UseLoginName }
                }) || []
                this.page.total = res.Total || 0
            })
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        },
        addKey() {
            if (!this.keyDate) {
                this.$message.warning('请选择有效期')
                return
            }
            addInfoSecretkey({ 'adminTypeInfoID': this.curid, 'EndTime': this.keyDate }).then(res => {
                this.$message.success('生成成功')
                this.getList()
            })
        },
        delKey(row) {
            delInfoSecretkey({ SecretKey: row.SecretKey }).then(res => {
                this.$message.success('删除成功')
                this.getList()
            })
        },
        cellDbClick(row, column, cell, event) {
            if (column.property === 'SecretKey') {
                document.execCommand('Copy')
                this.$message.success('已复制选择文本')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.form-search{
  .filter-item{
    display: flex;
    float: left;
    flex-direction: row;
    margin: 0px 10px 15px 10px;
    .label{
      line-height: 36px;
      padding: 0 10px;
      width: 80px;
      text-align: right;
    }
    .el-button{
      background-color:  $--color-main;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      padding: 11px 20px;
    }
  }
}
</style>
