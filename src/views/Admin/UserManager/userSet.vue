<template>
  <div class=" userset-page">
    <div class="views-content">
      <cs-back-btn />
      <div class="content-row">
        <cs-row-tab
          :has-right-btn="true"
          title="账号信息">
          <el-button
            size="small"
            @click="goBack">返回上一页</el-button>
        </cs-row-tab>
      </div>
      <div class="content-row">
        <el-divider style="width:70%">基础信息</el-divider>
      </div>
      <div
        class="content-row"
        style="padding:20px 0">
        <el-row>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">用户名：</span>
            <span
              v-tip="baseInfo.LoginName"
              class="user-value">{{ baseInfo.LoginName }}</span>
          </el-col>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">姓名：</span>
            <span
              v-tip="baseInfo.Name"
              class="user-value">{{ baseInfo.Name }}</span>
          </el-col>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">昵称：</span>
            <span
              v-tip="baseInfo.NickName"
              class="user-value">{{ baseInfo.NickName }}</span>
          </el-col>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">手机号码：</span>
            <span
              v-tip="baseInfo.Mobile"
              class="user-value">{{ baseInfo.Mobile }}</span>
          </el-col>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">公司/学校名称：</span>
            <span
              v-tip="baseInfo.Company ||baseInfo.SchoolName"
              class="user-value">{{ baseInfo.Company ||baseInfo.SchoolName }}</span>
          </el-col>
          <el-col
            :span="4"
            class="info-item">
            <span class="user-title">联系电话：</span>
            <span
              v-tip="baseInfo.LinkPhone"
              class="user-value">{{ baseInfo.LinkPhone }}</span>
          </el-col>
        </el-row>
      </div>
      <el-collapse-transition v-if="extendInfo.length>0">
        <div
          v-show="!expended"
          class="content-row"
        >
          <el-divider style="width:70%">扩展信息</el-divider>
          <div
            class="user-extend"
            style="padding: 10px 0px;">
            <el-row>
              <el-col
                v-for="ext in extendInfo"
                :span="4"
                :key="ext.EXTENDPARAMID"
                class="info-item"
                style="padding-top:10px">
                <span class="user-title">{{ ext.EXTENDPARAMNAME }}：</span>
                <span
                  v-tip="ext.EXTENDPARAMVALUE"
                  class="user-value">{{ ext.EXTENDPARAMVALUE }}</span>
              </el-col>

            </el-row>
          </div>
        </div>
      </el-collapse-transition>
      <div
        v-if="extendInfo.length>0"
        :title="expended?'展开':'折叠'"
        class="extend-icon"
        @click="handleExpend">
        <i :class="[expended?'el-icon-arrow-down':'el-icon-arrow-up'] "/>
      </div>
    </div>

    <div class="views-content mgt30">
      <div class="content-row">
        <cs-row-tab title="权限范围设置"/>
      </div>
      <div
        class="content-row"
        style="display:flex;justify-content: space-between;">
        <div
          v-if="!isBuser()"
          class="roles-area">
          <UserRoles
            :data="baseInfo.Roles"
            :userid="userid"
            @reload="getUserInfo"/></div>
        <div
          v-if="isBuser()"
          class="roles-area">
          <UserLabels
            :data="baseInfo.Labels"
            :userid="userid"
            @reload="getUserInfo"/></div>
        <div class="roles-area">
          <UserRights
            :data="baseInfo.Rights"
            :hasdate="!isBuser()"
            :hastypedata="!isBuser()"
            :userid="userid"
            @reload="getUserInfo"/></div>

      </div>

    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import { getStorage } from '@/utils/auth.js'
import UserRoles from './roleTable'
import UserRights from './rightTable'
import UserLabels from './labelTable'
import common from '@/utils/common.js'
import { fetchUserInfo, fetchUserExtenInfo } from '@/api/user.js'
export default {
    name: 'UserSet',
    components: { UserRoles, UserRights, UserLabels },
    data() {
        return {
            userid: common.getUrlKey('userid'),
            expended: false,

            baseInfo: {
                Roles: [],
                Rights: []

            },
            extendInfo: []
        }
    },
    computed: {
        ...mapState({
            appId: state => state.admin.appId
        })
    },
    mounted() {
        this.getUserInfo()
        fetchUserExtenInfo(this.userid, this.appId).then(res => {
            this.extendInfo = res
        })
    },
    methods: {
        // B端管理员不需要设置有效期
        isBuser() {
            return +getStorage('TYPEID') === 4
        },
        getUserInfo() {
            fetchUserInfo(this.userid).then(res => {
                this.baseInfo = res
            })
        },
        handleExpend() {
            this.expended = !this.expended
        }

    }
}
</script>
<style lang="scss">
.userset-page{
  position: relative;
  .info-item{
    display: flex;
    .user-title{
      color:#515365;
      display: inline-block;
      white-space: nowrap;
    }
    .user-value{
      color:#BBBECA;
      display: inline-block;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .extend-icon{
    display: inline-block;
    position: absolute;
    width:60px;
    height:30px;
    border-radius: 60px 60px 0 0;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background:rgba(255,255,255,1);
   box-shadow:0px -6px 15px 0px rgba(100,100,100,0.15);
   &:hover{
     cursor: pointer;
     color: $--color-main;
     font-weight: 700;
   }
  }
  .roles-area{
    width: 49%;
    // padding: 0 10px;
  }
}

</style>
