<template>
  <div class="forget-content">
    <div
      v-if="step===0"
      class="forget-start">
      <el-alert
        v-if="showerror"
        :title="errormsg"
        :closable="false"
        type="error"
        show-icon/>
      <div class="row-input">
        <input
          v-model="account"

          maxlength="100"
          placeholder="用户名/手机号码"
        >
      </div>
      <div class="row-input">
        <DragConfirm
          ref="drag"
          :start-fun="startDrag"
          :success-fun="successFun"
          status="dragStatus"
          style="width:100%"
        />
      </div>
      <div class="row-input">
        <a
          :class="['btn-login', dragStatus && 'disabled']"
          @click="handleNext">下一步</a>
      </div>
    </div>

    <div
      v-show="step>0"
      class="forget-steps">
      <div
        v-show="step>0"
        class="top-step">
        <div :class="['step-circle',step>=1&&'active']">1
          <span>验证手机号</span>
        </div>
        <div :class="['step-line',step>=2&&'active']"/>
        <div :class="['step-circle',step>=2&&'active']">2
          <span>填写账号信息</span>
        </div>
        <div :class="['step-line',step>=3&&'active']"/>
        <div :class="['step-circle',step>=3&&'active']">3
          <span>完成</span>
        </div>
      </div>
    </div>
    <div
      v-if="step===1"
      class="steps-content">
      <div style="margin-top:30px;text-align:center">
        <img
          class="confirm-img"
          src="../../assets/login/icon-confirm.png">
        <div class="confirm-tips">为了确认是您本人操作，请使用下面的方式完成身份验证</div>
      </div>
      <div class="check-now">
        <div class="check-text">通过手机验证码</div>
        <div
          class="btn-now"
          @click="gotoCheck">立即验证</div>
      </div>
    </div>
    <div
      v-show="step===2"
      style="margin: 30px auto 0px; width: 480px;"
      class="steps-content">
      <div class="login-row">
        <div class="login-title">手机号码：</div>
        <div
          class="row-content"
          style="width:320px;margin-top:30px">
          <div class="row-input">
            <input
              v-model="Form.phone"
              placeholder="请输入手机号码"
              maxlength="11"
              @blur="checkForm('phone')">
          </div>
        </div>
        <div
          v-if="!verfiys.phone.res"
          class="row-error-tips">*{{ verfiys.phone.message }}</div>
      </div>
      <div class="login-row hascode">
        <div class="login-title">验证码：</div>
        <div
          class="row-content hascode"
          style="width:160px;margin-top:30px"
        >
          <div class="row-input">
            <input
              v-model="Form.code"
              maxlength="6"
              placeholder="请输入验证码"
              @blur="checkForm('code')"
            >
          </div>
        </div>
        <div
          :class="['count-code',!codeAbled&&'code-disable']"
          style="top:30px"
          @click="getCode">
          {{ codeText }}
        </div>
        <div
          v-if="!verfiys.code.res"
          class="row-error-tips">*{{ verfiys.code.message }}</div>
      </div>
      <div class="login-row">
        <div class="login-title">新的登录密码：</div>
        <div
          class="row-content"
          style="width:320px;margin-top:30px">
          <div class="row-input">
            <input
              v-model="Form.pwd1"
              :type="pwdType"
              maxlength="16"
              placeholder="请输入新的密码"
              @blur="checkForm('pwd1')"
            >
          </div>
        </div>
        <div
          v-if="!verfiys.pwd1.res"
          class="row-error-tips">*{{ verfiys.pwd1.message }}</div>
      </div>
      <div class="login-row">
        <div class="login-title">确认新的登录密码：</div>
        <div
          class="row-content"
          style="width:320px;margin-top:30px">
          <div class="row-input">
            <input
              v-model="Form.pwd2"
              :type="pwdType"
              placeholder="请再次输入新的密码"
              maxlength="16"
              @blur="checkForm('pwd2')">
          </div>
        </div>
        <div
          v-if="!verfiys.pwd2.res"
          class="row-error-tips">*{{ verfiys.pwd2.message }}</div>
      </div>
      <div
        class="login-row"
        style="width:480px">
        <div class="login-title"/>
        <el-button
          style="flex:1"
          class="checkbtn"
          type="primary"
          @click="submitForm">确定</el-button>

      </div>
      <!-- <div
        class="login-row"
        style="width:480px;">
        <GotoLogin/>
      </div> -->

    </div>
    <div
      v-show="step===3"
      class="steps-content">
      <div class="row-success">
        重置成功，请牢记新的登录密码
      </div>
      <div
        class="row-input"
        style="margin-top:60px">
        <el-button
          type="primary"
          size="medium"
          @click="goTologin">重新登录</el-button>
      </div>

    </div>
  </div>
