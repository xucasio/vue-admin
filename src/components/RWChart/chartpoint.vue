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
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'scatter'
                }]
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
