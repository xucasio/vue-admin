<template>
  <div
    v-resize="onResize"
    ref="myChart"
    class="chart-area no-drag"/>
</template>
<script>
export default {
    name: 'ChartLine',
    props: {
        guid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            myChart: {},
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    left: 'center',
                    data: ['西凉', '益州', '兖州', '荆州', '幽州']
                },
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data: [
                            {
                                value: 1548,
                                name: '幽州'
                            },
                            { value: 535, name: '荆州' },
                            { value: 510, name: '兖州' },
                            { value: 634, name: '益州' },
                            { value: 735, name: '西凉' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.myChart = this.$echarts.init(this.$refs.myChart)
            this.myChart.setOption(this.option)
        })
    },
    methods: {
        closeChart() {
            this.$emit('closechart', this.guid)
        },
        onResize() {
            console.log(1)
            this.myChart.resize()
        }
    }

}
</script>
