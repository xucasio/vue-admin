<template>
  <div>
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="6"
            class="filter-item">
            <span class="label">时间区间：</span>
            <el-date-picker
              v-model="range"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="rangeChange"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <span class="label">权限类型：</span>
            <el-select
              v-model="type"
              placeholder="请选择">
              <el-option
                v-for="item in roleTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
          <el-col
            v-if="!isApplicationUser"
            :span="6"
            class="filter-item">
            <span class="label">所属产品：</span>
            <el-select
              v-model="appId"
              placeholder="请选择产品名称">
              <el-option
                v-for="(item,index) in productOptions"
                :key="index"
                :label="item.Name"
                :value="item.ID"/>
            </el-select>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索用户名、姓名、名称"
              @keyup.enter.native="handleSearch"/>
            <el-button
              style="margin-left:10px"
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>

        </el-row>
        <div class="search-btns">
          <el-button
            type="text"
            @click="exportData">导出数据</el-button>
          <span class="tips">温馨提示：由于登录日志数据过多，系统自动清理6个月之前的数据</span>
        </div>

      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :height="(screenHeight-410)"
      :pageindex="pageindex"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="用户名"
        header-align="center"
        show-overflow-tooltip
        prop="LOGIN_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        header-align="center"
        prop="MOBILEPHONE"/>
      <el-table-column
        label="姓名"
        header-align="center"
        show-overflow-tooltip
        prop="USER_NAME"/>
      <el-table-column
        show-overflow-tooltip
        label="名称"
        align="center"
        header-align="center"
        prop="APPLICATION_NAME">
        <template slot-scope="{row}">
          <el-tag
            :title="row.Type===0?'角色':'权限'"
            :type="row.Type===0?'success':'warning'">{{ row.NAME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="权限类型"
        show-overflow-tooltip
        header-align="center"
        prop="AUTHORITY_TYPE">
        <template slot-scope="{row}">
          <span>{{ roleTypeMap[row.AUTHORITY_TYPE] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="所属产品"
        align="center"
        header-align="center"
        prop="APPLICATION_NAME"/>
      <el-table-column
        show-overflow-tooltip
        label="到期时间"
        align="center"
        header-align="center"
        prop="END_TIME"/>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'
import { fecthApplicationList } from '@/api/role.js'
import { fetchNoticePersonalList, testExport } from '@/api/notice.js'
import { getStorage } from '@/utils/auth.js'
import { parseTime } from '@/utils'
import api from '@/api/api'
import common from '@/utils/common.js'

export default {
    name: 'PersonalRole',
    data() {
        return {
            data: [],
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            range: [],
            type: 0, // 操作类型
            StartTime: '',
            EndTime: '',
            appId: (getStorage('PTYPEID') == 0 || getStorage('PTYPEID') == 10) ? 0 : getStorage('APPID'), // 选择产品Id
            productOptions: [], // 产品列表
            roleTypeOptions: [{ name: '全部', id: 0 }, { name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }],
            isApplicationUser: !(getStorage('PTYPEID') == 0 || getStorage('PTYPEID') == 10)
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
    mounted() {
        this.getList()
        this.getProducts()
    },
    methods: {
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getData() {
            const data = {
                'AdminTypeInfoID': (getStorage('TYPEID') == 0 || getStorage('TYPEID') == 10) ? 0 : getStorage('PTYPEID'),
                'Condition': {
                    'Keyword': this.key,
                    'StartTime': this.StartTime,
                    'EndTime': this.EndTime,
                    'Type': this.type,
                    'ApplicationId': this.appId
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            return data
        },
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            fetchNoticePersonalList(data).then(res => {
                this.data = res.Data
                this.total = res.Total
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                    this.hideLoading()
                })
            }).catch(ex => {
                this.hideLoading()
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        exportData() {
            const Token = getStorage('TOKEN')
            const typeid = getStorage('TYPEID')
            const typeinfoid = getStorage('PTYPEID')
            const conditionStr = '?token=' + Token + '&typeid=' + typeid + '&typeinfoid=' + typeinfoid + '&PageIndex=' + this.pageindex + '&PageSize=' + this.pagesize
            const search = {
                ApplicationId: this.appId,
                EndTime: this.EndTime,
                Keyword: this.key,
                StartTime: this.StartTime,
                Type: this.type
            }
            var url = api.upmshost + 'api/Label/exportorganizaionexpireuserauthority' + conditionStr
            Object.keys(search).forEach(m => {
                if (search[m] || search[m] === 0) {
                    if (m === 'roles') {
                        var urlStr = ''
                        search[m].forEach(e => {
                            urlStr += '&Condition.' + m + '=' + e
                        })
                        url += urlStr
                    } else {
                        url += ('&Condition.' + m + '=' + search[m])
                    }
                }
            })

            common.downLoadFile(url, '用户过期权限列表.xlsx')
        },
        rangeChange(arr) {
            if (arr.length) {
                this.StartTime = arr[0]
                this.EndTime = arr[1]
            }
        },
        getProducts() {
            fecthApplicationList().then(res => {
                this.productOptions = res || []
                this.productOptions.unshift({ Name: '全部', ID: 0 })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.tips{
  margin-left: 10px;
  color: #666;
}
.views-search{
  margin-bottom: 5px !important;
}
.search-btns{
  padding-top: 20px !important;
}
.label{
  display: inline-block;
  min-width: 80px;
  margin-left: 10px;
  text-align: right;
  &:first-child{
    margin-left: 0px;
  }
}
</style>
