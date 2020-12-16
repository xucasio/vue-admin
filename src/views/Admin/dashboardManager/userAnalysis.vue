<template>
  <div id="userAnalysis">
    <el-row>
      <el-col :span="10">
        <div
          class="views-content analysis-content"
          style="margin-right: 0;">
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
                :value="item.ApplicationMark" />
            </el-select>
          </div>
          <div
            v-else
            class="content-row mb30">
            <cs-row-tab :title="'当前产品：'+appname"/>
          </div>
          <div class="datas">
            <div class="item">
              <p class="label dqdls">当月登录数</p>
              <p class="val">{{ (anDatas.UserLoginTotal||0)|numsplit }}</p>
            </div>
            <div class="item">
              <p class="label dydls">当月注册数</p>
              <p class="val">{{ (anDatas.RegisterTotal||0)|numsplit }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14" >
        <div class="views-content analysis-content" >
          <div class="content-row mb30">
            <cs-row-tab title="权限数据统计"/>
          </div>
          <div class="grid">
            <div class="li li_fm">
              <p class="key">累计用户数</p>
              <p class="value fm">{{ (anDatas.UserTotal||0)|numsplit }}</p>
            </div>

            <div class="li bld">
              <p class="key">禁用用户</p>
              <p class="value">{{ (anDatas.DisableUserTotalt||0)|numsplit }}</p>
            </div>
            <div class="li">
              <p class="key">强制下线用户</p>
              <p class="value">{{ (anDatas.LoginOutTotal||0)|numsplit }}</p>
            </div>
            <div class="li brd">
              <p class="key">信息缺失用户</p>
              <p class="value">{{ (anDatas.UserInfoDefectTotal||0)|numsplit }}</p>
            </div>
            <div class="li">
              <p class="key">管理员数量</p>
              <p class="value">{{ (anDatas.AdminTotal||0)|numsplit }}</p>
            </div>
            <div class="li">
              <p class="key">管理员种类</p>
              <p class="value">{{ (anDatas.AdminTypeTotal||0)|numsplit }}</p>
            </div>
          </div>

      </div></el-col>
    </el-row>

    <div class="views-content chart-content">
      <div class="chart-t">
        <div class="application">
          <span class="label">类型:</span>
          <el-select
            v-model="type"
            placeholder="请选择"
            @change="typeChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="timeSelect">
          <div>
            <el-radio-group v-model="timeselect">
              <el-radio-button label="年"/>
              <el-radio-button label="月"/>
              <el-radio-button label="日"/>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div
        id="myChart1"
        :style="{width: '100%', height: '600px'}"
        style="display:block;"
      />
    </div>
    <!-- <div class="views-content pie-content"/> -->
  </div>

</template>
<script>
// import 'echarts/lib/chart/bar'
import { fetchUserinfoStatistic, queryUserStatistics } from '@/api/dashboard'
import { fetchApplicationList } from '@/api/admin.js'
import { getStorage } from '@/utils/auth'
export default {
    filters: {
        numsplit: function(val) {
            var b = parseInt(val).toString()
            var len = b.length
            if (len <= 3) { return b }
            var r = len % 3
            return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
        }
    },
    data() {
        return {
            appMark: '',
            appname: '',
            timeselect: '月',
            type: 0,
            typeOptions: [{ id: 0, name: '用户增长' }, { id: 1, name: '用户登录' }],
            option: {
                title: {
                    text: '用户增长图表',
                    subtext: '用户增长数量和增长率',
                    left: 'center',
                    top: '0',
                    textStyle: {
                        fontSize: 24
                    },
                    subtextStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            show: true,
                            backgroundColor: '#fff',
                            color: '#556677',
                            borderColor: 'rgba(0,0,0,0)',
                            shadowColor: 'rgba(0,0,0,0)',
                            shadowOffsetY: 0
                        },
                        lineStyle: {
                            width: 0
                        }
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: '#5c6c7c'
                    },
                    padding: [10, 10],
                    extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
                    // formatter: '{b0}: {c0}<br />{b1}: {c1}'
                    formatter: `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#5157CA;margin-right:5px"></span>{a0}: {c0}人
                                <br />
                                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#FCBD57;margin-right:5px"></span>{a1}: {c1}%`
                },
                grid: {
                    top: '100px',
                    left: '6%',
                    // right: '1%',
                    // bottom: '50px',
                    // backgroundColor: '#fff',
                    width: '88%' // 图例宽度
                    // height: '90%' // 图例高度

                },
                legend: {
                    bottom: '0',
                    left: 'center',
                    textStyle: {
                        color: '#556677'
                    },
                    data: ['人数', '百分比']
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: [{
                    type: 'value',
                    name: '人数',
                    axisLabel: {
                        formatter: '{value} 人'
                    }
                }, {
                    type: 'value',
                    name: '百分比',
                    splitLine: { show: false }, // 去除网格线
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }],
                series: [
                    {
                        name: '人数',
                        type: 'bar',
                        smooth: true,
                        data: [0, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 0],
                        barWidth: '30px',
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#5157CA'// 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#8D92FA'// 100% 处的颜色
                                }], false)
                            },
                            emphasis: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#7479d5'// 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#a3a7fa'// 100% 处的颜色
                                }], false)
                            }
                        }
                    },
                    {
                        name: '百分比',
                        yAxisIndex: 1,
                        type: 'line',
                        color: '#FCBD57',
                        data: [],
                        lineStyle: {
                            width: 2,
                            shadowColor: 'rgba(203, 73, 81, 0.6)', // 设置折线阴影
                            shadowBlur: 8
                        }
                    }
                ]
            },
            anDatas: {},
            appOptions: []
        }
    },
    watch: {
        'timeselect': function(n) {
            this.getChartData()
        }
    },
    async mounted() {
        this.getUserinfoStatistic()
        this.drawLine()
        const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
        await this.getAppList()
        if (this.isAppUser()) {
            this.getAppname()
        }
        this.getChartData()
        window.onresize = function() {
            myChart1.resize()
        }
    },
    methods: {
        // 柱状图
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            const myChart1 = this.$echarts.init(document.getElementById('myChart1'))

            myChart1.setOption(this.option)
        },
        getUserinfoStatistic() {
            let data = {}
            if (this.isAppUser()) {
                data = { ApplicationMark: getStorage('APPMARK') }
            }
            fetchUserinfoStatistic(data).then(res => {
                this.anDatas = res || {}
            })
        },
        getAppList() {
            return fetchApplicationList().then(res => {
                this.appOptions = res
            })
        },
        appChange(val) {
            fetchUserinfoStatistic({ ApplicationMark: val }).then(res => {
                this.anDatas = res || {}
            })
        },
        typeChange(val) {
            this.option.title.text = val ? '用户登录图表' : '用户增长图表'
            this.option.title.subtext = val ? '用户登录数量和增长率' : '用户增长数量和增长率'
            this.getChartData()
        },
        isAppUser() {
            // console.log('是否产品管理员', +getStorage('TYPEID') === 3)
            return +getStorage('TYPEID') === 3
        },
        getAppname() {
            const obj = this.appOptions.find(item => {
                return item.ApplicationMark === getStorage('APPMARK')
            })
            this.appname = obj.Name || ''
        },
        getChartData() {
            queryUserStatistics({ dType: this.type, Type: this.getTimeType(this.timeselect) }).then(res => {
                this.option.xAxis.data = res.map(item => item.STATISTICSDATE || 0)
                this.option.series[0].data = res.map(item => item.USERTOTAL || 0)
                this.option.series[1].data = res.map(item => parseFloat(item.USERINCREASERATE || 0).toFixed(2))
                this.drawLine()
            })
        },
        getTimeType(key) {
            let num
            switch (key) {
                    case '日':
                        num = 1
                        break
                    case '月':
                        num = 2
                        break
                    case '年':
                        num = 3
                        break
            }
            return num
        }
    }
}

