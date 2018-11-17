<template>
  <div class="goods">
    <el-button type="success" @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table v-loading="loading" :data="goodsList" width="100%">
      <el-table-column
      label="商品名称" 
      prop="goods_name">
      </el-table-column>
      <el-table-column label="商品价格" prop="goods_price">
      </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight">
      </el-table-column>
      <el-table-column label="创建时间" prop="upd_time">
        <template slot-scope="scope">
          {{new Date(scope.row.upd_time*1000).toLocaleDateString()}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="showEditDialog(scope.row)" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" @click="delGoods(scope.row.goods_id)" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页 -->
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="5"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      currentPage: 1,
      total: 0,
      loading: false
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      this.loading = true
      let res = await this.axios.get(`goods`, {
        params: {
          pagenum: this.currentPage,
          pagesize: 5
        }
      })
      let { meta: { status }, data: { goods, total } } = res
      if (status === 200) {
        this.goodsList = goods
        this.total = total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsList()
    },
    async delGoods(id) {
      try {
        await this.$confirm('你确定要删除此商品', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`goods/${id}`)
        if (res.meta.status === 200) {
          this.getGoodsList()
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
