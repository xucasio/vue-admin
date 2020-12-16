<template>
  <div class="userinfo-page views-content">
    <div class="content-row audit-tab-row">
      <div class="audit-tab">
        <div
          :class="['audit-tab-item', showView===1?'active':'']"
          @click="gotoView(1)" >个人信息 <i class="active-icon"/> </div>
        <div
          :class="['audit-tab-item', showView===2?'active':'']"
          @click="gotoView(2)">互联登录</div>
      </div>
    </div>
    <div
      v-show="showView===1"
      class="userinfo-form mt20">
      <div class="content-row mb20">
        <cs-row-tab title="基础信息"/>
      </div>
      <el-form
        :inline="true"
        label-width="140px">
        <el-form-item
          :required="isEdit"
          label="账号：">
          <el-input
            v-model="form.LoginName"
            disabled/>
        </el-form-item>
        <!-- <el-form-item label="学校/公司名称：">
          <el-input
            v-model="form.Company"
            disabled/>
        </el-form-item> -->
        <el-form-item label="姓名：">
          <el-input
            :disabled="!isEdit"
            v-model="form.Name"/>
        </el-form-item>
        <!-- <el-form-item label="申请人：">
          <el-input
            v-model="form.Applicant"
            disabled/>
        </el-form-item> -->
        <el-form-item label="昵称：" >
          <el-input
            :disabled="!isEdit"
            v-model="form.NickName"/>
        </el-form-item>
        <!-- <el-form-item label="证件类型：">
          <el-input
            v-model="form.CertificatesType"
            disabled/>
        </el-form-item> -->
        <el-form-item label="手机号码：" >
          <el-input
            v-model="form.Mobile"
            disabled/>
        </el-form-item>
        <!-- <el-form-item label="证件号码：">
          <el-input
            v-model="form.CertificatesCode"
            disabled/>
        </el-form-item>
        <el-form-item label="国家：" >
          <el-input
            v-model="form.Country"
            disabled/>
        </el-form-item>
        <el-form-item label="从事行业：">
          <el-input
            v-model="form.CertificatesType"
            disabled/>
        </el-form-item>
        <el-form-item label="省份：" >
          <el-input
            v-model="form.Province"
            disabled/>
        </el-form-item>
        <el-form-item label="服务器IP：">
          <el-input
            v-model="form.Ip"
            disabled/>
        </el-form-item>
        <el-form-item label="城市：" >
          <el-input
            v-model="form.City"
            disabled/>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input
            v-model="form.Address"
            disabled/>
        </el-form-item>
        <el-form-item label="服务器MAC地址：">
          <el-input
            v-model="form.Mac"
            disabled/>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input
            v-model="form.LinkPhone"
            disabled/>
        </el-form-item>
        <el-form-item label="联系邮箱：">
          <el-input
            v-model="form.LinkEmail"
            disabled/>
        </el-form-item>
        <el-form-item label="数据用途：">
          <el-input
            v-model="form.Account_Purpose"
            :autosize="{ minRows: 2, maxRows: 4}"
            disabled
            type="textarea"/>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="form.Remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            disabled
            type="textarea"/>
        </el-form-item> -->
      </el-form>
      <div
        v-if="extendOptions.length"
        class="content-row mb20">
        <cs-row-tab title="扩展信息"/>
      </div>
      <el-form
        :inline="true"
        label-width="140px">
        <el-form-item
          v-for="item in extendOptions"
          :key="item.EXTENDPARAMID"
          :label="item.EXTENDPARAMNAME">
          <el-input
            v-model="item.EXTENDPARAMVALUE"
            disabled/>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button
          v-if="!isEdit"
          type="primary"
          @click="isEdit=true">修改个人信息</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="submitForm">提交修改</el-button>
        <el-button
          v-if="isEdit"
          @click="isEdit=false">取消修改</el-button>
        <el-button
          type="primary"
          @click="gotoModifyPw">修改密码</el-button>
        <el-button
          type="primary"
          @click="phoneModify" >手机改绑</el-button>
      </div>
    </div>
    <div
      v-show="showView===2"
      class="wx-form">
      <div class="wx-row">
        <div class="wx-logo"/>
        <div class="wx-title">微信绑定</div>
        <div class="wx-btn">
          <el-button
            :plain="isBindWeixin"
            type="primary"
            @click="changeWx">{{ isBindWeixin?'解除绑定':'立即绑定' }}</el-button>
        </div>
      </div>
    </div>
    <cs-dialog
      :show="showWx"
      :append-to-body="false"
      title="扫码绑定"
      width="340px"
      @close="closeWx">
      <iframe
        v-if="showWx"
        id="wxframe"
        :src="frameUrl"
        scrolling="no"
        style="overflow: hidden"/>
    </cs-dialog>

  </div>
