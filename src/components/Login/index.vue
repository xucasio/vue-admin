<template>
  <div class="upms-login">
    <!-- <div class="login-title">
      用户登录
    </div> -->
    <div class="login-tabs">
      <div
        :class=" ['tab-name right','active']"
        @click="clickTab(1)">
        <span>账号登录</span>
      </div>
      <!-- <div
        :class=" ['tab-name right',lType===2&&'active']"
        @click="clickTab(2)">
        <span>账号验证</span>
      </div> -->
    </div>
    <div
      v-if="lType===1"
      class="login-area">
      <el-alert
        v-if="showerror"
        :title="errormsg"
        :closable="false"
        type="error"
        show-icon/>
      <div class="login-row">
        <div class="row-content">
          <div class="row-title isIcon">
            <i class="icon-login user"/>
          </div>
          <div class="row-input">
            <input
              v-model="account"
              class="hasicon"
              autocomplete="off"
              placeholder="请输入用户名/手机号">
          </div>
        </div>
      </div>
      <div class="login-row">
        <div class="row-content">
          <div class="row-title isIcon">
            <i class="icon-login pwd"/>
          </div>
          <div class="row-input">
            <input
              v-model="pwd"
              class="hasicon"
              autocomplete="off"
              placeholder="请输入密码"
              name="pwd"
              type="password"
              @keyup.enter="handleLogin">
          </div>
        </div>
      </div>
      <div class="login-row forget" > <a @click="handleForget">忘记密码</a></div>

      <div class="login-row">
        <a
          class="btn-login"
          @click="handleLogin" >登录</a>
      </div>
      <div class="login-row reg">
        <div class="goreg" >
          <span class="no-text">没有账号？</span> <span
            class="reg-now"
            @click="gotoRegister">立即注册</span>
        </div>
      </div>
    </div>
    <div
      v-if="lType===2"
      class="login-area">
      <el-alert
        v-if="showPhoneerror"
        :title="errorPhonemsg"
        :closable="false"
        type="error"
        show-icon/>
      <div class="login-row">
        <div class="row-content step2">
          <!-- <div class="row-title isIcon">
            <i class="icon-login phone"/>
          </div> -->
          <!-- <div class="row-title">
            <el-select
              v-model="countryCode"
              size="medium">
              <el-option
                v-for="c in countryCodes"
                :key="c.code"
                :value="c.code"
                :label="c.code">
                <span style="float: left;margin-right:10px">{{ c.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ c.code }}</span>
              </el-option>
            </el-select>
          </div> -->
          <!-- <div class="row-input">
            <input
              v-model="phone"
              class="hasicon"
              placeholder="请输入手机号码"
              maxlength="11">
          </div> -->
          <div class="phone-tips">{{ sendPhoneText }}</div>
          <div class="phone-text">{{ phoneText }}</div>
        </div>
      </div>
      <div class="login-row">
        <div class="row-content hascode">
          <div class="row-title isIcon">
            <i class="icon-login code"/>
          </div>
          <div class="row-input">
            <input
              v-model="code"
              class="hasicon"
              maxlength="6"
              placeholder="请输入验证码"
            >
          </div>
        </div>
        <div
          :class="['count-code',!codeAbled&&'code-disable']"
          @click="getCode">
          {{ codeText }}
        </div>
      </div>
      <div class="login-row forget" > <a @click="handleForget">忘记密码</a></div>
      <div class="login-row">
        <a
          class="btn-login"
          @click="handleLoginPhone">验证</a>
      </div>
      <div class="login-row reg">
        <div class="goreg" >
          <span class="no-text">没有账号？</span> <span
            class="reg-now"
            @click="gotoRegister">立即注册</span> </div>
      </div>
    </div>
    <div class="login-quick">
      <div class="quick-line"> <span class="quick-text">其他登录方式</span> </div>
      <div class="logo-row">
        <div
          class="logo-box wei"
          @click="gotoWeiLogin"><i/> </div>
          <!-- <div
          class="logo-box ali"
          @click="gotoAliLogin"><i/> </div>
        <div
          class="logo-box qq"
          @click="gotoQQLogin"><i/></div> -->
      </div>
    </div>

  </div>