</template>
<script>
import DragConfirm from '@/components/dragComfirm'
// import GotoLogin from '@/components/Login/gotologin'
import { fetchUpmsExistsnameorphone, fetchUpmsSendCode, fetchUpmsChangepasswordbyphone, fetchUpmsPhoneAndCode } from '@/api/login.js'
export default {
    name: 'Forget',
    components: { DragConfirm },
    data() {
        return {
            loading: false,
            step: 1,
            account: '',
            showdialoag: false,
            checked: false,
            showerror: false,
            errormsg: '',
            dragStatus: false,
            countdown: 120,
            pwdType: 'text',
            codeText: '发送验证码',
            codeAbled: true, // 验证码按钮可点击
            myphone: '',
            mycode: '',
            Form: {
                code: '',
                phone: '',
                pwd1: '',
                pwd2: ''
            },
            rules: {
                phone: [
                    { require: true, message: '请输入手机号码' },
                    { reg: '^1(3|4|5|6|7|8|9)\\d{9}$', message: '手机号码格式不正确' }
                ],
                code: [
                    { require: true, message: '请输入验证码' },
                    { reg: '^\\d{6}$', message: '验证码应为6位数字' }
                ],
                pwd1: [
                    { require: true, message: '请输入新密码' },
                    // { min: 6, message: '密码长度不能小于6位' },
                    // { max: 16, message: '密码长度不能大于16位' },
                    { reg: '^[a-zA-Z0-9_-]{6,16}$', message: '密码为6－16位，支持数字、字母、中划线或下划线' }
                ],
                pwd2: [
                    { require: true, message: '请再次输入新密码' },
                    { equel: 'pwd1', message: '两次输入密码不相同' }
                ]
            },
            verfiys: {
                phone: {
                    res: true,
                    message: ''
                },
                code: {
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
                }
            }
        }
    },
    methods: {
        successFun() {
            this.checked = true
            this.showerror = false
            this.errormsg = ''
            alert(this.dragStatus)
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
        handleNext() {
            if (!this.checkAccount()) {
                this.showerror = true
                this.errormsg = '用户名/手机号码不能为空'
                return
            }
            if (!this.checked) {
                this.showerror = true
                this.errormsg = '请先点击验证'
                return
            }
            fetchUpmsExistsnameorphone(this.account).then(res => {
                if (res && res.status === 1) {
                    this.step = 1
                    this.showerror = false
                    this.errormsg = ''
                } else {
                    this.showerror = true
                    this.errormsg = '用户名/手机号码不存在'
                }
            }).catch(ex => {
                this.showerror = true
                this.errormsg = '用户名/手机号码不存在'
            })
        },
        gotoCheck() {
            this.step = 2
            this.pwdType = 'password'
            // this.showdialoag = true
        },
        startDrag() {
            if (!this.account.trim()) {
                return false
            }
            return true
        },
        checkAccount() {
            if (!this.account.trim()) {
                this.showerror = true
                this.errormsg = '用户名/手机号码不能为空'
                return false
            }
            this.showerror = false
            this.errormsg = ''
            return true
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
        checkMyCode() {
            this.checkForm('code')
            if (!this.verfiys.code.res) {
                return false
            }
            this.verfiys.code.res = true
            this.verfiys.code.message = ''
            return true
        },
        getCode() {
            if (this.codeAbled && this.checkMyPhone()) {
                fetchUpmsSendCode(this.Form.phone, 2).then(res => {
                    this.verfiys.phone.res = true
                    this.verfiys.phone.message = ''
                    this.setTime()
                }).catch(ex => {
                    this.verfiys.phone.res = false
                    this.verfiys.phone.message = '发送验证码失败'
                })
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
                        if (value === '') {
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
        },
        submitForm() {
            if (this.valaiForm()) {
                var data = {
                    mobilePhone: this.Form.phone,
                    phoneCode: this.Form.code,
                    newPassword: this.Form.pwd1
                }
                this.loading = true
                fetchUpmsChangepasswordbyphone(data).then(res => {
                    this.loading = false
                    console.log(res)
                    if (res) {
                        this.step = 3
                        this.showerror = false
                    } else {
                        this.$message.error(res || '请求异常')
                        // this.errormsg = res.message
                    }
                }).catch(ex => {
                    this.loading = false
                    this.$message.error(ex || '请求异常')
                })
            }
        },
        goTologin() {
            this.$emit('login')
        },
        checkPhoneAndCode() {
            if (this.checkMyPhone() && this.checkMyCode()) {
                fetchUpmsPhoneAndCode({
                    'phone': this.Form.phone,
                    'phoneCode': this.Form.code,
                    'verificationType': 2
                }).then(res => {
                    console.log('res:', res)
                    if (res) {
                        this.showdialoag = false
                        this.step = 2
                    } else {
                        this.$message.error('验证码错误或失效')
                    }
                }).catch(ex => {
                    this.$message.error('请求异常')
                })
            }
        }
    }
}
</script>
<style lang="scss">
.forget-content{
  box-sizing: border-box;
  width:700px;

  margin:0 auto;
  background: #fff;
  margin-top: 60px;
  .el-alert{
    width: 300px;
    margin:0 auto;
  }
  .forget-start{
    width: 600px;
    margin: 0 auto;
    margin-top: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-button--medium{
    width: 100%;
    font-size: 16px;
  }
  .btn-login{
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #fff;
        background-color: $--login-main;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        user-select: none;
        cursor: pointer;
        &:hover{
          opacity: 0.9;
        }
        &.disabled{
          opacity: 0.7;
        }
    }
    .row-success{
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin-top: 60px;
    }
    .forget-steps{
      display: flex;
      flex-direction: row;
      // padding-bottom: 10px;
      .step-item{
        flex: 1;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height:60px;
        line-height: 60px;
        margin-bottom: -1px;
         &.had{
           border-bottom: 1px solid $--login-main ;
            .icon-circle{
               border-color: $--login-main;
               .icon-dot{
                  background: $--login-main;
                  color: #fff;
               }
            }
            span{
              color: $--login-main;
            }
          }
        span{
          margin-left: 10px;
        }
        .icon-circle{
          width: 45px;
          height: 45px;
          border:1px solid  #A0A0A0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-dot{
            background: #A0A0A0;
            color: #fff;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .steps-content{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 40px;
      .row-error-tips{
        left: 160px;
      }
      .confirm-tips{
        color: #666666;
        font-size: 14px;
        margin-top: 30px;
      }
      .confirm-img{
        margin: 0 auto;
      }
      .check-now{
        height: 40px;
        line-height: 40px;
        width: 400px;
        margin: 0 auto;
        margin-top: 30px;
        box-sizing: border-box;
        font-size: 14px;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        .check-text{
          border:1px solid #DEDEDE;
          border-right: 0px;
          text-align: center;
          flex: 1;
        }
        .btn-now{
          color: #fff;
          width: 120px;
          text-align: center;
          background:$--login-main ;
          font-size: 14px;
          top: 50%;
          height: 42px;
          cursor: pointer;
        }
      }
    }

}
</style>
