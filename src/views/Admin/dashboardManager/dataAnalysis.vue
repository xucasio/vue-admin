<template>
  <div id="dataAnalysis">
    <div class="content-row">
      <cs-row-tab :title="isAppUser?appname+'权限数据统计':'权限数据统计'"/>
    </div>
    <div class="application">
      <div
        v-if="!isAppUser()"
        class="application">
        <span class="label">产品选择:</span>
        <el-select
          v-model="appMark"
          placeholder="请选择"
          @change="appChange">
          <el-option
            v-for="item in appOptions"
            :key="item.ApplicationMark"
            :label="item.Name"
            :value="item.ApplicationMark"/>
        </el-select>
      </div>
    </div>
    <div class="datas">
      <div class="item qxsl">
        <p class="label">权限数量</p>
        <p class="val">{{ anDatas.AuthorityTotalCount|numsplit }}</p>
      </div>
      <div class="item jssl">
        <p class="label">角色数量</p>
        <p class="val">{{ anDatas.RoleTotalCount|numsplit }}</p>
      </div>
      <div class="item mrqxsz">
        <p class="label">默认权限数量</p>
        <p class="val">{{ anDatas.DefaultTotalCount|numsplit }}</p>
      </div>
    </div>
    <div class="content-row">
      <cs-row-tab title="B端数据统计"/>
    </div>
    <div class="datas">
      <div class="item">
        <p class="label">组织数量</p>
        <p class="val">{{ getOrgData(buserDatas,1)+getOrgData(buserDatas,2)|numsplit }}</p>
        <div
          :style="{height: isOrgSlide?'130px':'0'}"
          class="sli-block">
          <div class="sli-content">
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/xuexiao_icon.png"
                  alt="" >
              </span>
              <span class="name">学校：</span>
              <span class="val">{{ getOrgData(buserDatas,2) }}</span>
            </div>
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/jigou_icon.png"
                  alt="" >
              </span>
              <span class="name">机构：</span>
              <span class="val">{{ getOrgData(buserDatas,1) }}</span>
            </div>
          </div>
        </div>
        <p
          class="btn"
          @click="isOrgSlide=!isOrgSlide">
          <i :class="!isOrgSlide?'el-icon-arrow-down':'el-icon-arrow-up'"/>
        </p>
      </div>
      <div class="item">
        <p class="label flex between">
          <span>标签数量</span>
          <span
            class="link"
            @click="openChart">查看</span>
        </p>
        <p class="val">{{ labelDatas.LabelTotalCount|numsplit }}</p>
        <div
          :style="{height: isLabelSlide?'221px':'0'}"
          class="sli-block">
          <div class="sli-content">
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/labelmax_icon.png"
                  alt="" >
              </span>
              <span class="name">标签内最大权限数：</span>
              <span class="val">{{ labelDatas.LabelMaxAuthority|numsplit }}</span>
            </div>
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/labelmin_icon.png"
                  alt="" >
              </span>
              <span class="name">标签内最小权限数：</span>
              <span class="val">{{ labelDatas.LabelMinAuthorityCount|numsplit }}</span>
            </div>
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/orgmax_icon.png"
                  alt="" >
              </span>
              <span class="name">组织内标签最大数：</span>
              <span class="val">{{ labelDatas.OrganizaionMaxLabelCount|numsplit }}</span>
            </div>
            <div class="piece">
              <span class="img">
                <img
                  src="~@/assets/dashboard/orgmin_icon.png"
                  alt="" >
              </span>
              <span class="name">组织内标签最小数：</span>
              <span class="val">{{ labelDatas.OrganizaionMinLabelCount|numsplit }}</span>
            </div>
          </div>
        </div>
        <p
          class="btn"
          @click="isLabelSlide=!isLabelSlide">
          <i :class="!isLabelSlide?'el-icon-arrow-down':'el-icon-arrow-up'"/>
        </p>
      </div>
    </div>

    <cs-dialog
      :show="showChartDialog"
      :append-to-body="false"
      title="标签柱状图"
      width="800px"
      @close="closeChartDialog">
      <labelChart
        :labelchart="labelchart"
        :orgchart="orgchart"
        :isshow="showChartDialog"
        :is-show="showChartDialog"
        @close="closeChartDialog" />
    </cs-dialog>
  </div>
