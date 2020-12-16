<template>
  <div class="tgrid-box">
    <div
      :style="{'min-height': (treeHright + 'px')||'300px'}"
      class="tgrid-contain">
      <div class="tgrid-t">
        <span
          :style="{'width': isAuthlist?'400px':'calc(310px)'}"
          class="column">权限名称</span>
        <span
          v-if="hasAuthId"
          :style="{'width': isAuthlist?'180px':'calc(200px)'}"
          class="column">权限ID</span>
        <span
          :style="{'width': isAuthlist?'180px':'calc(200px)'}"
          class="column">权限标识</span>
        <span
          v-if="hasType"
          :style="{'width': isAuthlist?'150px':'calc(220px)'}"
          class="column">权限类型</span>
        <span
          v-if="hasOption"
          :style="{'width': isAuthlist?'calc(100% - 980px)':'calc(260px)', 'min-width':'180px'}"

          class="column">管理</span>
      </div>
      <div
        v-if="!data.length"
        class="nodata">暂无数据</div>
      <el-tree
        v-if="data.length"
        ref="tree"
        :style="{'height':isAuthlist? (treeHright - 30)+'px':'300px'}"
        :data="data"
        :expand-on-click-node="false"
        :props="defaultProps"
        :load="loadNode"
        :show-checkbox="showCheck"
        highlight-current
        lazy
        node-key="keyid"
        @current-change="curNode"
        @check="checkNode"
        @check-change="checkChange">
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node">
          <span
            :style="{'width': calcWidth(node),'font-weight':node.level==1?'bold':'normal'}"
            :title="data.Name|| data.ApplicationName"
            :class="['column']">{{ data.Name|| data.ApplicationName }}</span>
          <span
            v-if="hasAuthId"
            :style="{'width': isAuthlist?'180px':'200px'}"
            :class="['column','tc']">{{ node.level ==1?'':data.AUTHORITY_ID }}</span>
          <span
            :style="{'width': isAuthlist?'180px':'200px'}"
            class="column tc">{{ data.Mark||data.ApplicationMark }}</span>
          <span
            v-if="hasType"
            :style="{'width': isAuthlist?'150px':'200px'}"
            class="column tc ">{{ roleTypeMap[data.AuthorityType]||'' }}</span>
          <span
            v-if="hasApplication"
            :style="{'width': 'calc(100% - 980px)', 'display':'inline-block', 'min-width':'180px'}"
            class="column tl">
            <div
              v-if="!data.ApplicationName"
              class="btn-flex">
              <el-tooltip
                content="修改"
                placement="top"
                effect="light">
                <cs-round-button
                  v-if="points.indexOf('UPDATE')>-1"
                  icon="iconguanli-bianji"
                  @click.native="editAuth(data)"/>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                effect="light">
                <cs-round-button
                  v-if="points.indexOf('DEL')>-1"
                  icon="iconshanchu"
                  @click.native="delAuth(data)"/>
              </el-tooltip>

            </div>

          </span>
        </span>

      </el-tree>
    </div>

  </div>
