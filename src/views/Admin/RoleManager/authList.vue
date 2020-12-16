<template>
  <div
    class="views-content"
    style="min-width: 1100px; overflow:auto">
    <div
      class="views-search">
      <div
        v-if="points.indexOf('SELECT')>-1"
        class="filter-item"
        style="width:400px;">
        <el-input
          v-model="search.keyWord"
          placeholder="请搜索名称、标识"
          class="input-with-select"
          @keyup.enter.native="handleFilter">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleFilter"/>
        </el-input>
      </div>
      <div class="search-btns">
        <el-button
          v-if="points.indexOf('ADD')>-1"
          icon="iconfont iconxinzeng"
          @click="addAuth(0)">新增同级权限</el-button>
        <el-button
          v-if="points.indexOf('ADD')>-1"
          icon="iconfont iconxinzeng"
          @click="addAuth(1)">新增子权限</el-button>
      </div>
    </div>
    <div class="cs-table">
      <!-- <el-table
        ref="tableTree"
        :data="table.data"
        :load="loadChildren"
        :tree-props="{children: 'AuthorityList', hasChildren: 'IsChecked'}"
        stripe
        class="tableTree"
        highlight-current-row
        style="width: 100%"
        row-key="ID"
        border
        lazy
        @row-dblclick="expandRow"
        @row-click="rowClick">
      <el-table-column
        label="名称"
        header-align="center"
        min-width="180" >
        <template slot-scope="{row}">
          <span
            v-if="row.ApplicationName"
            style="font-weight:bold">{{ row.ApplicationName }}</span>
          <span v-else>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标识"
        header-align="center"
        min-width="120" >
        <template slot-scope="{row}">
          <span
            v-if="row.ApplicationName"
            style="font-weight:bold">{{ row.ApplicationMark }}</span>
          <span v-else>{{ row.Mark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="AuthTypeStr"
        label="类型"
        header-align="center"
        align="center"
        width="120" >
        <template slot-scope="{row}">
          <span>{{ row.AuthorityType!==0?row.AuthTypeStr:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        fixed="right"
        header-align="center"
        width="120"
        align="center">
        <template slot-scope="{row}">
          <div
            v-if="!row.ApplicationName"
            class="btn-flex">
            <cs-round-button
              v-if="points.indexOf('UPDATE')>-1"
              icon="iconguanli-bianji"
              title="修改"
              @click.native="editAuth(row)"/>
            <cs-round-button
              v-if="points.indexOf('DEL')>-1"
              icon="iconshanchu"
              title="删除"
              @click.native="delAuth(row)"/>
          </div>
        </template>
      </el-table-column>
      </el-table> -->
      <cs-select-treegrid
        ref="tableTree"
        :has-type="true"
        :has-option="true"
        :auth-type="0"
        :data="table.data"
        :show-check="false"
        :is-authlist="true"
        :tree-hright="(screenHeight-320)"
        :keyword="search.keyWord"
        :has-application="true"
        @edit="editAuth"
        @curnode="rowClick"
        @del="delAuth"
        @search="getList"
      />
    </div>

    <cs-dialog
      :show="dialog.showAuthDialog"
      :append-to-body="false"
      :title="dialog.title"
      width="700px"
      @close="closeAuthDialog">
      <authAdd
        :visiable="dialog.showAuthDialog"
        :formdata="Form"
        :cur-row="checkedRow"
        @close="closeAuthDialog"
        @add="handleSubmit"/>
    </cs-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchAuthTree, createAuth, deleteAuth, getchildsById } from '@/api/role.js'
import authAdd from './components/authAdd'
import { getStorage } from '@/utils/auth'
import CsSelectTreegrid from '@/components/CsSelectTreegrid'
export default {
    name: 'AuthList',
    components: { authAdd, CsSelectTreegrid },
    data() {
        return {
            search: {
                keyWord: ''
            },
            table: {
                data: []
            },
            Form: {},
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            checkedRow: {},
            dialog: {
                showAuthDialog: false,
                title: ''
            },
            optionType: 0,
            isProducter: +getStorage('TYPEID') === 3
        }
    },
    computed: {
        ...mapState({
            screenHeight: state => state.admin.screenHeight
        })
    },
    mounted() {
        this.getList()
        console.log('isProducter', this.isProducter)
    },
    methods: {
        getList() {
            const data = this.getData()
            this.showLoading('.cs-table')
            return fetchAuthTree(data).then(res => {
                this.table.data = res.Data || []
                this.table.data = this.randomId(this.table.data)
                this.table.data.map((item, i) => {
                    item.ID = 'productId' + Math.random().toString().slice(2, 10)
                })
                if (this.search.keyWord) {
                    this.$nextTick(() => {
                        this.table.data.map(row => {
                            this.freshTreeNodes(row.keyid, row.AuthorityList)
                            row.AuthorityList.map(item => {
                                if (item.AuthorityList.length) {
                                    this.freshTreeNodes(item.keyid, item.AuthorityList)
                                    item.AuthorityList.map(i => {
                                        if (i.AuthorityList.length) {
                                            this.freshTreeNodes(i.keyid, i.AuthorityList)
                                        }
                                    })
                                }
                            })
                        })
                    })
                    // 产品管理员时默认展开第一级权限
                } else if (!this.search.keyWord && this.isProducter) {
                    this.$nextTick(() => {
                        this.table.data.map(row => {
                            this.freshTreeNodes(row.keyid, row.AuthorityList)
                        })
                    })
                }
                this.hideLoading()
            }).catch(ex => {
                this.hideLoading()
            })
        },
        freshTreeNodes(id, children) {
            const node = this.$refs['tableTree'].$children[0].store.nodesMap[id]
            if (node) {
                node.expand()
            }
            // this.$set(this.$refs['tableTree'].store.states.lazyTreeNodeMap, id, children || [])
            // if (treeData[id]) {
            //     treeData[id].expanded = true
            //     treeData[id].loaded = true
            // } else {
            //     treeData[id] = {
            //         children: children.map(el => el.ID),
            //         display: true,
            //         expanded: true,
            //         lazy: true,
            //         loaded: true,
            //         loading: false
            //     }
            // }
        },
        getData() {
            const data = {
                ConditionValue: this.search.keyWord,
                AdminTypeInfoID: getStorage('PTYPEID')
            }
            return data
        },
        rowClick(row) {
            this.checkedRow = row
        },
        addAuth(type) {
            if (!this.checkedRow.ID) {
                this.$message.warning('请先选择一个节点！')
                return
            }
            if (+type === 0 && this.checkedRow.ApplicationName) {
                this.$message.warning('无法在产品节点新增同级节点！')
                return
            }
            this.Form = {}
            this.dialog.showAuthDialog = true
            this.dialog.title = type ? '新增子节点' : '新增同级节点'
            this.optionType = type
        },
        editAuth(row) {
            this.Form = Object.assign(this.Form, row)
            this.dialog.title = '编辑权限节点'
            this.dialog.showAuthDialog = true
        },
        loadChildren(row, treeNode, resolve) {
            if (row.AuthorityList.length) {
                resolve(row.AuthorityList)
            } else {
                getchildsById(row.ID).then(res => {
                    resolve(res || [])
                })
            }
        },
        // getChildrenById(id, array) {
        //     let treeArr = []
        //     for (let i = 0; i < array.length; i++) {
        //         if (+array[i].ID === +id) {
        //             treeArr = array[i].AuthorityList
        //             break
        //         }
        //     }
        //     treeArr = treeArr.map(item => {
        //         const { ID, ParentId, Mark, AuthorityType, Name, AuthorityList, show, ApplicationId } = item
        //         return { ID, ParentId, Mark, AuthorityType, Name, hasChildren: !!AuthorityList.length, show, ApplicationId }
        //     })
        //     return treeArr
        // },
        // /* array 树数据 id 当前节点id state 当前勾选状态 **/
        // findParentsId(array, id) {
        //     const stack = []
        //     let going = true
        //     const walker = (array, id) => {
        //         array.forEach(item => {
        //             if (!going) return
        //             stack.push(item['ID'])
        //             if (+item['ID'] === +id) {
        //                 going = false
        //             } else if (item['AuthorityList']) {
        //                 walker(item['AuthorityList'], id)
        //             } else {
        //                 stack.pop()
        //             }
        //         })
        //         if (going) stack.pop()
        //     }

        //     walker(array, id)
        //     return stack
        // },
        getpidById(id) {
            const node = this.$refs['tableTree'].$children[0].store.nodesMap[id]
            return node.parent.data.keyid
        },
        handleFilter() {
            this.getList()
        },
        // 新增修改删除之后根据parentId局部更新
        getPartNodes(pid) {
            const _this = this
            const node = _this.$refs['tableTree'].$children[0].store.nodesMap[pid]
            if ((node.data.ID + '').indexOf('productId') > -1) {
                const obj = this.table.data.find(item => {
                    return item.keyid === pid
                })
                this.freshTreeNodes(obj.keyid, obj.AuthorityList)
                return
            }
            getchildsById(node.data.ID).then(res => {
                const arr = this.randomId(res)
                node.childNodes = []
                node.doCreateChildren(arr)
                if (arr.length) {
                    this.$set(node, 'isLeaf', false)
                    this.$set(node, 'indeterminate', true)
                    this.$set(node, 'expanded', true)
                } else {
                    this.$set(node, 'isLeaf', true)
                }

                // this.$set(this.$refs['tableTree'].store.states.lazyTreeNodeMap, pid, res || [])
                // if (treeData[pid]) {
                //     treeData[pid].expanded = true
                //     treeData[pid].loaded = true
                // } else {
                //     treeData[pid] = {
                //         children: res.map(el => el.ID),
                //         display: true,
                //         expanded: true,
                //         lazy: true,
                //         loaded: true,
                //         loading: false
                //     }
                // }
            })
        },
        closeAuthDialog() {
            this.dialog.showAuthDialog = false
        },
        handleSubmit(form) {
            const obj = {
                ...form,
                ApplicationId: this.checkedRow.ApplicationId,
                ParentId: form.ParentId ? form.ParentId : (this.optionType ? (this.checkedRow.ID.toString().indexOf('productId') > -1 ? 0 : this.checkedRow.ID) : this.checkedRow.ParentId),
                AUTHORITY_ID: form.ID
            }
            const title = form.ID ? '编辑成功' : '新增成功'
            const _this = this
            createAuth(obj).then(res => {
                if (res) {
                    _this.$message.success(title)
                    _this.dialog.showAuthDialog = false
                    if (!form.ID) { // 新增
                        if ((!_this.optionType && _this.checkedRow.ParentId === 0) || (_this.optionType && _this.checkedRow.ID.toString().indexOf('productId') > -1)) {
                            return _this.getList()
                        } else {
                            if (_this.optionType) { // 子级
                                _this.getPartNodes(_this.checkedRow.keyid)
                            } else { // 同级
                                _this.getPartNodes(_this.getpidById(_this.checkedRow.keyid))
                            }
                        }
                    } else { // 修改
                        if (_this.checkedRow.ParentId === 0) {
                            return _this.getList()
                        } else {
                            // form.ParentId
                            _this.getPartNodes(_this.getpidById(_this.checkedRow.keyid))
                        }
                    }
                }
            })
            // .then(res => {
            //     let obj = {}
            //     if (form.ID) {
            //         obj = this.table.data.find(item => form.ApplicationId === item.ApplicationId)
            //     } else {
            //         obj = this.table.data.find(item => this.checkedRow.ApplicationId === item.ApplicationId)
            //     }
            //     console.log(form.ID)
            //     this.getPartNodes(obj.ID)
            // })
        },
        delAuth(row) {
            const _this = this
            this.$confirm(`<div class="alert-tips"><i class="alert-error"></i> 是否删除${row.Name}权限?</div>`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleteAuth(row.ID).then(res => {
                    _this.$message.success('删除成功')
                    if (row.ParentId === 0) {
                        return _this.getList()
                    } else {
                        _this.getPartNodes(_this.getpidById(row.keyid))
                    }
                }).then(res => {
                    const obj = _this.table.data.find(item => row.ApplicationId === item.ApplicationId)
                    _this.getPartNodes(obj.keyid)
                })
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // expandRow(row) {
        //     const rowState = this.$refs['tableTree'].store.states.treeData[row.ID]
        //     if (rowState.expanded) {
        //         this.$refs['tableTree'].toggleRowExpansion(row, false)
        //     } else if (!rowState.expanded && rowState.level === 0) {
        //         const curRow = this.table.data.find(item => {
        //             return item.ID == row.ID
        //         })
        //         if (curRow) {
        //             console.log('curRow.AuthorityList', curRow.AuthorityList)
        //             this.freshTreeNodes(row.keyid, curRow.AuthorityList)
        //         }
        //         this.$set(rowState, 'expanded', true)
        //     } else {
        //         this.$set(rowState, 'loading', true)
        //         if (!rowState.children.length) {
        //             getchildsById(row.ID).then(res => {
        //                 this.freshTreeNodes(row.keyid, res || [])
        //                 this.$set(rowState, 'loading', false)
        //                 this.$set(rowState, 'expanded', true)
        //                 this.$refs['tableTree'].toggleRowExpansion(row, true)
        //             })
        //         } else {
        //             this.$refs['tableTree'].toggleRowExpansion(row, true)
        //         }
        //     }
        // },
        randomId(arr) {
            const _this = this
            if (arr.length) {
                const fn = function(arr) {
                    arr.map(item => {
                        _this.$set(item, 'keyid', item.ID + Math.random().toString().slice(3, 8))
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
        }

    }
}
</script>
<style lang="scss">
.tableTree{
  .btn-flex{
    display: flex;
    justify-content: center;
  }
  .el-table__body tr.current-row > td{
    background-color: #9ec7ff !important;
  }
}
.filter-item{
  display: flex;
  flex-direction: row;
  .el-input{
    .el-button{
      background-color:  $--color-main;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      padding: 11px 20px;
    }
  }

}
.rowBtn{
  color: #515365;
  cursor: pointer;
  padding: 0 5px;
  &:hover{
    color: $--color-main;
  }
}
</style>
