<template>
  <div class="app-container">
    <!--<div class="filter-container">-->
    <!--<el-input v-model="listQuery.search" style="width: 200px;"  placeholder="Search"></el-input>-->
    <!--<el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">Search</el-button>-->
    <!--<router-link>-->
    <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添加</el-button>-->
    <!--</router-link>-->
    <!--</div>-->

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="角色名" width="70px" prop="name" />
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { CommonApi } from '@/api/account'

export default {
  name: 'User',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList(this.listQuery)
  },
  methods: {
    getList() {
      this.listLoading = true
      CommonApi('role', 'get', this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
        console.log(this.list)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
