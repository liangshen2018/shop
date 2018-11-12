<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="loginout">
        欢迎光临
        <a href="javascript:;" @click='loginout'>退出</a>
      </div>
      <h1>电商后台管理</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
         <el-menu 
         router
         unique-opened 
         background-color="#545c64" 
         text-color="#fff"
         active-text-color="#ffd04b">
           <el-submenu index='1'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-submenu> 
            <el-submenu index='2'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-submenu> 
            <el-submenu index='3'>             
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="3-2">
                <i class="el-icon-menu"></i>
                <span>分类参数</span>
              </el-menu-item>
              <el-menu-item index="3-3">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-submenu> 
            <el-submenu index='4'>             
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-submenu> 
            <el-submenu index='5'>             
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="5-1">
                <i class="el-icon-menu"></i>
                <span>数据报表</span>
              </el-menu-item>
            </el-submenu> 
         </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    loginout() {
      this.$confirm('此操作将退出界面, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      float: left;
      width: 180px;
      height: 60px;
      background: url('../assets/logo.png') center no-repeat;
      background-size: contain;
    }
    .loginout {
      float: right;
      height: 60px;
      line-height: 60px;
      a {
        color: darkorange;
      }
    }
    h1 {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      overflow: hidden;
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
