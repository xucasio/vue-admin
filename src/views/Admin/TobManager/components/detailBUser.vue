<template>
  <div>
    <div class="info">当前账号数量：{{ page.total }}</div>
    <div class="form-search">
      <div
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="关键字查询"
          class="input-with-select" >
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="getList"/>
        </el-input>
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
      haspage
      @pageChange="pageChange">
      <el-table-column
        label="序号"
        min-width="60">
        <template slot-scope="scope">
          <span>{{ (page.current - 1) * page.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账号"
        show-overflow-tooltip
        min-width="80"
        prop="LoginName"/>
      <el-table-column
        label="姓名"
        prop="UserName"/>
      <el-table-column
        label="手机号"
        prop="MobilePhone"/>
      <el-table-column
        label="联系电话"
        prop="TELEPHONE"/>
      <el-table-column
        label="联系邮箱"
        prop="EMAIL"/>
      <el-table-column
        label="学校/公司名称"
        prop="COMPANY"/>
      <el-table-column
        label="用户状态"
        prop="STATE">
        <template slot-scope="{row}">
          {{ stateMap[row.STATE] }}
        </template>
      </el-table-column>
    </cs-table>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchUserDeleteBUserDetail } from '@/api/user.js'
import { userState } from '@/utils/basedata.js'

export default {
    name: 'DetailBUser',
    props: {
        id: {
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
            search: {
                keyWord: '',
                daterange: []
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
            stateOptions: userState
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        }),
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
            const data = this.getData(this.id)
            fetchUserDeleteBUserDetail(data).then(res => {
                this.table.data = res.Data.map(item => {
                    const { LoginName, UserName, MobilePhone, Email, Company, State } = item
                    return { LoginName, UserName, MobilePhone, Telephone: item.LoginUserInfo.Telephone, Email, Company, State }
                }) || []
                this.page.total = res.Total || 0
            })
        },
        getData(id) {
            const data = {
                Condition: {
                    'AdminTypeInfoID': this.id,
                    'ConditionValue': this.search.keyWord
                },
                PageIndex: this.page.current,
                PageSize: this.page.size
            }
            // const data = {
            //     'AdminTypeInfoID': id,
            //     'keyWord': this.search.keyWord,
            //     'pageIndex': this.page.current,
            //     'pageSize': this.page.size
            // }
            return data
        },
        pageChange(size, current) {
            this.page.current = current
            this.page.size = size
            this.getList()
        }
    }
}
</script>
<style lang="scss" scoped>
.info{
  padding-bottom: 10px;
}
.form-search{
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  .filter-item{
    display: flex;
    flex-direction: row;
    .label{
      line-height: 36px;
      padding: 0 4px;
      width: 50px;
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
.footer{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
