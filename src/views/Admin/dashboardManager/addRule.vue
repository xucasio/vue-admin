<template>
  <div class="views-content">
    <div>
      <el-form
        ref="AddRule"
        :model="Form"
        :rules="rules"
        label-width="120px" >
        <div class="content-row mb20">
          <cs-row-tab :title="!ID?'新增规则':'编辑规则'"/>
        </div>
        <div class="search-content">
          <el-form-item
            label="规则名称"
            prop="STATISTICS_NAME">
            <el-input
              v-model="Form.STATISTICS_NAME"
              maxlength="50"
              placeholder="请输入规则名称"/>
          </el-form-item>
          <el-form-item
            label="规则描述"
            prop="DESC">
            <el-input
              v-model.trim="Form.DESC"
              placeholder="请输入备注"
              rows="5"
              maxlength="255"
              type="textarea" />
          </el-form-item>
          <el-form-item
            :error="rolesErrorTip"
            :validate-status="rolesStatus"
            label="角色权限"
            prop="roles">
            <div
              class="roleSelect">
              <el-row>
                <el-col :span="24">
                  <el-card shadow="never" >
                    <!-- @click.native="onTagClick(item)" -->
                    <el-tag
                      v-for="(item, index) in tagList"
                      :key="item.id"
                      :type="item.type"
                      :effect="item.effect"
                      closable
                      @close="closeTag(index)">
                      {{ item.name }}
                    </el-tag>
                  </el-card>
                </el-col>
                <!-- <el-col
                  :span="11"
                  :offset="1">
                  <el-card shadow="never" >
                    <el-tag
                      v-for="(item, index) in relativeList"
                      :key="item.id"
                      closable
                      @close="closeTag(index)">
                      {{ item.name }}
                    </el-tag>
                  </el-card>
                </el-col> -->

              </el-row>

            </div>
          </el-form-item>
          <el-form-item>
            <!-- <el-button-group
              class="btn-box"
              style="width:200px">
              <el-button
                @click="openRight">选择权限</el-button>
              <el-button
                @click="getRelative">相关角色</el-button>
            </el-button-group> -->
            <el-button
              @click="openRight">选择权限</el-button>
            <el-button
              :disabled="!tagList.length"
              type="text"
              @click="getRelative">相关角色</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="footer">
        <el-button
          type="primary"
          @click="submitForm()">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
      <el-drawer
        :visible.sync="showRolesVisible"
        :with-header="false"
        :show-close="false"
      >
        <auth-roles
          :rolers="relativeList"
          title="相关角色"
          @close="closeRolesVisible"/>
      </el-drawer>
      <cs-dialog
        :show="showRoleDialog"
        :append-to-body="false"
        title="添加角色"
        width="800px"
        @close="closeRoleDialog">
        <UserRoleList
          :is-show="showRoleDialog"
          :hasdate="false"
          @close="closeRoleDialog"
          @add="handleAddRole"/>
      </cs-dialog>
      <cs-dialog
        :show="showRightDialog"
        :append-to-body="false"
        title="添加权限"
        width="800px"
        @close="closeRightDialog">
        <UserRightList
          :is-show="showRightDialog"
          :hasdate="false"
          :has-limit="false"
          :hastypedata="false"
          @close="closeRightDialog"
          @add="handleAddRight"/>
      </cs-dialog>
    </div>
  </div>