</template>
<script>
import { queryadmintypeinfoauhtrangetreebyparent } from '@/api/role.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'CsSelectTreegrid',
    props: {
        isShow: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: () => []
        },
        authType: {
            type: String | Number,
            default: 1
        },
        keyword: {
            type: String,
            default: ''
        },
        showCheck: {
            type: Boolean,
            default: true
        },
        hasAuthId: {
            type: Boolean,
            default: true
        },
        hasType: {
            type: Boolean,
            default: false
        },
        hasOption: {
            type: Boolean,
            default: false
        },
        hasApplication: {
            type: Boolean,
            default: false
        },
        isAuthlist: {
            type: Boolean,
            default: false
        },
        treeHright: {
            type: String | Number,
            default: ''
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'AuthorityList',
                label: 'label',
                isLeaf: 'leaf'
            },
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }]
        }
    },
    computed: {
        roleTypeMap() {
            const obj = {}
            this.roleTypeOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    watch: {
        isShow(n) {
            if (n) {
                this.$nextTick(() => {
                    this.$refs['tree'].setCheckedKeys([])
                })
            }
        }
        // data: {
        //     handler: function(n) {
        //         console.log('1处理前', this.data)
        //         this.data = this.randomId(this.data)
        //         console.log('1加参数', this.data)
        //     },
        //     deep: true,
        //     immediate: true
        // }
    },
    mounted() {
        // this.data = this.randomId(this.data)
        console.log('this.data', this.data)
        // console.log('加参数', this.data)
    },
    methods: {
        append(node, data) {
            this.$refs['tree'].getCheckedNodes(false, false)
        },
        checkChange(data) {
            const nodes = this.$refs['tree'].getCheckedNodes(true, false)
            this.$emit('select', nodes)
        },
        randomId(arr, checked = false) {
            const _this = this
            if (arr.length) {
                const fn = function(arr) {
                    arr.map(item => {
                        _this.$set(item, 'keyid', item.ID + Math.random().toString().slice(3, 8))
                        _this.$set(item, 'checked', checked)
                        _this.$set(item, 'leaf', !!(!item.IsChecked || (item.ApplicationMark && !item.AuthorityList.length)))
                        if (item.AuthorityList && item.AuthorityList.length) {
                            fn(item.AuthorityList)
                        }
                        return item
                    })
                }
                fn(arr)
            }
            return arr
        },
        loadNode(node, resolve) {
            if (node.data.ID && node.data.ID != 0 && node.level == 2) {
                queryadmintypeinfoauhtrangetreebyparent({ 'AdminTypeInfoID': getStorage('PTYPEID'), AuthId: node.data.ID, keyWords: this.keyword, AuthType: this.authType }).then((res) => {
                    const arr = this.randomId(res) || []
                    resolve(arr || [])
                    arr.map(item => {
                        if (item.AuthorityList.length) {
                            const node = this.$refs['tree'].getNode(item.keyid)
                            node.expand()
                        }
                    })
                    this.$emit('select', this.$refs['tree'].getCheckedNodes(true, false))
                })
            } else if (node.level > 2 || node.level == 1) {
                resolve(node.data.AuthorityList)
            } else {
                resolve(this.data)
            }
        },
        checkNode(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
            const vnode = this.$refs['tree'].getNode(checkedNodes.keyid)
            // queryadmintypeinfoauhtrangetreebyparent({ 'AdminTypeInfoID': getStorage('PTYPEID'), AuthId: vnode.data.ID }).then((res) => {
            //     console.log(this.randomId(res, true))
            //     const arr = this.randomId(res, true)
            //     for (let i = 0; i < arr.length; i++) {
            //       this.$set(vnode.store.nodesMap, arr[i].keyid, )
            //     }
            //     this.$set(vnode.store.nodesMap, checkedNodes.keyid, this.randomId(res, true))
            // this.$set(vnode, 'loading', true)
            //     // this.$refs['tree'].setCheckedKeys([checkedNodes.keyid], false)
            //     // this.$refs['tree'].setCheckedKeys([checkedNodes.keyid], true)
            //     setTimeout(() => {
            //         console.log('勾选的节点', this.$refs['tree'].getCheckedNodes(true, false))
            //         console.log('勾选的节点', this.$refs['tree'].getCheckedNodes(false, false))
            //     })
            // })
            vnode.expand()
        },
        calcWidth(node) {
            let str
            if (this.isAuthlist) {
                switch (node.level) {
                        case 1:
                            str = '376px'
                            break
                        case 2:
                            str = '358px'
                            break
                        case 3:
                            str = '340px'
                            break
                        case 4:
                            str = '322px'
                            break
                }
            } else {
                switch (node.level) {
                        case 1:
                            str = '286px'
                            break
                        case 2:
                            str = '246px'
                            break
                        case 3:
                            str = '228px'
                            break
                        case 4:
                            str = '210px'
                            break
                }
            }

            return str
        },
        editAuth(row) {
            this.$emit('edit', row)
        },
        delAuth(row) {
            this.$emit('del', row)
        },
        curNode(row) {
            this.$emit('curnode', row)
        }
    }
}
</script>
<style lang="scss">
.tgrid-box{
  .tgrid-contain{
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    .tgrid-t{
      // width: calc(99% - -7px);
      border: 1px solid #DBDDE5;
      border-bottom: none;
      background: #F8FBFF;
      .column{
        display: inline-block;
        border-right: 1px solid #DBDDE5;
        width: 33%;
        line-height: 45px;
        text-align: center;
        font-weight: bold;
      }
    }
    .nodata{
      border: 1px solid #DBDDE5;
      height: 250px;
      line-height: 250px;
      text-align: center;

    }
    .el-tree{
      overflow: auto;
      overflow-x: hidden;
      .el-tree-node__content{
        border-left: 1px solid #DBDDE5;
        border-top: 1px solid #DBDDE5;
        height: 35px;
        position: relative;
        .custom-tree-node{
          display: inline-block;
          width: 100%;
          .column{
            display: inline-block;
            border-right: 1px solid #DBDDE5;
            width: 210px;
            line-height: 46px;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 40px;
            &:last-child{
              border-right:none;
            }
            .btn-flex{
              display: flex;
              justify-content: flex-start;
              padding-top: 10px;
              padding-left: 15px;
            }
          }
          .tc{
            text-align: center;
          }
          .tl{
            text-align: left;
          }
        }
        .el-tree-node__loading-icon.el-icon-loading{
          // display: none;
          position: absolute;
          left: 5px;
          top: 10px;
        }
      }
      &>.el-tree-node{
        border-right: 1px solid #DBDDE5 !important;
        &:nth-last-child(2){
          border-bottom: 1px solid #DBDDE5 !important;
        }
      }
      &>.el-tree-node >.el-tree-node__content>.el-checkbox{
        display: none;
      }
      .el-tree-node.is-current{
        &>.el-tree-node__content{
          background-color: #9ec7ff !important;
        }
      }
    }
  }

}
</style>
