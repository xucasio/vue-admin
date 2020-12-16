<template>
  <div>
    <div class="form-search">
      <div class="filter-item">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索权限名称"
          class="input-with-select">
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="getList"/>
        </el-input>
      </div>
    </div>
    <cs-table
      ref="authSelect"
      :data="table.data"
      :total="page.total"
      :pagesize="page.size"
      :pageindex="page.current"
      :reserve-selection="true"
      :row-key="'ID'"
      :height="(screenHeight-440)"
      hasindex
      haspage
      @pageChange="pageChange">
      <el-table-column
        label="权限ID"
        min-width="80"
        header-align="center"
        prop="ID"/>
      <el-table-column
        label="权限类型"
        min-width="80"
        header-align="center"
      >
        <template slot-scope="{row}">
          <span>{{ roleTypeMap[row.Value.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="权限名称"
        header-align="center"
        min-width="300"
        prop="Name"/>
      <el-table-column
        label="权限值"
        min-width="300"
        align="center">
        <template slot-scope="{row}">
          <!-- <span v-if="row.Value.type === 1">return Val.BooleanValue</span> -->
          <el-select
            v-if="row.Value.type === 1"
            v-model="row.BooleanValue"
            placeholder=""
            style="width:100%">
            <el-option
              v-for="(item,index) in [{ val: true,name: 'true'},{val: false,name: 'false' }]"
              :key="index"
              :label="item.name"
              :value="item.val"/>
          </el-select>
          <div
            v-else-if="row.Value.type === 2"
            class="item">
            <el-input
              v-model="row.DataRangStart"
              oninput="value=value.replace(/[^\d]/g,'')" />
            -
            <el-input
              v-model="row.DataRangEnd"
              oninput="value=value.replace(/[^\d]/g,'')"/>
          </div>
          <div
            v-else-if="row.Value.type === 3"
            class="item">
            <el-input
              v-model="row.IntValue"
              oninput="value=value.replace(/[^\d]/g,'')" />
          </div>
          <span v-if="row.Value.type === 4">-</span>

        </template>
      </el-table-column>
    </cs-table>
    <div class="footer">
      <el-button
        type="primary"
        @click="addAuth">确认</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getStorage } from '@/utils/auth'
export default {
    name: 'AuthSelect',
    props: {
        selections: {
            type: Array,
            default: () => []
        },
        isShow: {
            type: Boolean,
            default: false
        },
        rolelist: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: {
                keyWord: ''
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
            PriorityTypeOptions: [{ name: '允许优先', id: 0 }, { name: '拒绝优先', id: 1 }, { name: '最小值优先', id: 2 }, { name: '最大值优先', id: 3 }],
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
        isShow: {
            handler: (n) => {
                if (n) {
                    try {
                        // this.search.keyWord = ''
                    } catch (error) {
                        // console.log('异常', this, this.search)
                    }
                }
            },
            immediate: false
        },
        rolelist: {
            handler: function(n) {
                console.log('rolelist', this.rolelist)
                this.getList()
            },
            deep: true
        }
    },
    created() {
        this.getList()
        console.log('rolelist', this.rolelist)
    },
    methods: {
        getList() {
            // const data = this.getData()
            if (!this.search.keyWord) {
                this.table.data = this.rolelist.slice((this.page.current - 1) * this.page.size, this.page.current * this.page.size)
                this.page.total = this.rolelist.length
            } else {
                this.filterList(this.search.keyWord)
            }
        },
        filterList(key) {
            const list = this.table.data.filter(item => {
                return item.Name.indexOf(key) > -1
            })
            this.page.total = list.length || 0
            this.table.data = list.slice(0, this.page.size)
        },
        getData() {
            const data = {
                condition: {
                    'adminTypeInfoID': getStorage('PTYPEID'),
                    'conditionValue': this.search.keyWord,
                    authType: this.search.authType,
                    'state': 0,
                    'customerType': 0,
                    'register_Type': 0
                },
                pageIndex: this.page.current,
                pageSize: this.page.size

            }
            return data
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
            this.$emit('add', this.table.data)
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
.item{
  display: flex;
  align-items: center;

}
</style>
<style lang="scss">
  .is-error{
    .el-input__inner{
      border: 1px solid #F56C6C;
    }
  }
</style>