</script>
<style lang="scss" scoped>
#userAnalysis{
  min-width: 1280px;
  .analysis-content{
    margin-bottom: 15px;
    .application{
      margin-bottom: 30px;
      .label{
        margin-right: 5px;
      }
    }
    .datas{
      display: flex;
      justify-content: space-around;
      .item{
        min-width: 180px;
        flex: 1;
        height: 150px;
        box-shadow: 0px 1px 10px 0px rgba(45, 46, 47, 0.1);
        margin-right: 30px;
        &:last-child{
          margin-right: 0;
        }
        .label{
          font-size: 16px;
          margin: 0;
          color: #3B3F5C;
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
        .block{
          display: flex;
          height: 100px;
          align-items: center;
          justify-items: center;
          .li{
            flex: 1;
            text-align: center;
            min-width: 90px;
            &>.key{
              font-size: 12px;
              color: #3B3F5C;
              margin: 0;
              margin-bottom: 15px;
            }
            &>.value{
              font-size: 20px;
              font-weight: bold;
              color: #3B3F5C;
              margin: 0;
            }
          }
        }
        .ljyh{ border-top: 2px solid #CFD9FE; }
        .dqdls{ border-top: 2px solid #DBC4FF; }
        .dydls{ border-top: 2px solid #CFD9FE; }
        .yh{ border-top: 2px solid #FDBEDA; }
        .gly{ border-top: 2px solid #BAFEF0; }
      }
    }
    .grid{
      display: flex;
      justify-content: space-around;
      .li{
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        height: 70px;
        padding-bottom: 20px;
        margin: 30px 0;
        min-width: 110px;
        .key{
          margin-bottom: 40px;
          font-size: 16px;
        }
        .value{
          font-size: 24px;
          font-weight: bold;
          color: #3B3F5C;
        }
        .fm{
          font-size: 30px;
          color: $--color-main;
        }
        p{
          margin: 0;
          text-align: center;
        }
      }
      .li_fm{
        height: 70px;
        padding-right: 15px;
        .key{
          margin-bottom: 35px;
        }
      }
      .bld{
        border-left: 1px dashed #DBDDE5;
      }
      .brd{
        border-right: 1px dashed #DBDDE5;
        padding-right: 10px;
      }
    }
  }
  .chart-content{
    .chart-t{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      .application{
        .label{
          margin-right: 5px;
        }
      }
    }
  }
  .mb30{
    margin-bottom: 42px;
  }
}
</style>
