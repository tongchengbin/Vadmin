<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" style="width: 200px;" placeholder="Search" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>
    <el-table v-loading="Loading" :data="list" stripe border style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="size" label="大小" />
      <el-table-column prop="source" label="来源" />
      <el-table-column prop="share_time" label="分享时间" />
      <el-table-column align="center" label="资源" width="100">
        <template slot-scope="scope">
          <a style="color: #409EFF" :href="scope.row.url" target="_blank">{{ scope.row.code | tonull }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="动作" width="200">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-circle-check-outline" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
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

    <el-dialog title="编辑" :visible.sync="dialogVisible">
      <el-form :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.desc" />
        </el-form-item>
        <el-form-item label="来源名称">
          <el-input v-model="temp.source_name" />
        </el-form-item>
        <el-form-item label="来源连接">
          <el-input v-model="temp.source_url" />
        </el-form-item>
        <el-form-item label="资源">
          <el-input v-model="temp.res" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="temp.tags" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="UpdateData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { yunpanlist, yunpanUpdate } from '@/api/shop'
import { Message } from 'element-ui'
export default {
  name: 'Sourse',
  filters: {
    tonull: str => {
      if (str.length < 1) {
        return '无密'
      } else {
        return str
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      temp: {
        source_name: null,
        source_url: null,
        title: null,
        default_img: null,
        res: null,
        url: null,
        desc: null
      },
      list: null,
      total: null,
      Loading: false,
      listQuery: {
        search: null,
        lang: null,
        offset: 0,
        limit: 10
      }
    }
  },
  created() {
    this.featchData()
  },
  methods: {
    featchData() {
      if (!this.Loading) {
        this.Loading = true
        yunpanlist(this.listQuery).then(response => {
          console.log(response)
          this.list = response.data.results
          this.total = response.data.count
          this.Loading = false
        })
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.featchData(this.listQuery)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.listQuery.offset = val * this.listQuery.limit - this.listQuery.limit
      this.featchData(this.listQuery)
    },
    jumptourl(url) {
      window.open(url)
    },
    handleDelete(index, row) {
      // goodsdelete(row).then(response => {
      //   this.handleFilter()
      // })
    },
    handleFilter() {
      this.listQuery.offset = 0
      this.featchData(this.listQuery)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.temp = row
    },
    UpdateData() {
      yunpanUpdate(this.temp).then(response => {
        Message({
          message: 'Update Success',
          type: 'success',
          duration: 5 * 1000
        })
      })
      this.dialogVisible = false
    }
  }
}
</script>
