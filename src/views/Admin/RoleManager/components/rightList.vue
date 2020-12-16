<template>
  <div>
    <div class="form-search">
      <div class="filter-item flex">
        <div class="label">权限类型</div>
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
          <!-- <el-input
            v-named-str
            v-if="search.authType === 4"
            ref="str"
            :class="[{'is-error':(search.authType === 4)&&!search.Mark}]"
            v-model="search.Mark"/> -->
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
        v-if="hasadmintype"
        class="filter-item">
        <div class="label">归属产品</div>
        <el-select
          v-model="typeInfoId"
          filterable
          placeholder="请选择角色归属">
          <el-option
            v-for="item in adminOptions"
            :key="item.ADMIN_TYPE_INFO_ID"
            :label="item.CUSTOMER_NAME"
            :value="item.ADMIN_TYPE_INFO_ID"/>
        </el-select>
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
        label="权限名称"
        header-align="center"
        min-width="300"
        prop="Name"/>
    </cs-table> -->
    <cs-select-treegrid
      :is-show="isShow"
      :auth-type="search.authType"
      :keyword="search.keyWord"
      :data="table.data"
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
import { fetchAuthListNew, fetchAdminlist } from '@/api/role.js'
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
        hasadmintype: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keyWord: '',
                daterange: [],
                authType: 1,
                Mark: '', // 数值类型值
                normalBol: true // 普通权限类型值
            },
            table: {
                data: [],
                selections: []
            },
            form: {},
            typeInfoId: '',
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            data1: '',
            data2: '',
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }],
            adminOptions: []
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
        isShow: {
            handler: function(n) {
                if (n) {
                    this.$nextTick(() => {
                        this.search.authType = 1
                        this.search.daterange = []
                        this.search.keyWord = ''
                        this.search.normalBol = true
                        this.getList()
                    })
                }
            },
            immediate: true
        }
    },
    created() {
        this.getList()
        // getStorage('TYPEID') 根据管理员类型 选择
        if (getStorage('TYPEID') === '1' || getStorage('TYPEID') === '0') {
            this.getAdminlist()
        }
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
            if (this.search.authType == 3 && !this.search.Mark && this.hastypedata) {
                this.$message.error('请选择填写权限类型对应数值')
                return
            }
            if (this.search.authType === 2 && (!this.data1 || !this.data2) && this.hastypedata) {
                this.$message.error('请选择填写权限类型对应数值')
                return
            }
            if (this.hasadmintype && !this.typeInfoId) {
                this.$message.error('请选择归属产品')
                return
            }
            let markObj = {}
            if (this.hastypedata) {
                if (this.search.authType === 1) {
                    markObj = {
                        BooleanValue: this.search.normalBol,
                        type: 1
                    }
                } else if (this.search.authType === 2) {
                    markObj = {
                        DataRangStart: this.data1,
                        DataRangEnd: this.data2,
                        type: 2
                    }
                } else if (this.search.authType === 3) {
                    markObj = {
                        IntValue: this.search.Mark,
                        type: 3
                    }
                } else if (this.search.authType === 4) {
                    markObj = {
                        // MarkVerionMsg: this.search.Mark,
                        MarkVerionMsg: '',
                        type: 4
                    }
                }
            }

            this.$emit('add', this.table.selections, this.search.daterange, markObj, this.typeInfoId)
        },
        typeChange(n) {
            this.getList()
            this.table.selections = []
            // this.$refs['authSelect'].clearSelection()
            if (this.hastypedata) {
                this.search.Mark = ''
            }
        },
        getAdminlist() {
            fetchAdminlist().then(res => {
                this.adminOptions = res || []
            })
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
    width:47%;
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
