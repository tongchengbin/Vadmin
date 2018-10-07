<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" style="width: 200px;"  placeholder="用户名/邮箱"></el-input>
      <el-button  type="primary"  icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button @click="handleCreate" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="头像" width="70px">
        <template slot-scope="scope">
          <img  :src="scope.row.avatar" width="50px">
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="scope">
            <span >{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="70px" align="center"  label="管理员">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.is_admin" type="success">是</el-tag>
        <el-tag v-else type="info">否</el-tag>
      </template>
      </el-table-column>
      <el-table-column align="center" label="角色"  width="100">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles" type="primary" :key="item.id" disable-transitions>{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="注册日期">
        <template slot-scope="scope">
          <span v-if="scope.row.reg_time">{{scope.row.reg_time | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="上次登陆" width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.last_login">{{scope.row.last_login | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="200">
        <template slot-scope="scope">
          <el-button  type="success" @click="handleUpdate(scope.row)" size="small" icon="el-icon-circle-check-outline">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog  :visible.sync="dialogFormVisible"   width="960px" top="5vh">
      <el-form  ref="dataForm" :model="formData" label-position="left" label-width="60px" style='width: 600px; margin: auto auto;font-size: 13px;line-height: 0px'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮    箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="密    码" prop="password">
          <el-input v-model="formData.password"></el-input>password_aline
        </el-form-item>
        <el-form-item label="确认密码" prop="">
          <el-input v-model="formData.confirm_password"></el-input>
        </el-form-item>
        <el-form-item label="角    色">
          <template>
            <el-transfer  :titles="['所有角色', '当前角色']"  v-model="formData.roles" :data="RolesData"></el-transfer>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="updateData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CommonApi } from '@/api/account'

export default {
  name: 'account-admin',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        search: null,
        page: 1,
        limit: 10
      },
      dialogStatus: 'update',
      dialogFormVisible: false,
      RolesData: [],
      formData: {
        email: null,
        id: null,
        username: null,
        roles: [],
        is_admin: null,
        is_superuser: null
      }
    }
  },
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
  created() {
    this.getList(this.listQuery)
    this.getRoleData()
  },
  methods: {
    getList() {
      this.listLoading = true
      CommonApi('user', 'get', this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      })
    },
    getRoleData() {
      CommonApi('role', 'get', {}).then(response => {
        response.data.forEach(item => {
          this.RolesData.push({
            'label': item.name, 'key': item.id
          })
        })
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
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'post'
      this.dialogFormVisible = true
      this.restFormData()
    },
    restFormData() {
      this.formData = {
        email: null,
        id: null,
        username: null,
        roles: [],
        is_admin: null,
        is_superuser: null
      }
    },
    handleUpdate(row) {
      // get roles data
      this.dialogStatus = 'put'
      this.formData = row
      this.dialogFormVisible = true
    },
    updateData() {
      CommonApi('user', this.dialogStatus, this.formData).then(response => {
        if (response.status === 200 || response.status === 201) {
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
    }
  }
}
</script>

<style scoped>
  .el-dialog {
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