</template>
<script>
import UserRoleList from '@/views/Admin/TobManager/components/roleList'
import UserRightList from '@/views/Admin/TobManager/components/rightList'
import { addstatisticsauthorityinfo, querystatisticsauthorityinfobyid, updatestatisticsauthorityinfo, getroleinfosbyauthoriytid } from '@/api/dashboard'
import authRoles from './authRoles'
import { objArrRemovRep } from '@/utils/index'
export default {
    name: 'AddRule',
    components: {
        UserRoleList, UserRightList, authRoles
    },
    data() {
        var validateTypeInfoIds = (rule, value, callback) => {
            if (!value.length) {
                callback(new Error('请选择角色权限!'))
            } else {
                callback()
            }
        }
        return {
            Form: {
                STATISTICS_NAME: '',
                DESC: '',
                roles: []
            },
            rules: {
                STATISTICS_NAME: [{ required: true, message: '请输入规则名称', trigger: ['blur'] }],
                roles: [{ required: true, validator: validateTypeInfoIds, trigger: 'change' }]
            },
            showRoleDialog: false,
            showRightDialog: false,
            tagList: [],
            relativeList: [],
            rolesErrorTip: '',
            rolesStatus: '',
            ID: '',
            showRolesVisible: false
        }
    },
    watch: {
        'tagList': {
            handler: function(arr) {
                this.Form.roles = this.tagList
                if (!this.tagList.length) {
                    this.rolesErrorTip = '请选择角色权限'
                    this.rolesStatus = 'error'
                } else {
                    this.rolesErrorTip = ''
                    this.rolesStatus = 'success'
                }
            },
            deep: true
        }
    },
    mounted() {
        this.ID = this.$route.query.id || ''
        if (this.ID) {
            this.getDetailById(this.ID)
        }
    },
    methods: {
        submitForm() {
            const Role = this.tagList.filter(item => {
                return item.mode === 'ROLE'
            })
            const Rights = this.tagList.filter(item => {
                return item.mode === 'RIGHT'
            })
            this.$refs['AddRule'].validate((valid) => {
                // 角色权限单独校验
                if (!this.tagList.length) {
                    this.rolesErrorTip = '请选择角色权限'
                    this.rolesStatus = 'error'
                    return
                }
                if (valid) {
                    const data = {
                        STATISTICS_NAME: this.Form.STATISTICS_NAME,
                        DESC: this.Form.DESC,
                        RoleIDs: Role.map(item => item.id + ''),
                        IS_DISABLED: this.Form.IS_DISABLED,
                        AuthorityIds: Rights.map(item => item.id + ''),
                        AuthorityNames: Rights.map(item => item.name)
                    }
                    if (!this.Form.ID) {
                        addstatisticsauthorityinfo(data).then(res => {
                            this.$message.success('新增成功')
                            this.goBack()
                        })
                    } else {
                        data.ID = this.Form.ID
                        updatestatisticsauthorityinfo(data).then(res => {
                            this.$message.success('编辑成功')
                            this.goBack()
                        })
                    }
                }
            })
        },
        goBack() {
            this.$router.go(-1)
        },
        openRole() {
            this.showRoleDialog = true
        },
        closeRoleDialog() {
            this.showRoleDialog = false
        },
        handleAddRole(val) {
            this.showRoleDialog = false
        },
        openRight() {
            this.showRightDialog = true
        },
        closeRightDialog() {
            this.showRightDialog = false
        },
        handleAddRight(val) {
            if (val.length) {
                const arr = val.map(item => {
                    return { id: item.ID, mode: 'RIGHT', name: item.Name, type: 'warning', effect: 'plain' }
                })
                this.tagList = objArrRemovRep(this.tagList.concat(arr).reverse(), 'id').reverse()
            }
            this.showRightDialog = false
        },
        closeTag(index) {
            // if (this.tagList[index].effect === 'dark') {
            //     this.relativeList = []
            // }
            this.tagList.splice(index, 1)
        },
        // onTagClick(item) {
        //     this.tagList.map(i => {
        //         this.$set(i, 'effect', 'plain')
        //     })
        //     this.$set(item, 'effect', 'dark')
        //     getroleinfosbyauthoriytid({ AuthorityID: item.id }).then(res => {
        //         // type id name
        //         this.relativeList = res.map(item => {
        //             return { id: item.RoleID, name: item.RoleName }
        //         }) || []
        //     }).catch(er => {
        //         this.relativeList = []
        //     })
        // },
        getDetailById(ID) {
            querystatisticsauthorityinfobyid({ ID }).then(res => {
                this.Form.STATISTICS_NAME = res.STATISTICS_NAME
                this.Form.DESC = res.DESC
                this.Form.ID = res.ID
                this.Form.IS_DISABLED = res.IS_DISABLED
                for (let i = 0; i < res.AuthorityIds.length; i++) {
                    this.tagList.push({ id: res.AuthorityIds[i], name: res.AuthorityNames[i], type: 'warning', effect: 'plain', mode: 'RIGHT' })
                }
            })
        },
        getRelative() {
            const ids = this.tagList.map(i => i.id)
            getroleinfosbyauthoriytid(ids).then(res => {
                this.showRolesVisible = true
                this.relativeList = res || []
            })
        },
        closeRolesVisible() {
            this.showRolesVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>
.roleSelect{
  .el-card{
    min-height: 120px;
  }
}
</style>
