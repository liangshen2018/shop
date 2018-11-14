<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 点击出现对话框 -->
    <el-button type="success" plain style="margin-left:15px" @click="userVisible = true">添加用户</el-button>
    <!-- 表格渲染 -->
     <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180px">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="180px">
        <template slot-scope="scope">
          <el-switch
            @change = "changeState(scope.row.mg_state,scope.row.id)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editShow(scope.row)" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger"  @click="delUser(scope.row.id)" icon="el-icon-delete" plain size="small"></el-button>
          <el-button type="success" @click="showAssignDialog(scope.row)" icon="el-icon-check" plain size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="userVisible">
      <!-- 表单 -->
      <el-form status-icon :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click = "addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editVisible">
      <!-- 表单 -->
      <el-form status-icon :model="form2" :rules="rules" ref="form2" label-width="100px">
        <el-form-item label="用户名">
           <span>{{form2.username}}</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form2.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form2.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalEidt">取 消</el-button>
        <el-button type="primary" @click = "editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignVisible">
      <!-- 表单 -->
      <el-form status-icon :model="assignForm" :rules="rules" ref="assignForm" label-width="100px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" prop="rid">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        )
      ) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    return {
      rolesList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      list: [],
      userVisible: false,
      editVisible: false,
      assignVisible: false,
      form2: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        rid: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      assignForm: {
        id: '',
        username: '',
        rid: ''
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 搜索功能
    search() {
      this.currentPage = 1
      this.getUsersList()
    },
    // 取消添加
    cancelAdd() {
      this.$refs.form.resetFields()
      this.userVisible = false
      this.$message.info('取消添加')
    },
    // 添加用户
    addUser() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('users', this.form)
          let { meta: { status } } = res
          if (status === 201) {
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getUsersList()
            this.userVisible = false
            this.$refs.form.resetFields()
            this.$message.success('添加成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除用户
    async delUser(id) {
      try {
        await this.$confirm('你确定要删除此用户', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`users/${id}`)
        let { meta: { status } } = res
        if (status === 200) {
          console.log(this.list)
          // ？this.list.length === 1
          if (this.list.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUsersList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 修改状态
    async changeState(statu, id) {
      let res = await this.axios.put(`users/${id}/state/${statu}`)
      let { meta: { status } } = res
      if (status === 200) {
        this.$message.success('设置状态成功')
      }
    },
    // 编辑用户SHOW
    editShow(obj) {
      this.form2.username = obj.username
      this.form2.id = obj.id
      this.form2.email = obj.email
      this.form2.mobile = obj.mobile
      this.editVisible = true
    },
    // 确认编辑用户
    editUser() {
      this.$refs.form2.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`users/${this.id}`, this.form2)
          if (res.meta.status === 200) {
            this.editVisible = false
            this.$message.success('更新成功')
            this.getUsersList()
            this.$refs.form2.resetFields()
          }
        } else {
          return false
        }
      })
    },
    cancalEidt() {
      this.editVisible = false
      this.form.username = ''
      this.form.email = ''
      this.form.mobile = ''
      this.id = ''
    },
    // 获取用户列表数据
    async getUsersList() {
      let res = await this.axios({
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { users, total } } = res
      if (status === 200) {
        this.list = users
        this.total = total
      }
    },
    // 分页条数改变触发
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUsersList()
    },
    // 点击页面
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsersList()
    },
    // 显示分配角色对话框
    async showAssignDialog({ id }) {
      this.assignForm.id = id
      this.getRolesList()
      this.assignVisible = true
      let res = await this.axios.get(`users/${id}`)
      let { meta: { status }, data: { rid, username } } = res
      if (status === 200) {
        rid = rid === -1 ? '' : rid
        this.assignForm.rid = rid
        this.assignForm.username = username
      }
    },
    assignRole() {
      this.$refs.assignForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
          rid: this.assignForm.rid
        })
        if (res.meta.status === 200) {
          this.assignVisible = false
          this.$message.success('分配成功')
          this.$refs.assignForm.resetFields()
        }
      })
    },
    // 获取所有角色列表
    async getRolesList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rolesList = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
}
.el-form {
  .el-input {
    width: 100%;
  }
}
</style>
