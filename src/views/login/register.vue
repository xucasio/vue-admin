<template>
  <div class="register-page">
    <el-header class="blue-header">
      <img src="@/assets/logo.png">
      <span class="logo-title"> <span style="font-weight:600">·</span>  注册</span>
      <div class="header-gologin"> <GotoLogin/></div>

    </el-header>
    <el-main>
      <div class="top-step">
        <div :class="['step-circle',step>=1&&'active']">1
          <span>验证手机号</span>
        </div>
        <div :class="['step-line',step>=2&&'active']"/>
        <div :class="['step-circle',step>=2&&'active']">2
          <span>填写账号信息</span>
        </div>
        <div :class="['step-line',step>=3&&'active']"/>
        <div :class="['step-circle',step>=3&&'active']">3
          <span>注册成功</span>
        </div>
      </div>
      <div
        v-if="step===1"
        class="step-content register">
        <div class="login-row">
          <div class="row-content">
            <div class="row-title isIcon">
              <i class="icon-login phone"/>
            </div>
            <div class="row-input">
              <input
                v-model="Form.phone"
                class="hasicon"
                placeholder="请输入手机号码"
                maxlength="11"
                @blur="checkForm('phone')">
            </div>
          </div>
          <div
            v-if="!verfiys.phone.res"
            class="row-error-tips">*{{ verfiys.phone.message }}</div>
        </div>
        <div class="login-row">
          <div class="row-content hascode">
            <div class="row-title isIcon">
              <i class="icon-login code"/>
            </div>
            <div class="row-input">
              <input
                v-model="Form.code"
                class="hasicon"
                maxlength="6"
                placeholder="请输入验证码"
                @blur="checkForm('code')"
              >
            </div>
          </div>
          <div
            :class="['count-code',!codeAbled&&'code-disable']"
            @click="getCode">
            {{ codeText }}
          </div>
          <div
            v-if="!verfiys.code.res"
            class="row-error-tips">*{{ verfiys.code.message }}</div>
        </div>
        <div class="login-row">
          <el-button
            type="primary"
            class="checkbtn"
            @click="checkPhoneAndCode">下一步</el-button>
        </div>
        <div
          class="login-row"
        >
          <!-- <GotoLogin/> -->
        </div>
      </div>
      <div
        v-if="step===2"
        class="step-content reg-content">
        <div class="login-row">
          <div class="login-title is-required">用户名：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.username"
                placeholder="请输入用户名"
                maxlength="20"
                @blur="checkUserName()">
            </div>
          </div>
          <div
            v-if="!verfiys.username.res"
            class="row-error-tips">*{{ verfiys.username.message }}</div>
        </div>
        <div class="login-row">
          <div class="login-title is-required">真实姓名：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.realName"
                placeholder="请输入真实姓名"
                maxlength="20"
                @blur="checkForm('realName')">
            </div>
          </div>
          <div
            v-if="!verfiys.realName.res"
            class="row-error-tips">*{{ verfiys.realName.message }}</div>
        </div>
        <div class="login-row">
          <div class="login-title is-required">手机号码：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.phone"
                readonly
                placeholder="请输入手机号码"
                maxlength="11"
                @blur="checkForm('phone')">
            </div>
          </div>
          <div
            v-if="!verfiys.phone.res"
            class="row-error-tips">*{{ verfiys.phone.message }}</div>
        </div>
        <div class="login-row">
          <div class="login-title is-required">登录密码：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.pwd1"
                type="password"
                maxlength="16"
                placeholder="请输入登录密码"
                @blur="checkForm('pwd1')"
              >
            </div>
          </div>
          <div
            v-if="!verfiys.pwd1.res"
            class="row-error-tips">*{{ verfiys.pwd1.message }}</div>
        </div>
        <div class="login-row">
          <div class="login-title is-required">确认密码：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.pwd2"
                maxlength="16"
                type="password"
                placeholder="请再次输入登录密码"
                @blur="checkForm('pwd2')">
            </div>
          </div>
          <div
            v-if="!verfiys.pwd2.res"
            class="row-error-tips">*{{ verfiys.pwd2.message }}</div>
        </div>
        <div class="login-row">
          <div class="login-title">邮    箱：</div>
          <div
            class="row-content"
            style="width:320px;margin-top:30px">
            <div class="row-input">
              <input
                v-model="Form.email"
                placeholder="请输入邮箱地址"
                maxlength="50"
                @blur="checkForm('email')">
            </div>
          </div>
          <div
            v-if="!verfiys.email.res"
            class="row-error-tips">*{{ verfiys.email.message }}</div>
        </div>

        <div
          class="login-row"
          style="width:480px">
          <div class="login-title"/>
          <el-button
            :loading="submiting"
            :disabled="!isRead"
            style="flex:1"
            class="checkbtn"
            type="primary"
            @click="subMitUser">提交信息</el-button>
        </div>
        <div
          class="login-row"
          style="width:480px;">
          <div class="login-title"/>
          <!-- <GotoLogin/> -->
          <div class="licnse"><el-checkbox v-model="isRead"/> 阅读并接受 <a
            href="/agree"
            target="_blank">《希施玛统一用户权限系统隐私政策》</a></div>
        </div>
      </div>
      <div
        v-if="step===3"
        class="step-content">
        <div class="sucsess-top">
          <img
            src="../../assets/login/reg-success.png"
            style="margin-right:20px">
          恭喜您完成注册！
        </div>
        <div class="xm-qr"/>
        <div class="res-tips">绑定学玛在线，微信扫码登录更方便、更安全</div>
        <div
          class="goto-btn"
          @click="gotoLogin">前往登录</div>
      </div>
    </el-main>
  </div>