</template>
<script>
import labelChart from './labelChart'
import { fetchApplicationList } from '@/api/admin.js'
import { fetchAuthorityTotal, fetchBclientOrganizaiontotal, fetchLabelStatisticinfo } from '@/api/dashboard'
import { getStorage } from '@/utils/auth'
export default {
    name: 'DataAnalysis',
    components: {
        labelChart
    },
    filters: {
        numsplit: function(val) {
            if (!val) {
                return 0
            }
            var b = parseInt(val).toString()
            var len = b.length
            if (len <= 3) { return b }
            var r = len % 3
            return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
        }
    },
    data() {
        return {
            showChartDialog: false,
            isOrgSlide: false,
            isLabelSlide: false,
            appMark: '',
            appOptions: [],
            appname: '',
            anDatas: {},
            buserDatas: [],
            orgchart: [],
            labelchart: [],
            labelDatas: {}
        }
    },
    async mounted() {
        this.getUserRoleStatistic()
        this.getOrgNums()
        this.getLabelNUms()
        await this.getAppList()
        if (this.isAppUser()) {
            this.getAppname()
        }
    },
    methods: {
        openChart() {
            this.showChartDialog = true
        },
        closeChartDialog() {
            this.showChartDialog = false
        },
        isAppUser() {
            return +getStorage('TYPEID') === 3
        },
        getAppList() {
            return fetchApplicationList().then(res => {
                this.appOptions = res
            })
        },
        getAppname() {
            const obj = this.appOptions.find(item => {
                return item.ApplicationMark === getStorage('APPMARK')
            })
            this.appname = obj.Name || ''
        },
        appChange(val) {
            this.getUserRoleStatistic(val)
            this.getOrgNums(val)
        },
        getOrgNums(appMark) {
            let data = {}
            if (this.isAppUser()) {
                data = { ApplicationMark: getStorage('APPMARK') }
            }
            fetchBclientOrganizaiontotal(appMark ? data : { ApplicationMark: appMark }).then(res => {
                this.buserDatas = res || []
            })
        },
        getUserRoleStatistic(appMark) {
            let data = {}
            if (this.isAppUser()) {
                data = { ApplicationMark: getStorage('APPMARK') }
            }
            fetchAuthorityTotal(appMark ? { ApplicationMark: appMark } : data).then(res => {
                this.anDatas = res || {}
            })
        },
        getOrgData(arr, type) {
            const obj = arr.find(item => {
                return item.CustomerType == type
            })
            if (obj) {
                return obj.TotalCount
            } else {
                return 0
            }
        },
        getLabelNUms(appMark) {
            let data = {}
            if (this.isAppUser()) {
                data = { ApplicationMark: getStorage('APPMARK') }
            }
            fetchLabelStatisticinfo(appMark ? data : { ApplicationMark: appMark }).then(res => {
                this.labelDatas = res || {}
                this.labelchart = this.labelDatas.AuthorityTotalStatistic
                this.orgchart = this.labelDatas.LabelTotalStatistic
            })
        }
    }
}
</script>
<style lang="scss" scoped>
#dataAnalysis{
    .application{
      margin-top: 30px;
      .label{
        margin-right: 5px;
      }
    }
    .datas{
      display: flex;
      justify-content: flex-start;
      margin-top: 30px;
      margin-bottom: 60px;
      .item{
        min-width: 180px;
        max-width: 400px;
        height: 100%;
        flex: 1;
        box-shadow: 0px 1px 10px 0px rgba(45, 46, 47, 0.1);
        margin-right: 50px;
        position: relative;
        &:last-child{
          margin-right: 0;
        }
        .label{
          font-size: 16px;
          margin: 0;
          color: #3B3F5C;
          font-weight: bold;
          height: 48px;
          line-height: 50px;
          border-top: 2px solid #CFD9FE;
          border-bottom: 1px dashed #CFD9FE;
          padding-left: 24px;
        }
        &>.val{
          font-size: 30px;
          color: #3B3F5C;
          padding-left: 24px;
          font-weight: bold;
        }
        .link{
          color: $--color-main;
          margin-right: 24px;
          font-size: 14px;
          cursor: pointer;
        }
        .flex{
          display: flex;
        }
        .between{
          justify-content: space-between;
        }
      }
      .qxsl{
          background: #F1F4FE;
          background-image: url('../../../assets/dashboard/qxsl_bg.png');
          background-repeat: no-repeat;
          background-position: right bottom;
          .label{
          border-top: 2px solid #CFD9FE;
          }
        }
      .jssl{
          background: #FFF7F2;
          background-image: url('../../../assets/dashboard/jssl_bg.png');
          background-repeat: no-repeat;
          background-position: right bottom;
          .label{
          border-top: 2px solid #FFE0CA;
          }
        }
      .mrqxsz{
          background:#F7F2FF;
          background-image: url('../../../assets/dashboard/mrqxsz_bg.png');
          background-repeat: no-repeat;
          background-position: right bottom;
          .label{
          border-top: 2px solid #DBC4FF;
          }
        }
        .sli-block{
          position: relative;
          overflow: hidden;
          transition: height .5s;
          -moz-transition: height .5s;	/* Firefox 4 */
          -webkit-transition: height .5s;	/* Safari 和 Chrome */
          -o-transition: height .5s;	/* Opera */
          .sli-content{
            .piece{
              height: 45px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 20px;
              .img{
                margin-right: 10px;
              }
              .name{
                margin-right: 10px;
                font-size: 14px;
                display: inline-block;
                height: 32px;
                line-height: 30px;
                color: #3B3F5C;
                font-weight: 600;
              }
              .val{
                font-size: 20px;
                font-weight: 600;
                display: inline-block;
                height: 30px;
                line-height: 30px;
                color: #3B3F5C;
              }
              &:first-child{
                padding-top: 20px;
                border-top: 1px dashed #DBDDE5;
              }
              &:last-child{
                padding-bottom: 20px;
              }
            }

          }
        }
        .btn{
          position: absolute;
          width: 50px;
          height: 25px;
          background-color: #fff;
          border-radius: 50px 50px 0 0;
          box-shadow: 0px 1px 10px 0px rgba(45, 46, 47, 0.1);
          left: calc( 50% - 25px);
          bottom: -14px;
          text-align: center;
          line-height: 28px;
          cursor: pointer;
          &:hover{
            color: $--color-main;
          }
          i{
            &:hover{
              color: $--color-main;
            }
          }
        }
    }
}
</style>
