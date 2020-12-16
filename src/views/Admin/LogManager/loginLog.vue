<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="18"
            class="filter-item">
            <span>时间区间：</span>
            <el-date-picker
              v-model="range"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="rangeChange"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索用户名、姓名"
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
      :height="(screenHeight-340)"
      :pageindex="pageindex"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="用户名"
        align="center"
        show-overflow-tooltip
        prop="OPERATE_LOGIN_NAME"/>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        align="center"
        prop="OPERATE_MOBILEPHONE"/>
      <el-table-column
        label="产品"
        show-overflow-tooltip
        align="center"
        prop="NAME"/>
      <el-table-column
        label="姓名"
        show-overflow-tooltip
        align="center"
        prop="OPERATE_USER_NAME"/>
      <el-table-column
        show-overflow-tooltip
        label="登录时间"
        align="center"
        prop="OPERATE_TIME"/>
      <el-table-column
        show-overflow-tooltip
        label="登录IP"
        align="center"
        prop="CLIENT_IP"/>
      <el-table-column
        show-overflow-tooltip
        label="登录来源"
        align="center"
        prop="AdminTypeName"/>
    </cs-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchLoginLog } from '@/api/log'
import { getStorage } from '@/utils/auth.js'
import api from '@/api/api'
import common from '@/utils/common.js'
import { parseTime } from '@/utils'

export default {
    name: 'LoginLog',
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            pagesize: 10,
            pageindex: 1,
            total: 0,
            range: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
            StartTime: parseTime(new Date(), '{y}-{m}-{d}'),
            EndTime: parseTime(new Date(), '{y}-{m}-{d}')
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'Keyword': this.key,
                    'StartTime': this.StartTime,
                    'EndTime': this.EndTime
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            this.showLoading('.cs-table')
            fetchLoginLog(data).then(res => {
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
            var url = api.upmshost + 'api/System/exportloginlog' + conditionStr
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
            common.downLoadFile(url, '登陆日志.xlsx')
        },
        rangeChange(arr) {
            if (arr.length) {
                this.StartTime = arr[0]
                this.EndTime = arr[1]
            }
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
</style>
