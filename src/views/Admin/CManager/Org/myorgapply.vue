<template>
  <div>
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="12"
            class="filter-item">
            <el-button
              type="primary"
              plain
              @click="gotoApplay">申请</el-button>
          </el-col>
          <!-- <el-col
            :span="6"
            class="filter-item">
            申请类型：
            <el-select v-model="cusType">
              <el-option
                v-for="cs in customerTypes"
                :key="cs.id"
                :value="cs.id"
                :label="cs.name"/>
            </el-select>
          </el-col> -->
          <el-col
            :span="6"
            :offset="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="请搜索名称、原因"/>
            <el-button
              style="margin-left:10px"
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>

        </el-row>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      :height="(screenHeight-380)"
      haspage
      hasindex
      @pageChange="pageChange">
      <el-table-column
        label="名称"
        header-align="center"
        show-overflow-tooltip
        prop="ORGANIZAION_NAME"/>
      <!-- <el-table-column
        label="类型"
        show-overflow-tooltip
        header-align="center"
        width="150"
        align="center"
        prop="CustomerType">
        <template slot-scope="scope">
          {{ getcustomerType(scope.row.CustomerType) }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="申请状态"
        show-overflow-tooltip
        header-align="center"
        width="150"
        align="center"
        prop="APPROVAL_STATE">
        <template slot-scope="scope">
          <span :class="['font-color-approve', 'state'+scope.row.APPROVAL_STATE]"> {{ labelAPLState(scope.row.APPROVAL_STATE) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="原因"
        show-overflow-tooltip
        header-align="center"
        width="400"
        prop="APPROVAL_REASON"/>
    </cs-table>
    <cs-dialog
      :show="showApplayDialog"
      :append-to-body="false"
      width="500px"
      title="申请"
      @close="closeDialog">
      <Applay
        v-if="showApplayDialog"
        @success="Succsee"
        @close="closeDialog"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchBClientUser, fetchDelBclientManager } from '@/api/admin'
import { fetchQueryuserorganizaionapply } from '@/api/label'
import { getStorage } from '@/utils/auth.js'
import { customer_Type } from '@/utils/basedata'
import Applay from './apply.vue'

export default {
    name: 'OrgApply',
    components: { Applay },
    data() {
        return {
            data: [],
            Admins: [],
            adminType: 0,
            key: '',
            cusType: 0,
            pagesize: 10,
            pageindex: 1,
            total: 0,
            customerTypes: customer_Type,
            showApplayDialog: false
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
                    USER_ID: getStorage('USERID'),
                    APPROVAL_STATE: 0,
                    CUSTOMER_TYPE: this.cusType,
                    'Keyword': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            fetchQueryuserorganizaionapply(data).then(res => {
                this.data = res.Data
                this.total = res.Total
                this.$nextTick(() => {
                    this.$refs.cstable.doLayout()
                })
            })
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },

        gotoApplay() {
            this.showApplayDialog = true
        },
        closeDialog() {
            this.showApplayDialog = false
        },
        Succsee() {
            this.getList()
            this.showApplayDialog = false
        },
        labelAPLState(v) {
            var list = ['', '待审批', '已审批', '已拒绝']
            return list[v]
        },
        getcustomerType(state) {
            var ct = customer_Type.find(f => f.id === state)
            if (ct) {
                return ct.name
            }
            return ''
        }

    }
}
</script>