</template>
<script>
import { fetchUserInfo, updateUserExtenInfo, fetchUserExtenInfo, fetchCancelWx } from '@/api/user.js'
import { getStorage } from '@/utils/auth'
export default {
    name: 'UserInfoPage',
    data() {
        return {
            frameUrl: process.env.NODE_ENV === 'production' ? '/Admin/WxLogin' : '/WxLogin',
            form: {
                LoginName: '',
                mobile: '',
                Name: '',
                NickName: ''
            },
            isEdit: false,
            userid: '',
            extendOptions: [],
            showView: 1,
            isBindWeixin: false,
            showWx: false
        }
    },
    mounted() {
        const auths = JSON.parse(sessionStorage.getItem('AUTH'))
        if (auths.length && auths[0].APPLICATION_MARK != 0) {
            this.applicationMark = auths[0].APPLICATION_MARK
        } else {
            this.applicationMark = 66 // 跨产品
        }

        this.userid = getStorage('USERID')
        fetchUserInfo(this.userid).then(res => {
            this.form = res
            this.isBindWeixin = res.IsBindWeixin
        })
        fetchUserExtenInfo(this.userid, getStorage('APPMARK') || 66).then(res => {
            this.extendOptions = res || []
        })
        window.closeWx = () => {
            this.showWx = false
            this.isBindWeixin = true
            this.$message({
                type: 'success',
                message: '绑定微信成功!'
            })
        }
        window.showError = (msg) => {
            this.showWx = false
            this.isBindWeixin = false
            this.$message({
                type: 'error',
                message: msg || '绑定微信失败!'
            })
        }
    },
    methods: {
        gotoView(v) {
            this.showView = v
        },
        gotoModifyPw() {
            this.$router.push({ path: '/home/modifyPw' })
        },
        submitForm() {
            const { Name, NickName } = this.form
            updateUserExtenInfo({ Name, NickName, UserId: this.userid }).then(res => {
                if (res) {
                    this.isEdit = false
                }
            })
        },
        closeWx() {
            this.showWx = false
        },
        changeWx() {
            if (this.isBindWeixin) {
            // 解除绑定
                this.$confirm('是否确定解除当前绑定，解绑后您将无法通过微信扫码登录当前账号！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    fetchCancelWx().then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.isBindWeixin = false
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })
            } else {
                this.$confirm('是否确定绑定到当前账号，绑定成功后可通过微信扫码登录！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this.showWx = true
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })
            }
        },
        phoneModify() {
            this.$router.push({ path: '/home/modifyPh', query: { phone: this.form.Mobile }})
        }
    }
}
</script>
<style lang="scss">
.userinfo-page{
  padding: 0 !important;
  padding-top: 10px !important;
  .userinfo-form {
    min-height: calc(100vh - 190px);
    padding-left: 15px;
    padding-right: 15px;
    .el-form-item__content{
      width: 50%;
      .el-select{
        width: 100%;
      }
    }
    .footer{
      padding: 40px 0 0 20px;
      // padding-top: 50px;
    }
  }
  .el-form--inline{
    .el-form-item{
      width: 50%;
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
  .mb20{
    margin-bottom: 20px;
  }
  .mt20{
    margin-top: 20px;
  }
  #wxframe{
    border:none;
    width:100%;
    height: 400px;
  }
  .wx-form{
    min-height: calc(100vh - 170px);
    padding-left: 15px;
    padding-right: 15px;
    .wx-row{
      display: flex;
      justify-content: start;
      flex-direction: row;
      align-items: center;
      padding-top: 20px;
      .wx-logo{
        width: 40px;
        height: 40px;
        background-image: url('../../../assets/login/weichat-logo.png');
        background-size: contain;

      }
      .wx-title{
        font-size: 14px;
        color: #3B3F5C;
        margin-left: 20px;
      }
      .wx-btn{
         margin-left: 40px;
      }
    }
  }

  .audit-tab{
    position: absolute;
    left: -0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    font-size: 14px;
    .audit-tab-item{
      width: 100px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      position: relative;
      &.active{
        border-bottom: 1px solid $--color-main;
        color: $--color-main;
        &:before{
          content:"";
          width:0;
          height:0;
          position: absolute;
          top: 34px;
          left: 47px;
          border-right:solid 6px transparent;
          border-left:solid 6px transparent;
          border-bottom:solid 6px $--color-main;
        }
      }

    }

  }
  .audit-subpage{
      padding: 30px;
  }
  .audit-tab-row{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #DBDDE5;

  }
}
</style>
