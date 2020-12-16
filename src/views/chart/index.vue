<template>
  <div class="chart-wrapper">
    <div class="editor-container">
      <EditorHeader @addgrid="addGrid"/>
      <div class="editor-body">
        <div class="body-left">
          <div class="report-wrapper">
            <div class="report-title">
              <span class="main-title active"> {{ Report.Title }}</span>
            </div>
            <div class="report-content">
              <grid-layout
                :layout.sync="Report.Items"
                :col-num="12"
                :row-height="layoutConfig.height"
                :is-draggable="layoutConfig.dialogVisible"
                :is-resizable="layoutConfig.dialogVisible"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                :responsive="true"
              >
                <grid-item
                  v-for="(item,index) in Report.Items"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :i="item.i"
                  :key="item.i"
                  drag-ignore-from=".no-drag"
                >
                  <component
                    :is="item.ctype"
                    :cname="item.cname"
                    :guid="item.i"
                    @closechart="closeChart"
                  />
                </grid-item>
              </grid-layout>

            </div>

          </div>
        </div>
        <div class="body-right">
          <rightPage/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
// import layoutData from '@/virtualData/layoutData.json'
import { GridLayout, GridItem } from 'vue-grid-layout'
import EditorHeader from './header'
import rightPage from './chartconfig'
import rwchart from '@/components/RWChart/index.vue'

import { guid } from '@/utils/guid'
export default {
    name: 'App',
    components: {
        EditorHeader,
        GridLayout,
        GridItem,
        rwchart,
        rightPage

    },
    data: function() {
        return {
            showChart: '',
            Report: {
                Title: '报表名称',
                Items: []

            },
            layoutConfig: {
                height: 50, // 默认高度
                dialogVisible: true // 是否可拖拽或改变大小
            }
        }
    },
    computed: {
        ...mapState({
            Title: state => state.portal.title,
            Footer: state => state.portal.footer,
            Logo: state => state.portal.logo,
            IsModifyPWD: state => state.portal.isModifyPWD,
            CASAuthLoginUrl: state => state.portal.CASAuthLoginUrl,
            selectedId: state => state.chart.SelectId
        })
        // layoutData() {
        //     return this.Report.Items
        // }

    },
    created() {
        // this.layoutData = layoutData.mainData
    },
    methods: {
        addGrid(charttype, chartname) {
            console.log('charttype:', charttype)
            var maxItem = { x: 0, y: 0 }
            if (this.Report.Items.length > 0) {
                maxItem = this.Report.Items.reduce((pre, cur) => {
                    return (pre.y > cur.y ? pre : cur)
                })
            }
            var item = {
                'x': (this.Report.Items.length * 4) % 12,
                'y': 1000, // 无穷大
                'w': 4,
                'h': 6,
                'i': guid(),
                'ctype': charttype,
                cname: chartname,
                option: {
                    base: {
                        titleName: '图表',
                        titleAlign: 'center',
                        titleColor: '#555555',
                        width: 4,
                        height: 6
                    }

                }
            }
            this.Report.Items.push(item)
            this.$store.dispatch('addChart', item)
        },
        closeChart(id) {
            var index = this.Report.Items.findIndex((item) => item.i === id)
            console.log(index)
            this.Report.Items.splice(index, 1)
        },
        clickitem(id) {
            console.log('click:', id)
        }

    }
}
</script>

