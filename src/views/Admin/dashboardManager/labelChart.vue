<template>
  <div>
    <div
      id="labelChart1"
      :style="{width: '95%', height: '300px'}"
      style="margin:10px auto;display:block;"
    />
    <div
      id="labelChart2"
      :style="{width: '95%', height: '300px'}"
      style="margin:10px auto;display:block;"
    />
  </div>

</template>
<script>
// import 'echarts/lib/chart/bar'
export default {
    props: {
        orgchart: {
            type: Array,
            default: () => {}
        },
        labelchart: {
            type: Array,
            default: () => {}
        },
        isshow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            orgoption: {
                title: {
                    text: '组织标签数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: [{
                    type: 'value',
                    name: '组织数量(个)',
                    min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }],
                series: [
                    {
                        name: '标签数量',
                        type: 'bar',
                        smooth: true,
                        barWidth: '20px',
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#5157CA'// 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#8D92FA'// 100% 处的颜色
                                }], false)
                            }
                        },
                        data: [] // 纵轴
                    }
                ]
            },
            labeloption: {
                title: {
                    text: '标签权限数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: [{
                    type: 'value',
                    name: '标签数量(个)',
                    min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }],
                series: [
                    {
                        name: '权限数量',
                        type: 'bar',
                        smooth: true,
                        barWidth: '20px',
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#5157CA'// 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#8D92FA'// 100% 处的颜色
                                }], false)
                            }
                        },
                        data: [] // 纵轴
                    }
                ]
            }
        }
    },
    watch: {
        isshow: {
            handler: function(val) {
                console.log('触发')
                if (val) {
                    console.log(this.orgchart, this.labelchart)
                    this.orgoption.series[0].data = this.orgchart.map(item => item.YValue)
                    this.orgoption.xAxis.data = this.orgchart.map(item => item.XValue)
                    this.labeloption.series[0].data = this.labelchart.map(item => item.YValue)
                    this.labeloption.xAxis.data = this.labelchart.map(item => item.XValue)
                    this.drawLine()
                }
            }
        }
    },
    mounted: function() {
        // 一开始加载数据，或者是取后台返回来的数据
        this.orgoption.series[0].data = this.orgchart.map(item => item.YValue)
        this.orgoption.xAxis.data = this.orgchart.map(item => item.XValue)
        this.labeloption.series[0].data = this.labelchart.map(item => item.YValue)
        this.labeloption.xAxis.data = this.labelchart.map(item => item.XValue)
        this.drawLine()
    },
    methods: {
        // 柱状图
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            const myChart1 = this.$echarts.init(document.getElementById('labelChart1'))
            const myChart2 = this.$echarts.init(document.getElementById('labelChart2'))
            myChart1.setOption(this.orgoption)
            myChart2.setOption(this.labeloption)
        }
    }
}

</script>
