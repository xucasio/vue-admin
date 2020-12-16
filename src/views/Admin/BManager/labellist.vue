<template>
  <div class="views-content">
    <div class="views-search">
      <div
        class="fliter-content">
        <el-row
          :gutter="20"
          class="filter-view">
          <el-col
            :span="6"
            class="filter-item">
            <el-input
              v-model="key"
              placeholder="标签名称、标签描述 "
              @keyup.enter.native="handleSearch"/>
          </el-col>
          <el-col
            :span="6"
            class="filter-item">
            <el-button
              type="primary"
              @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div/>
      <div class="search-btns">
        <el-button
          v-if="points.indexOf('ADD')>-1"
          icon="iconfont iconxinzeng"
          @click="gotoAdd">新增标签</el-button>
        <el-button
          v-if="points.indexOf('SELECT')>-1"
          @click="watchUsers">展示成员列表</el-button>
        <el-button
          v-if="points.indexOf('SELECT')>-1"
          @click="watchAuths">查看所有权限</el-button>
        <el-button
          v-if="points.indexOf('SELECT')>-1"
          @click="watchUserState">查看用户授权状态</el-button>
      </div>
    </div>
    <cs-table
      ref="cstable"
      :data="data"
      :total="total"
      :pagesize="pagesize"
      :pageindex="pageindex"
      :height="(screenHeight-340)"
      haspage
      hasindex
      hasselection
      @selection-change="handleSelectionChange"
      @pageChange="pageChange">
      <el-table-column
        label="标签名称"
        min-width="100"
        header-align="center"
        show-overflow-tooltip
        prop="LABEL_NAME"/>
      <el-table-column
        label="权限范围"
        header-align="center"
        min-width="100"
        show-overflow-tooltip
        prop="LABEL_AUTHS_STRING"/>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        header-align="center"
        min-width="100"
        prop="LABEL_DESCRIBE"/>
      <el-table-column
        label="状态"
        width="100"
        align="center"
        show-overflow-tooltip
        header-align="center"
        prop="STATE">
        <template slot-scope="scope">
          <span :class="['font-color-label', 'state'+scope.row.STATE]"> {{ labelState(scope.row.STATE) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <div class="table-manage">
            <el-tooltip
              content="生成口令"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('GENERATEPASS')>-1&&scope.row.STATE===2"
                icon="iconshengchengkouling"
                @click.native="handleCreate(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="激活"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('ACTIVE')>-1&&(scope.row.STATE===1||scope.row.STATE===3)"
                icon="iconjihuo"
                @click.native="handleActive(scope.row)"/>
            </el-tooltip>
            <el-tooltip
              content="编辑"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('UPDATE')>-1"
                icon="iconguanli-bianji"
                @click.native="handleUpdate(scope.row.LABEL_ID)"/>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
              effect="light">
              <cs-round-button
                v-if="points.indexOf('DEL')>-1"
                icon="iconshanchu"
                @click.native="handleDelete(scope.row)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </cs-table>
    <cs-dialog
      :show="showListDialog"
      :append-to-body="false"
      width="800px"
      title="成员列表"
      @close="closeListDialog">
      <StudentList
        v-if="showListDialog"
        :labels="curLabels"
        @close="closeListDialog"
      />
    </cs-dialog>
    <cs-dialog
      :show="showCreateDialog"
      :append-to-body="false"
      width="450px"
      title="生成口令"
      @close="closeCreateDialog">
      <CreatePWd
        v-if="showCreateDialog"
        :label="curLabel"
        @close="closeCreateDialog"
      />
    </cs-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { fetchLabelList, fetchLabelUpdateState } from '@/api/label.js'
import StudentList from './studentlist.vue'
import CreatePWd from './createpwd'
import { getStorage } from '@/utils/auth'
export default {
    name: 'ManagerList',
    components: { StudentList, CreatePWd },
    data() {
        return {
            key: '',
            showListDialog: false,
            showCreateDialog: false,
            data: [],
            curLabels: [],
            total: 0,
            pagesize: 10,
            pageindex: 1,
            curLabel: {}
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight,
            MENUS: state => state.admin.menus
        })
    },
    mounted() {
        this.getList()
        console.log('points:', this.points, this.MENUS)
    },
    methods: {
        gotoAdd() {
            this.$router.push({ path: this.isBuser() ? '/bsysright/addlabel' : '/sysright/addlabel' })
        },
        handleSearch() {
            this.pageindex = 1
            this.getList()
        },
        getList() {
            var data = {
                'Condition': {
                    'AdminTypeInfoID': getStorage('PTYPEID'),
                    'ConditionValue': this.key
                },
                'PageIndex': this.pageindex,
                'PageSize': this.pagesize,
                'AcsFiles': [
                ],
                'DescFiles': [
                ]
            }
            this.showLoading('.cs-table')
            fetchLabelList(data).then(res => {
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
        closeListDialog() {
            this.showListDialog = false
        },
        pageChange(ps, pi) {
            this.pageindex = pi
            this.pagesize = ps
            this.getList()
        },
        labelState(v) {
            var list = ['', '禁用', '激活', '待激活', '删除']
            return list[v]
        },
        watchUsers() {
            if (this.curLabels.length <= 0) {
                this.$message.error('请选择标签！')
                return
            }
            this.showListDialog = true
        },
        handleSelectionChange(val) {
            this.curLabels = val
        },
        handleDelete(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-error"></i> 是否确定删除 ' + row.LABEL_NAME + '？ 删除后标签相关数据将会被清除！</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchLabelUpdateState({ 'LabelState': 4, 'LabelID': row.LABEL_ID }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleActive(row) {
            this.$confirm('<div class="alert-tips"><i class="alert-warning"></i> 是否确定激活 ' + row.LABEL_NAME + '？ 激活后标签内成员可使用标签范围内的所有权限！</div> ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                fetchLabelUpdateState({ 'LabelState': 2, 'LabelID': row.LABEL_ID }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleUpdate(id) {
            this.$router.push({ path: this.isBuser() ? '/bsysright/addlabel' : '/sysright/addlabel', query: { labelid: id }})
        },
        handleCreate(row) {
            this.showCreateDialog = true
            this.curLabel = row
        },
        closeCreateDialog() {
            this.showCreateDialog = false
        },
        watchAuths() {
            this.$router.push('/role/authList2')
        },
        watchUserState() {
            this.$router.push('/home/user')
        },
        isBuser() {
            return +getStorage('TYPEID') === 4
        }
    }
}
</script>
