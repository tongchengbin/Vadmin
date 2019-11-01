<template>
  <div class="main">
    <div class="container-header clearfix">
      <!--搜索类-->
        <el-form class="params" size="mini" :inline="true">
          <el-form-item label="大类">
              <el-select v-model="params.parent" placeholder="大类" clearable >
                <el-option
                  v-for="(item,index) in parentCateOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="params.name" ></el-input>
          </el-form-item>
          <el-form-item ><el-button type="primary" @click="foodlist">搜索</el-button></el-form-item>
        </el-form>
        <el-button @click="handleAdd" class="header-add" size="small" type="primary" >添加</el-button>
    </div>
    <div class="page-container">
      <div class="page-data">
        <el-table :data="fooddata" :border="true" :highlight-current-row="true" style="width: 100%">
          <el-table-column align="center" type="index" min-width="10%" :index="indexMethod"></el-table-column>
          <el-table-column
            min-width="20%"
            prop="parent_name"
            label="上级分类"
            align="center"></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            min-width="20%"
            align="center"></el-table-column>
          <el-table-column
            label="是否启用"
            min-width="20%"
            align="center">
            <template slot-scope="scope">
              <el-switch @change="changeSwitch(scope.$index)" v-model="scope.row.is_active"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="30%">
            <template slot-scope="scope">
              <el-button @click="actionEdit(scope.$index)" size="mini" type="primary">编辑</el-button>
              <el-button @click="actionDel(scope.$index)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-page">
        <el-pagination :background="true" layout="prev, pager, next" :total="listTotal"  @current-change="changePgae">
        </el-pagination>
      </div>
      <div>
        <div class="edit-dialog">
          <el-dialog
            title="菜单分类编辑"
            :visible.sync="editDialog"
            :modal-append-to-body="false"
            width="400px"
            :before-close="handleClose">
            <el-form size="mini" label-position="right" label-width="80px" :model="editForm">
              <el-form-item label="上级">
                <el-select v-model="editForm.parent" placeholder="大类" clearable >
                  <el-option
                    v-for="(item,index) in parentCateOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="editForm.is_active"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="add-dialog">
          <el-dialog
            title="添加菜单分类"
            :visible.sync="addDialog"
            :modal-append-to-body="false"
            width="400px"
          >
            <el-form size="mini" label-position="right" label-width="80px" :model="addForm">
              <el-form-item label="上级">
                <el-select v-model="addForm.parent" placeholder="大类" clearable >
                  <el-option
                    v-for="(item,index) in parentCateOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称">
                <el-input style="width: 180px" v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="addForm.is_active"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitAdd()">添加</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Message } from 'element-ui'
import request from '../../api/public'
import CoreApi from '../../api/CoreApi'
export default {
  data() {
    return {
      parentCateOptions: null,
      editForm: {
        id: null,
        parent: null,
        parent_name: null,
        is_active: null,
        name: null
      },
      editDialog: false,
      addForm:{
        id: null,
        parent: null,
        parent_name: null,
        is_active: null,
        name: null
      },
      addDialog:false,
      params: {},
      fooddata: [],
      listTotal:0
    }
  },
  created() {
    request.get(CoreApi.FOOD_CATELIST_PARENT).then(res => {
      this.parentCateOptions = res
      console.log("search",this.parentCateOptions)
    })
    this.foodlist(this.params)
  },
  methods: {
    // 菜单列表
    foodlist() {
      request.get(CoreApi.FOOD_CATELIST, this.params).then(res => {
        this.fooddata = res.results
        this.listTotal=res.count
      })
    },
    //换页
    changePgae(page) {
      this.params.page=page
      this.foodlist()
    },
    actionEdit(id) {
      // 获取以及菜单
      request.get(CoreApi.FOOD_CATELIST_PARENT).then(res => {
        this.parentCateOptions = res
        this.editForm = this.fooddata[id]
        this.editDialog = true
      })
    },
    actionDel(index) {
      // 删除
      console.log(index)
      request.delete(CoreApi.FOOD_CATELIST + this.fooddata[index].id + '/').then(res => {
        Message({
          message: '删除成功',
          type: 'warn',
          duration: 5 * 1000
        })
        this.foodlist(this.params)
      })
    },
    indexMethod(index) {
      return index * 2
    },
    handleClose(e) {
      this.editDialog = false
      console.log('关闭编辑')
    },
    handleEdit() {
      console.log('edit')
    },
    handleAdd() {
      request.get(CoreApi.FOOD_CATELIST_PARENT).then(res => {
        this.parentCateOptions = res
        this.addDialog = true
      })
    },
    submitAdd: function() {
      request.post(CoreApi.FOOD_CATELIST, this.addForm).then(res => {
        Message({
          message: '添加成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.addDialog=false
        this.foodlist(this.params)
      }).catch(err=>{
        Message({
          message: err.response.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
      })

    },
    changeSwitch: function(index) {
      const item = this.fooddata[index]
      request.patch(CoreApi.FOOD_CATELIST + item.id + '/', { 'is_active': item.is_active }).then(res => {
        console.log(item.is_active)
        console.log(this.fooddata[index].is_active)
      })
      console.log(index, 'ddf')
    },
    submitForm: function() {
      request.put(CoreApi.FOOD_CATELIST + this.editForm.id + '/', this.editForm, this.editForm.id).then(res => {
        this.editDialog = false
        Message({
          message: '提交成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.foodlist()
      })
    }
  }
}
</script>
<style>
  .main{
    min-height: 450px;
  }

  .container-header{
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
  }
  .page-container{
    margin: 20px 20px;
    padding: 25px 10px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
  }
  .page-data{
    width: 100%;
    overflow: auto;
  }
  .container-header{
    margin: 10px 20px;
    border: dashed 1px #1890ff;
    clear: both;
    padding: 5px;
  }
  .container-header .params{
    display: inline-block;
  }
  .container-header .params .el-form-item{
    margin-bottom: 0;
  }
  .container-header .header-add{
    float: right;
  }
  .header-add{
    float: right;
  }
  .m-page{
    padding: 30px 10px 20px 10px;
    text-align: right;
  }
  .action{
    padding-top: 1px;
    padding-right: 8px;
    padding-left: 8px;
    padding-bottom: 1px;
  }
  .clearfix:before {
    content: "\20";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .uploader-box{
    position: relative;
    width: 148px;
    height: 148px;
  }
</style>
