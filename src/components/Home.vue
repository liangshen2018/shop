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
         :default-active="$route.path.slice(1).split('-')[0]"
         background-color="#545c64" 
         text-color="#fff"
         active-text-color="#ffd04b">
           <el-submenu v-for="level1 in menus" :key="level1.id" :index='level1.path'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{level1.authName}}</span>
              </template>
              <el-menu-item v-for="level2 in level1.children" :key="level2.id" :index="level2.path">
                <i class="el-icon-menu"></i>
                <span>{{level2.authName}}</span>
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
  data() {
    return {
      menus: []
    }
  },
  methods: {
    async loginout() {
      try {
        await this.$confirm('此操作将退出界面, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        this.$message.info('已取消')
      }
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    let { meta: { status }, data } = res
    if (status === 200) {
      this.menus = data
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
