<template>
<div class="login_container">
  <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px" class="login_form">
  <img src="../assets/avatar.jpg" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
  </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="submitForm('form')">登入</el-button>
    <el-button @click="resetForm('form')">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 3,
            max: 9,
            message: '长度在 3 到 9 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post('http://localhost:8888/api/private/v1/login', this.form)
            .then(res => {
              console.log(res.data)
              if (res.data.meta.status === 200) {
                this.$message.success('登入成功')
                localStorage.setItem('token', res.data.data.token)
                this.$router.push('/home')
              } else {
                this.$message.error('用户名或密码错误')
              }
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  height: 100%;
  overflow: hidden;
  background-color: #2d434c;
  .login_form {
    width: 400px;
    padding: 70px 40px 15px;
    margin: 200px auto;
    background-color: #fff;
    border-radius: 15px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -80px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
