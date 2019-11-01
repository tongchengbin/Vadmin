<template>
  <div class="app-container">
    <!--搜索-->
    <div class="filter-container">
      <el-input v-model="listQuery.search" size="small" style="width: 200px;" placeholder="用户名/邮箱" />
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button size="small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <!--用户列表-->
    <el-table v-loading.body="listLoading" size="mini" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="头像" width="70px">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="50px">
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70px" align="center" label="超管">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_superuser" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="70px" align="center" label="管理员">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_admin" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="180">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles" :key="item.id" type="primary" disable-transitions>{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册日期">
        <template slot-scope="scope">
          <span v-if="scope.row.reg_time">{{ scope.row.reg_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次登陆" width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.last_login">{{ scope.row.last_login | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)" />
          <el-button type="danger" size="small" icon="el-icon-delete" @click="userDelete(scope.row)" />
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
    <!--编辑框-->
    <el-dialog :visible.sync="dialogFormVisible" custom-class="usereidt">
      <el-form ref="dataForm" size="mini" :model="formData" label-position="left" label-width="80px" label-suffix=":" style="width: 600px; margin: auto auto;font-size: 13px;">
        <el-form-item size="mini" label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item size="mini" label="邮    箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item size="mini" label="密    码" prop="password">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>
        <el-form-item size="mini" label="确认密码" prop="confirm_password" style="font-size: 12px">
          <el-input v-model="formData.confirm_password" type="password" />
        </el-form-item>
        <el-form-item size="mini" label="角    色">
          <template>
            <el-transfer v-model="formData.roles" size="mini" :titles="['所有角色', '当前角色']" :data="RolesData" />
          </template>
        </el-form-item>
        <el-form-item size="mini" label="管理员">
          <el-switch v-model="formData.is_admin" />
        </el-form-item>
        <el-form-item size="mini" label="超    管">
          <el-switch v-model="formData.is_superuser" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='add'" type="primary" @click="updateData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/public'
import CoreApi from '@/api/CoreApi'
import { mapGetters } from 'vuex'

export default {
  name: 'Account',
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
        is_superuser: null,
        confirm_password: null,
        password: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
    this.getRoleData()
  },
  methods: {
    getList() {
      this.listLoading = true
      request.get(CoreApi.ACCOUNT_USER_LIST, this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      })
    },
    userDelete(row) {
      request.httpDelete(CoreApi.ACCOUNT_USER_PK, row.id).then(res => {
        this.getList()
      })
    },
    getRoleData() {
      request.get(CoreApi.ACCOUNT_ROLE_GET, {}).then(response => {
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
      this.dialogStatus = 'add'
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
      this.dialogStatus = 'edit'
      this.formData = row
      this.dialogFormVisible = true
    },
    updateData() {
      if (this.dialogStatus === 'add') {
        request.post(CoreApi.ACCOUNT_USER_LIST, this.formData).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchData()
        }).catch(res => {
          if (res.response.status === 400) {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
      } else {
        console.log('edit')
        request.put(CoreApi.ACCOUNT_USER_PK, this.formData, this.formData.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchData()
        })
      }
    }
  }
}
</script>
<style>
  .usereidt {
    width: 700px;
  }

</style>