</template>
<script>
import { fetchUpmsSendCode, fetchUpmsLoginByPhoneCode, getadminmobilephone } from '@/api/login.js'
// import Cookies from 'js-cookie'
import common from '@/utils/common.js'
import host from '@/api/api.js'
export default {
    name: 'ULogin',
    data() {
        return {
            returnUrl: common.getUrlKey('returnUrl'),
            appId: common.getUrlKey('appId'),
            lType: 1,
            account: '',
            pwd: '',
            code: '',
            phone: '',
            countryCode: '0086',
            countryCodes: [
                { code: '0086', name: '中国大陆' },
                { code: '0886', name: '中国台湾' },
                { code: '0852', name: '中国香港' },
                { code: '0001', name: '美国' }
            ],
            countdown: 120,
            codeText: '发送验证码',
            codeAbled: true, // 验证码按钮可点击
            showerror: false,
            errormsg: '',
            showPhoneerror: false,
            errorPhonemsg: '',
            sendPhoneText: '',
            phoneText: ''
        }
    },
    methods: {
        gotoRegister() {
            this.$emit('register')
        },
        handleForget() {
            this.$emit('forget')
        },
        clickTab(v) {
            this.lType = v
        },
        getCode() {
            console.log('this.phone:', this.phone, this.codeAbled)
            if (this.codeAbled && this.checkPhone()) {
                fetchUpmsSendCode(this.phone, 4).then(res => {
                    if (res) {
                        this.showPhoneerror = false
                        this.sendPhoneText = '短信验证码已成功发送到您的手机，两分钟内有效'
                        this.setTime()
                    } else {
                        this.showPhoneerror = true
                        this.errorPhonemsg = '发送验证码失败！'
                    }
                }).catch(ex => {
                    this.showPhoneerror = true
                    this.errorPhonemsg = '发送验证码失败！'
                })
            }
        },
        checkPhone() {
            if (!this.phone.trim()) {
                this.showPhoneerror = true
                this.errorPhonemsg = '请输入手机号码！'
                return false
            }
            if (!/^1[3-9]\d{9}$/.test(this.phone)) {
                this.showPhoneerror = true
                this.errorPhonemsg = '请输入正确的手机号码！'
                return false
            }
            this.showPhoneerror = false
            this.errorPhonemsg = ''
            return true
        },
        checkCode() {
            if (!this.code.trim()) {
                this.showPhoneerror = true
                this.errorPhonemsg = '验证码不能为空！'
                return false
            }
            this.showPhoneerror = false
            this.errorPhonemsg = ''
            return true
        },
        setTime(obj) {
            if (this.countdown === 0) {
                this.codeText = '重新获取'
                this.codeAbled = true
                this.countdown = 120 // 60秒过后button上的文字初始化,计时器初始化;
                return
            } else {
                this.codeAbled = false
                this.codeText = '(' + this.countdown + 's)' + '重新获取'
                this.countdown--
            }
            setTimeout(() => { this.setTime(obj) }, 1000) // 每1000毫秒执行一次
        },
        handleLogin() {
            if (!this.checkAccount()) {
                return
            }
            var user = {
                LoginName: this.account,
                Password: this.pwd
            }
            getadminmobilephone(user).then(res => {
                if (res) {
                    this.phone = res + ''
                    var reg = /^(\d{3})\d*(\d{4})$/
                    this.phoneText = this.phone.replace(reg, '$1****$2')
                    this.getCode()
                    this.lType = 2
                } else {
                    this.showerror = true
                    this.errormsg = '请求异常！'
                }
            }).catch(ex => {
                this.showerror = true
                this.errormsg = ex.message || '请求异常！'
            })
        },
        handleLoginPhone() {
            if (this.checkPhone() && this.checkCode()) {
                fetchUpmsLoginByPhoneCode(this.phone, this.code, this.appId)
                    .then(res => {
                        this.$emit('success', res)
                        this.showPhoneerror = false
                    }).catch(ex => {
                        this.showPhoneerror = true
                        this.errorPhonemsg = ex.message || '请求异常！'
                    })
            }
        },
        // handleLogin() {
        //     console.log('111')
        //     if (!this.checkAccount()) {
        //         return
        //     }
        //     const myIP = Cookies.get('_ip')
        //     this.showerror = false
        //     fetchUpmsAdminLogin({
        //         loginName: this.account,
        //         passWord: this.pwd,
        //         ip: myIP,
        //         applictionMark: this.appId
        //     }).then(res => {
        //         this.$emit('success', res)
        //         this.showerror = false
        //     }).catch(ex => {
        //         this.showerror = true
        //         this.errormsg = ex.message || '请求异常！'
        //     })
        // },
        checkAccount() {
            if (!this.account.trim()) {
                this.showerror = true
                this.errormsg = '请输入账号/手机号/邮箱！'
                return false
            }
            if (!this.pwd.trim()) {
                this.showerror = true
                this.errormsg = '请输入密码！'
                return false
            }
            this.showerror = false
            this.errormsg = ''
            return true
        },
        gotoAliLogin() {
            // 获取 returnUrl
            var url = common.getUrlKey('returnUrl')
            var returnUrl = encodeURIComponent('https://passport.csmar.com/alicallback?returnUrl=' + url)
            location.href = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021001163679257&scope=auth_user&redirect_uri=' + returnUrl + '&state=init'
        },
        gotoQQLogin() {
            var url = common.getUrlKey('returnUrl')
            var returnUrl = encodeURIComponent('https://passport.csmar.com/qqcallback?returnUrl=' + url)
            location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101877013&state=register&redirect_uri=' + returnUrl
        },
        gotoWeiLogin() {
            var appId = common.getUrlKey('appId')
            var url = 'https://' + location.host + '/Admin/LoginSuccess'
            // var url = common.getUrlKey('returnUrl')
            var returnUrl = encodeURIComponent(host.wxbackurl + '?url=' + url + '&applicationMark=' + appId)
            location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx0e2a1895724e548d&redirect_uri=' + returnUrl + '&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
        }
    }

}
</script>
<style lang="scss">

</style>
