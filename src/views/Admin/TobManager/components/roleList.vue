<template>
  <div class="user-role-list">
    <el-row>
      <div class="views-search form-search">
        <div
          v-if="hasdate"
          class="filter-item">
          <div class="label">有效期</div>
          <el-date-picker
            v-model="search.daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </div>
        <div
          class="filter-item">
          <div class="label">使用上限</div>
          <el-input
            v-model="search.limit"
            :maxlength="4"
            oninput="value=value.replace(/[^\d]/g,'')"
            class="limit"
            type="text"/>
        </div>
        <div class="filter-item">
          <el-input
            v-model="keyWord"
            placeholder="请搜索产品标识、权限ID、权限类型、权限名称"
            class="input-with-select">
            <el-button
              slot="append"
              type="primary"
              icon="el-icon-search"
              @click="getList"/>
          </el-input>
        </div>
      </div>
    </el-row>
    <el-row class="role-table">
      <cs-table
        ref="roleList"
        :data="data"
        :total="total"
        :pagesize="pagesize"
        :pageindex="pageindex"
        :height="(screenHeight-440)"
        haspage
        hasindex
        hasselection
        @selection-change="handleSelectionChange"
        @pageChange="pageChange">
        <el-table-column
          label="产品标识"
          prop="ID"/>
        <el-table-column
          label="角色ID"
          prop="ROLE_ID"/>
        <el-table-column
          label="所属平台"
          prop="ID"/>
        <el-table-column
          label="角色名称"
          prop="ROLE_NAME"/>
      </cs-table>
    </el-row>
    <el-row style="padding-top:40px;text-align:center">
      <el-button
        type="primary"
        @click="add">添加</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { fetchRoleList } from '@/api/user.js'
import { mapState } from 'vuex'
export default {
    name: 'UserRoleList',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        hasdate: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            search: {
                beginTime: '',
                endTime: '',
                daterange: [],
                limit: ''
            },
            data: [],
            total: 0,
            pagesize: 10,
            pageindex: 1,
            keyWord: '',
            selectRow: []
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    watch: {
        isShow(n) {
            if (n) {
                this.$nextTick(() => {
                    this.$refs['roleList'].clearSelection()
                    this.search.beginTime = ''
                    this.search.endTime = ''
                    this.search.limit = ''
                    this.keyWord = ''
                })
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            const data = {
                'condition': {
                    'keyWords': this.keyWord
                },
                'pageIndex': this.pageindex,
                'pageSize': this.pagesize,
                'acsFiles': [],
                'descFiles': []
            }
            fetchRoleList(data).then(res => {
                this.data = res.Data
                this.total = res.Total
            })
        },
        add() {
            if (this.selectRow.length <= 0) {
                this.$message.error('请选择角色')
                return
            }
            if (this.hasdate && (!this.search.daterange || !this.search.daterange.length)) {
                this.$message.error('请填写有效期')
                return
            }
            this.$emit('add', this.selectRow, this.search.daterange, this.search.limit)
        },
        closeDialog() {
            this.$emit('close')
        },
        handleSearch() {
            // this.pagesize = 10
            this.pageindex = 1
            this.getList()
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        handleSelectionChange(row) {
            this.selectRow = row
        }
    }
}
</script>
<style lang="scss" scoped>
.form-search{
  .filter-item{
    width:50%;
    display: flex;
    float: left;
    flex-direction: row;
    margin: 0px 0px 15px 0px;
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
    &>.limit{
      width: 90%;
    }
  }
  .flex{
    display: flex;
    .el-input{
      width: 60px;
    }

    .el-select{
      width: 110px;
      margin-right: 10px;
    }
    .datarange{
      span{
        padding: 0 5px;
      }
    }
  }
  .w100{
    width: 100%;
  }
  .fr{
    float: right;
  }
}
.footer{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
<style lang="scss">
  .is-error{
    .el-input__inner{
      border: 1px solid #F56C6C;
    }
  }
</style>
