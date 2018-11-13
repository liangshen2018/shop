<template>
  <div class="roles">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item >权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="showAddRole">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-if="props.row.children.length === 0">暂无权限</el-row>
          <el-row v-for="level1 in props.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag closable @close="delOneRight(props.row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag closable @close="delOneRight(props.row, level2.id)" type="success">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag closable @close="delOneRight(props.row, level3.id)" class="level3" type="danger" v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作">
           <template slot-scope="props">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEidtRole(props.row)"></el-button>
            <el-button type="danger"  icon="el-icon-delete" plain size="small" @click="delRole(props.row)"></el-button>
            <el-button type="success" icon="el-icon-check" plain size="small" @click="showRights(props.row)">分配权限</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 权限显示框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightVisible">    
      <el-tree
        ref="tree"
        :data="rightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps">
      </el-tree> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightVisible= false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 添加角色显示框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleVisible">    
      <el-form status-icon :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible= false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改角色显示框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="roleEidtVisible">    
      <el-form status-icon :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleEidtVisible= false">取 消</el-button>
        <el-button type="primary" @click="eidtRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId: '',
      rolesList: [],
      rightVisible: false,
      rightsList: [],
      roleVisible: false,
      roleEidtVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: false, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 删除指定权限
    async delOneRight(role, rightId) {
      console.log(role)

      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
      }
    },
    // 显示权限设置
    async showRights(rights) {
      this.roleId = rights.id
      this.rightVisible = true
      let res = await this.axios.get(`rights/tree`)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightsList = data
        let temp = []
        rights.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(temp)
        })
      }
    },
    // 分配权限
    async assignRights() {
      let checked = this.$refs.tree.getCheckedKeys()
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      let ids = [...checked, ...halfChecked]
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: ids.join()
      })
      if (res.meta.status === 200) {
        this.getRolesList()
        this.rightVisible = false
      }
    },
    // 显示添加角色框
    showAddRole() {
      this.roleVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    // 添加角色
    addRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.post('roles', this.addForm)
        if (res.meta.status === 201) {
          this.roleVisible = false
          this.getRolesList()
        }
      })
    },
    // 显示修改
    showEidtRole(role) {
      this.roleEidtVisible = true
      this.roleId = role.id
      this.addForm.roleName = role.roleName
      this.addForm.roleDesc = role.roleDesc
      console.log(role)
    },
    eidtRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`roles/${this.roleId}`, this.addForm)
        console.log(res)
        let { meta: { status } } = res
        if (status === 200) {
          this.roleEidtVisible = false
          this.getRolesList()
        }
      })
    },
    // 删除角色
    async delRole(role) {
      let res = await this.axios.delete(`roles/${role.id}`)
      if (res.meta.status === 200) {
        this.getRolesList()
      }
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
