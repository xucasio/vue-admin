<template>
  <header class="box-shadow bg-dark">
    <div class="navbar-header">
      <div class="navbar-brand text-lt">
        <img src="@/assets/gta-logo.png">
        <span>红樱可视化</span>
      </div>
    </div>
    <div class="editor-toolbar">
      <div class="tool-center">
        <div class="tool-list">
          <ul class="tool-item">
            <li
              class="tool-item-li"
              @mouseover="setShow('chart')"
              @mouseout="setShow('')">
              <div
                class="li-container"
              >
                <i class="iconfont iconchart"/>
                <span>图表</span>
              </div>
              <div
                :style="{display:showChart=='chart'?'block':'none'}"
                class="li-container-list">
                <div class="list-container">
                  <ul class="list-container-list clearfix">
                    <li @click="select('rwchart','chartline')">
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon chart-line"/>
                        <div class="list-tool-item__name">折线图</div>
                      </span>
                    </li>
                    <li @click="select('rwchart','chartbar')">
                      <span class="list-tool-item" >
                        <div class="list-tool-item__icon chart-bar"/>
                        <div class="list-tool-item__name">柱状图</div>
                      </span>
                    </li>
                    <li @click="select('rwchart','chartpie')">
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon chart-pie"/>
                        <div class="list-tool-item__name">饼图</div>
                      </span>
                    </li>
                    <li @click="select('rwchart','chartpoint')">
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon chart-point"/>
                        <div class="list-tool-item__name">散点图</div>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li
              class="tool-item-li"
              @mouseover="setShow('table')"
              @mouseout="setShow('')">
              <div class="li-container">
                <i class="iconfont icontable"/>
                <span>表格</span>
              </div>
              <div
                :style="{display:showChart=='table'?'block':'none'}"
                class="li-container-list">
                <div class="list-container">
                  <ul class="list-container-list clearfix">
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon table-table"/>
                        <div class="list-tool-item__name">普通表格</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon table-play"/>
                        <div class="list-tool-item__name">轮播表格</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon table-attr"/>
                        <div class="list-tool-item__name">属性表格</div>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li
              class="tool-item-li"
              @mouseover="setShow('text')"
              @mouseout="setShow('')">
              <div class="li-container">
                <i class="iconfont icontext"/>
                <span>文字</span>
              </div>
              <div
                :style="{display:showChart=='text'?'block':'none'}"
                class="li-container-list">
                <div class="list-container">
                  <ul class="list-container-list clearfix">
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon text-simple"/>
                        <div class="list-tool-item__name">文本</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon text-link"/>
                        <div class="list-tool-item__name">超链接</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon text-marquee"/>
                        <div class="list-tool-item__name">跑马灯</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon text-time"/>
                        <div class="list-tool-item__name">实时时间</div>
                      </span>
                    </li>
                    <li>
                      <span class="list-tool-item">
                        <div class="list-tool-item__icon text-rich"/>
                        <div class="list-tool-item__name">富文本</div>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="tool-right">
        <div class="tool-list">
          <div class="cut-line"/>
          <ul class="tool-item">
            <li class="tool-item-li">
              <div class="li-container">
                <i class="iconfont el-icon-s-platform"/>
                <span>保存并预览</span>
              </div>
            </li>
            <li class="tool-item-li">
              <div class="li-container">
                <i class="iconfont iconsave"/>
                <span>保存</span>
              </div>
            </li>
            <li class="tool-item-li">
              <div class="li-container">
                <i class="iconfont el-icon-close"/>
                <span>退出</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
export default {
    name: 'Header',
    data: function() {
        return {
            showChart: ''

        }
    },
    computed: {
        ...mapState({
            Title: state => state.portal.title,
            Footer: state => state.portal.footer,
            Logo: state => state.portal.logo,
            IsModifyPWD: state => state.portal.isModifyPWD,
            CASAuthLoginUrl: state => state.portal.CASAuthLoginUrl
        })

    },
    created() {

    },
    methods: {
        setShow(val) {
            this.showChart = val
        },
        select(ctype, cname) {
            this.showChart = ''
            this.$emit('addgrid', ctype, cname)
        }
    }
}
</script>
<style lang="scss" >

</style>

