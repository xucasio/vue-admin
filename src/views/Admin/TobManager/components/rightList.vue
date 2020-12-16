<template>
  <div>
    <div class="form-search">
      <div class="filter-item flex">
        <div
          class="label">权限类型</div>
        <el-select
          v-model="search.authType"
          placeholder="请选择权限类型"
          @change="typeChange">
          <el-option
            v-for="(item,index) in roleTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <div
          v-if="hastypedata"
          style="display:inline-block">
          <el-select
            v-if="search.authType === 1"
            v-model="search.normalBol"
            placeholder=""
            style="width:75px">
            <el-option
              v-for="(item,index) in [{ val: true,name: 'true'},{val: false,name: 'false' }]"
              :key="index"
              :label="item.name"
              :value="item.val"/>
          </el-select>
          <el-input
            v-if="search.authType === 3"
            ref="num"
            :class="[{'is-error':(search.authType === 3)&&!search.Mark}]"
            v-model="search.Mark"
            oninput="value=value.replace(/[^\d]/g,'')"/>
          <div
            v-if="search.authType === 2"
            class="datarange">
            <el-input
              :class="[{'is-error':search.authType === 2&&!data1}]"
              v-model="data1"
              oninput="value=value.replace(/[^\d]/g,'')"/>
            <span>-</span>
            <el-input
              :class="[{'is-error':search.authType === 2&&!data2}]"
              v-model="data2"
              oninput="value=value.replace(/[^\d]/g,'')"/>
          </div>
        </div>
      </div>
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
        v-if="hasLimit"
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
          v-model="search.keyWord"
          placeholder="请搜索名称、标识"
          class="input-with-select">
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="getList"/>
        </el-input>
      </div>
    </div>
    <!-- <cs-table
      ref="authSelect"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :reserve-selection="true"
      :row-key="'Primarykey'"
      :height="(screenHeight-440)"
      hasselection
      hasindex
      haspage
      @selection-change="handleSelectionChange"
      @pageChange="pageChange">
      <el-table-column
        label="产品标识"
        show-overflow-tooltip
        min-width="80"
        header-align="center"
        prop="Mark"/>
      <el-table-column
        label="权限ID"
        min-width="80"
        header-align="center"
        prop="AUTHORITY_ID"/>
      <el-table-column
        label="权限类型"
        min-width="80"
        header-align="center"
        prop="AuthorityType">
        <template slot-scope="{row}">
          <span>{{ roleTypeMap[row.AuthorityType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用上限"
        align="center"
        prop="AssignMax">
        <template slot-scope="{row}">
          {{ row.AssignMax||'不限' }}
        </template>
      </el-table-column>
      <el-table-column
        label="权限名称"
        header-align="center"
        min-width="300"
        prop="Name"/>
    </cs-table> -->
    <cs-select-treegrid
      :is-show="isShow"
      :data="table.data"
      :auth-type="search.authType"
      :keyword="search.keyWord"
      @select="getSelectedNodes"/>
    <div class="footer">
      <el-button
        type="primary"
        @click="addAuth">添加</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getStorage } from '@/utils/auth'
import { fetchAuthListNew } from '@/api/role.js'
import CsSelectTreegrid from '@/components/CsSelectTreegrid'
export default {
    name: 'AuthSelect',
    components: {
        CsSelectTreegrid
    },
    props: {
        selections: {
            type: Array,
            default: () => []
        },
        hasdate: {
            type: Boolean,
            default: true
        },
        isShow: {
            type: Boolean,
            default: false
        },
        hastypedata: {
            type: Boolean,
            default: true
        },
        hasLimit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            search: {
                keyWord: '',
                daterange: [],
                authType: 1,
                Mark: '', // 数值类型值
                normalBol: true, // 普通权限类型值
                limit: ''
            },
            table: {
                data: [],
                selections: []
            },
            form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            data1: '',
            data2: '',
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }]
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        }),
        roleTypeMap() {
            const obj = {}
            this.roleTypeOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    watch: {
        isShow(n) {
            if (n) {
                this.$nextTick(() => {
                    this.search.authType = 1
                    this.search.daterange = []
                    this.search.limit = ''
                    this.search.keyWord = ''
                    this.search.normalBol = true
                    this.getList()
                })
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            const data = this.getData()
            if (data) {
                fetchAuthListNew(data).then(res => {
                    this.table.data = this.randomId(res.Data) || []
                    this.page.total = res.Total || 0
                })
            }
        },
        getData() {
            const data = {
                'AdminTypeInfoID': getStorage('PTYPEID'),
                'conditionValue': this.search.keyWord,
                'authType': this.search.authType
            }
            return data
        },
        handleSelectionChange(val) {
            this.table.selections = val
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        },
        closeDialog() {
            this.$emit('close')
        },
        addAuth() {
            if (this.table.selections.length <= 0) {
                this.$message.error('请选择权限')
                return
            }
            if (this.hasdate && !this.search.daterange.length) {
                this.$message.error('请填写有效期')
                return
            }
            // hastypedata有的时候才做检验
            if (this.search.authType == 3 && !this.search.Mark && this.hastypedata) {
                this.$message.error('请选择填写权限类型对应数值')
                return
            }
            if (this.search.authType == 2 && (!this.data1 || !this.data2) && this.hastypedata) {
                this.$message.error('请选择填写权限类型对应数值')
                return
            }
            let markObj = {}
            if (this.hastypedata) {
                if (this.search.authType === 1) {
                    markObj = {
                        BooleanValue: this.search.normalBol
                    }
                } else if (this.search.authType === 2) {
                    markObj = {
                        DataRangStart: this.data1,
                        DataRangEnd: this.data2
                    }
                } else if (this.search.authType === 3) {
                    markObj = {
                        IntValue: this.search.Mark
                    }
                } else if (this.search.authType === 4) {
                    markObj = {
                        // MarkVerionMsg: this.search.Mark
                        MarkVerionMsg: ''
                    }
                }
            }

            this.$emit('add', this.table.selections, this.search.daterange, markObj, this.search.limit)
        },
        typeChange(n) {
            this.getList()
            this.table.selections = []
            this.search.Mark = ''
        },
        getSelectedNodes(nodes) {
            this.table.selections = nodes
        },
        randomId(arr) {
            const _this = this
            if (arr.length) {
                const fn = function(arr) {
                    arr.map(item => {
                        _this.$set(item, 'keyid', item.ID + Math.random().toString().slice(3, 8))
                        _this.$set(item, 'leaf', !!(!item.IsChecked || (item.ApplicationMark && !item.AuthorityList.length)))
                        if (item.AuthorityList && item.AuthorityList.length) {
                            fn(item.AuthorityList)
                        }
                        return item
                    })
                }
                fn(arr)
            }
            return arr
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
      width: 60px;
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
      width: 180px;
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
