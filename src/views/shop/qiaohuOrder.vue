<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" style="width: 200px;"></el-input>
      <el-select v-model="listQuery.ispay" placeholder="请选择">
        <el-option
          v-for="item in paytype"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        <el-button type="primary"  icon="el-icon-search" @click="handleSearch" ></el-button>
        <el-button type="primary"  icon="el-icon-edit" @click="handleCreate" >添加</el-button>
      </div>
    <div style="width: 100%">
      <el-table :data="list" style="width: 100%" border fit highlight-current-row >
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="url" label="连接"></el-table-column>
        <el-table-column prop="order_num" label="数量" width="70px"></el-table-column>
        <el-table-column prop="Completed" label="已完成" width="70px"></el-table-column>
        <el-table-column prop="order_price" label="金额" width="70px"></el-table-column>
        <el-table-column prop="pay_type" label="支付方式" width="80px"></el-table-column>
        <el-table-column prop="source" label="来源" width="80px"></el-table-column>
        <el-table-column  align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="支付">
          <template slot-scope="scope">
            <el-button v-if=scope.row.is_pay type="primary">已支付</el-button>
            <el-button v-else type="warning">待支付</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" label="Actions" width="270">
          <template slot-scope="scope">
            <el-button  type="success" @click="handleTask(scope.row)" size="small" icon="el-icon-circle-check-outline">任务</el-button>
            <el-button  type="success" @click="handleUpdate(scope.row)" size="small" icon="el-icon-circle-check-outline">编辑</el-button>
            <el-button  type="warning" @click="handleDelete(scope.row,scope.$index)" size="small" icon="el-icon-edit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="分享连接" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="order_num">
          <el-input-number v-model="temp.order_num"></el-input-number>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-switch v-model="temp.is_pay"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="taskFormVisible" custom-class="dialog-task">

    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/public'
import CoreApi from '@/api/CoreApi'
import Upload from '@/components/Upload/singleImage3'
import {  qiaohuDelete, qiaohuCreate } from '@/api/shop'
export default {
  name: 'goodsedit',
  omponents: {
    Upload
  },
  data() {
    return {
      // paytype: [{ id: 1, name: '已支付' }, { id: 2, name: '待支付' }],
      //任务对话框
      taskFormVisible:true,
      list: [],
      total: null,
      listQuery: {
        search: null,
        is_pay: null,
        page: 1,
        pagesize: 10
      },
      ialogStatus: null,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      dialogStatus: null,
      temp: {
        email: null,
        url: null,
        is_pay: null,
        order_num: null
      },
      paytype: [{
        value: '1',
        label: '已支付'
      }, {
        value: '0',
        label: '待支付'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      request.get(CoreApi.SHOP_QIAOHUORSER_LIST,this.listQuery).then(response => {
        this.list = response.data.results;
        this.total = response.data.count
      })
    },
    updateData() {
      request.get(CoreApi.SHOP_QIAOHUORSER_LIST,this.temp).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '操作s失败',
            type: 'warinning'
          })
        }
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    createData() {
      qiaohuCreate(this.temp).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    handleTask(row){
    //  查看任务
    },
    handleCreate() {
      console.log('fsdfsdf')
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleSearch() {
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val * this.listQuery.limit - this.listQuery.limit
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.pagesize = val;
      this.getList()
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.temp = row
    },
    handleDelete(row, index) {
      qiaohuDelete(row).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.list.splice(index, 1)
    }
  }
}
</script>
<style>
  .dialog-task{
    width: 90%;
  }
</style>