</template>
<script>
import common from '@/utils/common'
import { fetchUpmsRegisterUser, fetchUpmsSendCode, fetchUpmsCheckUserName, fetchUpmsCheckPhoneReg } from '@/api/login.js'
import GotoLogin from '@/components/Login/gotologin'
export default {
    name: 'Register',
    components: { GotoLogin },
    data() {
        return {
            submiting: false,
            isRead: false,
            step: 1,
            returnUrl: common.getUrlKey('returnUrl'),
            appId: common.getUrlKey('appId'),
            Form: {
                phone: '',
                code: '',
                username: '',
                pwd1: '',
                pwd2: '',
                email: '',
                realName: ''
            },
            countdown: 60,
            pwdType: 'text',
            codeText: '发送验证码',
            codeAbled: true, // 验证码按钮可点击
            verfiys: {
                phone: {
                    res: true,
                    message: ''
                },
                code: {
                    res: true,
                    message: ''
                },
                username: {
                    res: true,
                    message: ''
                },
                pwd1: {
                    res: true,
                    message: ''
                },
                pwd2: {
                    res: true,
                    message: ''
                },
                email: {
                    res: true,
                    message: ''
                },
                realName: {
                    res: true,
                    message: ''
                }

            },
            rules: {
                phone: [
                    { require: true, message: '请输入手机号码' },
                    { reg: '^1(3|4|5|6|7|8|9)\\d{9}$', message: '手机号码格式不正确' }
                ],
                username: [
                    { require: true, message: '请输入用户名' },
                    { reg: '^[a-zA-Z0-9_]{5,20}$', message: '用户名为5-20字符，需要包含字母、数字或下划线' }
                ],
                code: [
                    { require: true, message: '请输入验证码' },
                    { reg: '^\\d{6}$', message: '验证码应为6位数字' }
                ],
                pwd1: [
                    { require: true, message: '请输入登录密码' },
                    // { min: 6, message: '密码长度不能小于6位' },
                    // { max: 20, message: '密码长度不能大于20位' },
                    { reg: '^[a-zA-Z0-9_-]{6,16}$', message: '密码为6－16位，支持数字、字母、中划线或下划线' }
                ],
                pwd2: [
                    { require: true, message: '请再次输入登录密码' },
                    { equel: 'pwd1', message: '两次输入密码不相同' }
                ],
                email: [
                    { reg: '^[A-Za-z0-9_.+-\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$', message: '邮箱格式不正确' }

                ],
                realName: [
                    { require: true, message: '请输入真实姓名' },
                    { reg: '^[A-Za-z0-9\\u4e00-\\u9fa5\\.\\s]*$', message: '真实姓名上限20字符，支持中文，字母，数字，空格或.' }
                ]
            }
        }
    },

    methods: {
        gotoLogin() {
            this.$router.push({ path: '/', query: { returnUrl: this.returnUrl, appId: this.appId }})
        },
        getCode() {
            if (this.codeAbled && this.checkMyPhone()) {
                fetchUpmsSendCode(this.Form.phone, 1).then(res => {
                    this.verfiys.phone.res = true
                    this.verfiys.phone.message = ''
                    this.setTime()
                }).catch(ex => {
                    this.verfiys.phone.res = false
                    this.verfiys.phone.message = '发送验证码失败'
                })
            }
        },
        setTime(obj) {
            if (this.countdown === 0) {
                this.codeText = '重新获取'
                this.codeAbled = true
                this.countdown = 60 // 60秒过后button上的文字初始化,计时器初始化;
                return
            } else {
                this.codeAbled = false
                this.codeText = '重新获取(' + this.countdown + 's)'
                this.countdown--
            }
            setTimeout(() => { this.setTime(obj) }, 1000) // 每1000毫秒执行一次
        },
        checkMyCode() {
            this.checkForm('code')
            if (!this.verfiys.code.res) {
                return false
            }
            this.verfiys.code.res = true
            this.verfiys.code.message = ''
            return true
        },
        async checkUserName() {
            this.checkForm('username')
            if (!this.verfiys.username.res) {
                return false
            }
            var res = await fetchUpmsCheckUserName(this.Form.username)
            if (res) {
                this.verfiys.username.res = true
                this.verfiys.username.message = '用户名已经被使用'
                return false
            }
            this.verfiys.username.res = true
            this.verfiys.username.message = ''
            return true
        },
        checkPhoneAndCode() {
            if (this.checkMyPhone() && this.checkMyCode()) {
                fetchUpmsCheckPhoneReg(this.Form.phone, this.Form.code).then(res => {
                    if (res) {
                        this.step = 2
                    } else {
                        this.verfiys.phone.res = false
                        this.verfiys.phone.message = '该手机号码已经被注册，请换一个试试'
                    }
                }).catch(ex => {
                    this.$message.error(ex.message || '请求异常')
                })
            }
        },
        checkMyPhone() {
            console.log(11111)
            this.checkForm('phone')
            if (!this.verfiys.phone.res) {
                return false
            }
            this.verfiys.phone.res = true
            this.verfiys.phone.message = ''
            return true
        },
        subMitUser() {
            this.submiting = true
            if (this.valaiForm() && this.checkUserName()) {
                var data = {
                    name: this.Form.username,
                    mobilePhone: this.Form.phone,
                    phoneCode: this.Form.code,
                    mail: this.Form.email,
                    password: this.Form.pwd1,
                    RealName: this.Form.realName
                }
                fetchUpmsRegisterUser(data).then(res => {
                    this.step = 3
                }).catch(ex => {
                    this.submiting = false
                    this.$message.error(ex.message || '请求异常')
                })
            } else {
                this.submiting = false
            }
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
                    if (rule.reg && rule.reg !== '' && value.trim() !== '') {
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
<style lang="scss" scoped>
.licnse{
  padding-top: 10px;
  font-size:12px;
  a{
    color:$--color-main;
    text-decoration:none;
    &:hover{
      text-decoration: underline;
    }
  }
}
</style>
