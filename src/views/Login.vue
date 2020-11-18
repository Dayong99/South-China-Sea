<template>
  <div id="loginBox">
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="off"
        label-position="left"
      >
        <h3 class="login_title">航渡气象信息推演系统</h3>
        <div class="slogan">Welcome!</div>
        <el-form-item prop="username">
          <el-row :gutter="20">
            <el-col :span="4">
              <i class="iconfont icon-yonghu1" />
            </el-col>
            <el-col :span="20">
              <el-input
                v-model="loginForm.username"
                name="username"
                type="text"
                autocomplete="off"
                placeholder="用户名"
                clearable
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-row :gutter="20">
            <el-col :span="4">
              <i class="iconfont icon-mima1" />
            </el-col>
            <el-col :span="20">
              <el-input
                v-model="loginForm.password"
                :type="pwdType"
                name="password"
                placeholder="密码"
                clearable
                show-password
                @keyup.enter.native="handleLogin"
              />
            </el-col>
            <!-- <div class="pwd_tips">忘记密码</div> -->
          </el-row>
        </el-form-item>
        <el-form-item prop="code" class="code-input">
          <el-row :gutter="20">
            <el-col :span="4">
              <i class="iconfont icon-yanzhengma" />
            </el-col>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input
                    ref="code"
                    v-model="loginForm.code"
                    placeholder="验证码"
                    name="code"
                    type="text"
                    autocomplete="off"
                    clearable
                    @keyup.enter.native="handleLogin"
                  />
                </el-col>
                <el-col :span="9">
                  <img :src="imageCode" alt="codeImage" class="code-image" @click="getCodeImage">
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click.native.prevent="handleLogin">登 录</el-button>
        </el-form-item>
        <div class="login_tips">
          <!-- <span style="margin-right:20px;">username: admin</span>
          <span> password: admin</span>-->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
import { randomNum } from '@/utils'
import axios from 'axios'

export default {
  name: 'Login',

  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        code: { required: true, message: '验证码不能为空', trigger: 'blur' }
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,

      randomId: randomNum(24, 16),
      imageCode: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    db.clear()
    this.getCodeImage()
  },
  methods: {
    getCodeImage() {
      this.$getbuffer('auth/captcha?key=' + this.randomId)
        .then(res => {
          return (
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          )
        })
        .then(res => {
          this.imageCode = res
        })
        .catch(e => {
        })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$login('auth/oauth/token', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            bindUsername: '',
            bindPassword: '',
            signUsername: '',
            signPassword: '',
            code: this.loginForm.code,
            key: this.randomId
          })
            .then(r => {
              // this.saveLoginData(data);
              // // this.getUserDetailInfo();
              // // this.loginSuccessCallback();
              // this.$router.push("/");
              // console.log(data);
              this.$store
                .dispatch('Login', r.data)
                .then(() => {
                  this.$router.push('/')
                  this.loading = false
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(error => {
              //console.log('ddddddddddddddddd');
              console.error(error)
              this.loading = false
              this.getCodeImage()
            })
        } else {
          return false
        }
      })
    },
    saveLoginData(data) {
      this.$store.commit('account/setAccessToken', data.access_token)
      this.$store.commit('account/setRefreshToken', data.refresh_token)

      console.log(this.$store.state.account.accessToken)
      const current = new Date()
      const expireTime = current.setTime(
        current.getTime() + 1000 * data.expires_in
      )
      this.$store.commit('account/setExpireTime', expireTime)
    },
    getUserDetailInfo() {
      this.$get('auth/user')
        .then(r => {
          this.$store.commit('account/setUser', r.data.principal)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.loading = false
          this.$router.push('/')
        })
        .catch(error => {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
          console.error(error)
          this.loading = false
        })
    },
    loginSuccessCallback() {
      this.$get('system/user/success').catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
