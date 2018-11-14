<template>
  <div class="categories">
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <el-table v-loading="loading" :data="categoryList" width="100%">
      <el-table-tree-column 
      tree-key="cat_id"
      parent-key="cat_pid"
      level-key="cat_level"
      label="分类名称" 
      prop="cat_name">
      </el-table-tree-column>
      <el-table-column label="是否有效" prop="cat_deleted">
        <template slot-scope="scope">
          {{scope.row.cat_deleted ? '是': '否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="showEditDialog(scope.row)" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" @click="delCategory(scope.row)" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
     <!-- 添加框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible">
      <!-- 表单 -->
      <el-form status-icon :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="level2List"
            change-on-select
            v-model="selectedOptions"
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click = "addCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editVisible">
      <!-- 表单 -->
      <el-form status-icon :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      addVisible: false,
      editVisible: false,
      addForm: {
        cat_name: ''
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      level2List: [],
      selectedOptions: [],
      props: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    // 删除分类
    async delCategory({ cat_id: catId }) {
      try {
        await this.$confirm('你去确定删除此分类', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${catId}`)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getCategoryList()
        }
      } catch (e) {
        this.$message.info('已取消')
      }
    },
    // 显示添加框
    async showAddDialog() {
      this.addVisible = true
      let res = await this.axios.get('categories?type=2')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.level2List = data
        console.log(this.level2List)
      }
    },
    // 添加分类
    addCategory() {
      let catPid = this.selectedOptions[this.selectedOptions.length - 1] || 0
      let catLevel = this.selectedOptions.length
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.post('categories', {
          cat_pid: catPid,
          cat_level: catLevel,
          cat_name: this.addForm.cat_name
        })
        if (res.meta.status === 201) {
          this.addVisible = false
          this.getCategoryList()
          this.$refs.addForm.resetFields()
          this.selectedOptions = []
          this.$message.success('添加成功')
        }
      })
    },
    // 显示编辑
    showEditDialog(val) {
      this.editVisible = true
      this.editForm.cat_name = val.cat_name
      this.editForm.cat_id = val.cat_id
    },
    editCategory() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status === 200) {
          this.editVisible = false
          this.$message.success('修改成功')
          this.$refs.editForm.resetFields()
          this.getCategoryList()
        }
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
