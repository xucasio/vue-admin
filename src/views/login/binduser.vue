<template>
  <div class="bind-page">
    <el-header class="blue-header">
      <img src="@/assets/logo.png">
      <span class="logo-title"> <span style="font-weight:600">·</span>绑定用户</span>
      <!-- <div class="header-gologin"> <GotoLogin/></div> -->
    </el-header>
    <div
      v-show="step===1"
      class="bind-content">
      <div class="login-row">
        <div class="login-title is-required">用户名：</div>
        <div
          class="row-content"
          style="width:320px;margin-top:30px">
          <div class="row-input">
            <input
              v-model="Form.username"
              placeholder="请输入用户名"
              @blur="checkUserName()">
          </div>
        </div>
        <div
          v-if="!verfiys.username.res"
          class="row-error-tips">*{{ verfiys.username.message }}</div>
      </div>
      <div class="login-row">
        <div class="login-title is-required">登录密码：</div>
        <div
          class="row-content"
          style="width:320px;margin-top:30px">
          <div class="row-input">
            <input
              v-model="Form.pwd"
              type="password"
              placeholder="请输入登录密码"
              maxlength="100">
          </div>
        </div>
        <div
          v-if="!verfiys.pwd.res"
          class="row-error-tips">*{{ verfiys.pwd.message }}</div>
      </div>
      <div class="login-row">
        <div class="login-title"/>
        <el-button
          type="primary"
          class="checkbtn"
          @click="submitForm">确定</el-button>
      </div>
    </div>
    <div
      v-show="step===2"
      class="bind-content error">
      <div class="bind-error">
        <img src="../../assets/login/reg-fail.png">
        <span class="error-text">{{ message }}</span>

      </div>
      <div class="bind-opt">
        <div
          class="opt-btns plain "
          @click="goUp">返回上一步</div>
        <div
          class="opt-btns  "
          @click="gotoReg">前往注册</div>

      </div>
    </div>
  </div>
</template>
<script>
import common from '@/utils/common'
import { fetchUpmsBindingweixinuser } from '@/api/login.js'
export default {
    name: 'BindUser',
    mixins: [],
    data() {
        return {
            returnUrl: common.getUrlKey('returnUrl'),
            appId: common.getUrlKey('applicationmark'),
            step: 1,
            message: '',
            Form: {
                username: '',
                pwd: ''
            },
            verfiys: {
                username: {
                    res: true,
                    message: ''
                },
                pwd: {
                    res: true,
                    message: ''
                }
            },
            rules: {
                username: [
                    { require: true, message: '请输入用户名' }
                    // { res: '^[a-zA-Z0-9]{0,20}$', message: '用户名须为6-20字母和数字组成' }
                ],
                pwd: [
                    { require: true, message: '请输入登录密码' }
                    // { min: 6, message: '密码长度不能小于6位' },
                    // { max: 20, message: '密码长度不能大于20位' },
                    // { reg: '^[a-zA-Z0-9]{0,20}$', message: '6-20个字符，仅支持数字或字母格式' }
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
        checkUserName() {
        },
        submitForm() {
            if (this.valaiForm()) {
                var openid = common.getUrlKey('openid')
                var unionID = common.getUrlKey('unionid')
                var user = {
                    'openID': openid,
                    'unionID': unionID,
                    'returnURL': this.returnUrl,
                    'loginName': this.Form.username,
                    'password': this.Form.pwd,
                    'applicationMark': this.appId,
                    url: this.returnUrl
                }
                fetchUpmsBindingweixinuser(user).then(res => {
                    if (res) {
                        var url = res.replace(' ', '')
                        if (url.indexOf('https://') < 0 && url.indexOf('http://') < 0) {
                            url = 'http://' + url
                        }
                        location.replace(url)
                    } else {
                        this.message = '很抱歉！您的绑定信息错误或用户名不存在！'
                        this.step = 2
                    }
                }).catch(ex => {
                    this.$message.error(ex.message || '很抱歉！您的绑定信息错误或用户名不存在！')
                    // this.message = ex.message || '很抱歉！您的绑定信息错误或用户名不存在！'
                    // this.step = 2
                })
            }
        },
        gotoReg() {
            this.$router.push({ path: '/register', query: { returnUrl: this.returnUrl, appId: this.appId }})
        },
        goUp() {
            this.step = 1
        },
        checkForm(key) {
            const value = this.Form[key]
            const rules = this.rules[key]
            this.verfiys[key].res = true
            console.log('rules:', value)
            if (rules) {
                for (var i = 0; i < rules.length; i++) {
                    const rule = rules[i]
                    // 验证是否必填
                    if (rule.require) {
                        if (value === '' || value.trim() === '') {
                            this.verfiys[key].res = false
                            this.verfiys[key].message = rule.message
                            break
                        }
                    }
                    console.log('1 this.verfiys[key].res:', this.verfiys[key].res)
                    // 验证正则表达式
                    if (rule.reg && rule.reg !== '') {
                        var regExp = new RegExp(rule.reg)
                        if (!regExp.test(value)) {
                            this.verfiys[key].res = false
                            this.verfiys[key].message = rule.message
                            break
                        }
                    }

                    // 验证min
                    if (rule.min && typeof rule.min === 'number') {
                        if (value.length < rule.min) {
                            this.verfiys[key].res = false
                            this.verfiys[key].message = rule.message
                            break
                        }
                    }
                    // 验证min
                    if (rule.max && typeof rule.max === 'number') {
                        if (value.length > rule.max) {
                            this.verfiys[key].res = false
                            this.verfiys[key].message = rule.message
                            break
                        }
                    }
                    console.log('3 this.verfiys[key].res:', this.verfiys[key].res)
                    if (rule.equel && rule.equel !== '') {
                        const equelValue = this.Form[rule.equel]
                        if (value !== equelValue) {
                            this.verfiys[key].res = false
                            this.verfiys[key].message = rule.message
                            break
                        }
                    }
                    console.log('4 this.verfiys[key].res:', this.verfiys[key].res)
                }
            }
        },
        valaiForm() {
            Object.keys(this.Form).forEach(key => {
                if (this.verfiys[key]) {
                    this.checkForm(key)
                }
            })
            var keys = Object.keys(this.verfiys)
            var res = true
            for (var i = 0; i < keys.length; i++) {
                if (!this.verfiys[keys[i]].res) {
                    res = false
                    break
                }
            }
            return res
        }

    }
}
</script>
