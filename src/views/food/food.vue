<template>
  <div class="main">
    <div class="container-header clearfix">
      <!--搜索类-->
      <el-form class="params" size="mini" :inline="true">
        <el-form-item label="分类">
          <el-select v-model="params.type" placeholder="分类" clearable >
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="params.name" ></el-input>
        </el-form-item>
        <el-form-item ><el-button type="primary" @click="foodlist">搜索</el-button></el-form-item>
      </el-form>
      <el-button @click="actionAdd" class="header-add" size="small" type="primary" >添加</el-button>
      <el-button @click="actionCate" class="header-add" size="small" type="primary" >分类管理</el-button>
    </div>
    <div class="page-container">
      <div class="page-data">
        <el-table v-loading="loading"  size="mini" :data="fooddata" :border="true" :highlight-current-row="true" style="width: 100%;min-width: 600px">
          <el-table-column width="100px" label="主图" align="center" >
            <template slot-scope="scope">
              <div style="width: 80px;margin: auto">
                <img class="item-img" :src="scope.row.img" alt="" style="width: 100%">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="180px"
            align="center"></el-table-column>
          <el-table-column
            prop="cate_name"
            label="分类"
            width="100px"
            align="center"></el-table-column>
          <el-table-column
            prop="type_name"
            label="类型"
            width="100px"
            align="center"></el-table-column>
          <el-table-column
            prop="vname"
            width="200px"
            label="别名"
            align="center"></el-table-column>
          <el-table-column
            prop="suitable"
            width="250px"
            label="适宜人群"
            align="center"></el-table-column>
          <el-table-column
            prop="taboo"
            width="250px"
            label="禁忌人群"
            align="center"></el-table-column>
          <el-table-column
            prop="intake"
            label="食量建议"
            align="center"></el-table-column>
          <el-table-column align="center" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="actionEdit(scope.$index)">编辑</el-button>
              <el-button type="danger" size="mini" @click="actionDel(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-page">
        <el-pagination :background="true" layout="prev, pager, next" :total="total"  @current-change="changePgae">
        </el-pagination>
      </div>
    </div>
    <div>
      <div class="edit-dialog">
        <el-dialog
          :title="editForm.id?'菜单分类编辑':'添加菜单分类'"
          :visible.sync="editDialog"
          :modal-append-to-body="false"
          top="50px"
          width="500px"
          :before-close="handleClose"
        >
          <el-form size="small" label-position="right" label-width="80px" :model="editForm">
            <el-form-item label="图片">
              <div v-if="editForm.img" class="uploader-box">
                <div class="image-preview-action">
                    <i  class="el-icon-delete" style="margin: auto"></i>
                  </div>
                <img :src="editForm.img" alt="">
              </div>
                <el-upload v-else  class="uploader"
                  :show-file-list="false"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="fileList"
                  :http-request="uploadfile"
                  :limit="1"
                  :on-exceed="onExceed"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>

            </el-form-item>
            <el-form-item :required='true' label="分类">
              <el-select v-model="editForm.cate" placeholder="分类" clearable>
                <el-option
                  v-for="(item,index) in cateOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :required='true' label="类型">
              <el-select v-model="editForm.type" placeholder="类型" clearable>
                <el-option
                  v-for="(item,index) in typeOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" :required='true'>
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="别名">
              <el-input v-model="editForm.vname"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="editForm.is_active" />
            </el-form-item>
            <el-form-item label="食量建议">
              <el-input v-model="editForm.intake" />
            </el-form-item>
            <el-form-item label="适宜人群">
              <el-input v-model="editForm.suitable"></el-input>
            </el-form-item>
            <el-form-item label="禁忌人群">
              <el-input v-model="editForm.taboo"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-right:80px">
              <el-button type="primary" @click="submitForm">{{editForm.id?'提交':'添加'}}</el-button>
              <el-button @click="formRest">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <div class="cateDditDialog">
        <el-dialog :title="editForm.id?'菜单分类编辑':'添加菜单分类'"
                   :visible.sync="cateDditDialog"
                   :modal-append-to-body="false"
                   top="50px"
                   width="860px"
                   :before-close="handleCloseCate">
          <div class="container-cate" v-loading="cateloading">
            <ul class="parent-cate">
              <li v-for="(item,index) in cateList" class="cate-item" :class="{'active':item.id===currentLeft}">
                <span style="cursor: pointer" @click="loadChildren(item.id)">{{item.name}}</span>
                <div style="float: right">
                  <i @click="actionEdiaCate(index,0)" style="margin: 0 5px;cursor: pointer" class="el-icon-edit"></i>
                  <i @click="actionStep(index,-1)" style="margin: 0 5px;cursor: pointer" class="el-icon-arrow-up"></i>
                  <i @click="actionStep(index,1)" style="margin: 0 5px;cursor: pointer" class="el-icon-arrow-down"></i>
                </div></li>
            </ul>
            <ul class="children-cate">
              <li v-for="(item,index) in cateChildren " class="cate-children-item">
                <span>{{item.name}}</span>
                <div style="float: right">
                  <i @click="actionEdiaCate(index,1)" style="margin: 0 5px;cursor: pointer" class="el-icon-edit"></i>
                  <i @click="actionStep(index,-1)" style="margin: 0 5px;cursor: pointer" class="el-icon-arrow-up"></i>
                  <i @click="actionStep(index,1)" style="margin: 0 5px;cursor: pointer" class="el-icon-arrow-down"></i>
                </div>
              </li>
            </ul>
          </div>
        </el-dialog>
        <el-dialog :title="editCateNameForm.id?'分类编辑':'添加分类'"
            :visible.sync="editCateNameDialog"
                   size="mini"
            :modal-append-to-body="false"
            v-loading="cateloading"
            top="50px"
                   center
                   mode="inline"
            width="350px">
          <el-form size="mini" :inline="true">
            <el-form-item label="大类">
              <el-select v-model="editCateNameForm.parent" placeholder="分类" clearable >
                <el-option
                  v-for="(item,index) in cateList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="editCateNameForm.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="editCateNameDialog = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="submitCate">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>

</template>

<script>
import { Message } from 'element-ui'
import request from '../../api/public'
import CoreApi from '../../api/CoreApi'

export default {
  data: function() {
    return {
      loading:false,
      uploadActionUrl: CoreApi.uploadActionUrl,
      typeOptions: [{ name: '主料', type: 1 }, { name: '辅料', type: 2 }],
      editForm: {
        cate:null,
        img:null,
        type: null,
        id: null,
        parent: null,
        parent_name: null,
        is_active: null,
        name: null,
        intake: null,
        suitable: null,
        taboo: null,
      },
      editFormRest: {
        type: null,
        id: null,
        parent: null,
        parent_name: null,
        is_active: null,
        name: null,
        intake: null,
        suitable: null,
        taboo: null,
      },
      editDialog: false,
      fileList: [],
      total:null,
      params: {type:null,name:null},
      fooddata: [],
      cateDditDialog:false,
      cateChildren:[],
      cateList:[],
      currentLeft:null,
      cateloading:false,
      editCateNameDialog:false,
      editCateNameForm:{id:null,name:null,parent:null},
    }
  },
  created() {
    this.foodlist()
  },
  methods: {
    foodlist() {
      this.loading=true
      request.get(CoreApi.FOOD_FOODLIST, this.params).then(res => {
        this.fooddata = res.results
        this.total=res.count
        this.loading=false
      })
    },
    //换页
    changePgae(page) {
      this.params.page=page
      this.foodlist()
    },
    // 编辑
    actionEdit: function(id) {
      // 加载下拉
      request.get(CoreApi.FOOD_FOODCATE,{'is_options':null}).then(res=>{
        this.cateOptions=res
      })

      // 获取以及菜单
      this.editForm = Object.assign({}, this.fooddata[id])
      // 加载图片
      if (this.editForm.img) {
        this.fileList = [{ name: '未知', url: this.editForm.img }]
      } else {
        this.fileList = null
      }
      this.editDialog = true
    },
    formRest() {
      console.log("form rest")
      this.editForm={}
      this.editForm=this.editFormRest
    },
    // 添加
    actionAdd() {
      this.formRest()
      this.fileList = []
      this.editDialog = true
    },
    uploadfile(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      request.post(CoreApi.uploadActionUrl, formData).then(res => {
        this.editForm.img=res.url
      }).catch(err => {
        console.log(err)
      })
    },
    actionDel(index) {
      // 删除
      request.delete(CoreApi.FOOD_FOODLIST + this.fooddata[index].id + '/').then(res => {
        Message({
          message: '删除成功',
          type: 'warn',
          duration: 5 * 1000
        })
        this.foodlist()
      })
    },
    indexMethod(index) {
      return index * 2
    },
    handleClose(e) {
      this.editDialog = false
      console.log('关闭编辑')
    },
    handleCloseCate(){
      this.cateDditDialog=false
    },
    handleEdit() {
      console.log('edit')
    },

    submitForm: function() {
      if(this.editForm.id){
        request.put(CoreApi.FOOD_FOODLIST + this.editForm.id + '/', this.editForm, this.editForm.id).then(res => {
          this.editDialog = false
          Message({
            message: '修改成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.foodlist()
        }).catch(err=>{
          Message({
            message: '添加失败',
            type: 'error',
            duration: 5 * 1000
          })
        })
      }else{
        request.post(CoreApi.FOOD_FOODLIST, this.editForm).then(res => {
          Message({
            message: '添加成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.editDialog = false
          this.foodlist()
        }).catch(err=>{
          Message({
            message: '添加失败',
            type: 'error',
            duration: 5 * 1000
          })
        })

      }
    },
    // 文件上传-超出限制
    onExceed: function() {
      Message({
        message: '仅支持一张图片',
        type: 'warning',
        duration: 5 * 1000
      })
    },

    actionCate: function() {
      this.cateDditDialog=true
    //   获取一级分类
      this.cateloading=true
      request.get(CoreApi.FOOD_FOODCATE,{parent:-1}).then(res=>{
          this.cateList=res
        this.cateloading=false
      })
    },
    loadChildren(id){
      this.currentLeft=id
      this.cateloading=true
      request.get(CoreApi.FOOD_FOODCATE,{parent:id}).then(res=>{
        this.cateChildren=res
        this.cateloading=false
      })
    },
    actionEdiaCate(index,flag){
      if(flag===0){
        let form=this.cateList[index]
        this.editCateNameDialog=true
        this.editCateNameForm=Object.assign({},form)
      }else{
        let form=this.cateChildren[index]
        this.editCateNameDialog=true
        this.editCateNameForm=Object.assign({},form)
      }
    },
    actionStep(index,flag){
      let pk=this.cateList[index].id
      this.cateloading=true
      request.post(CoreApi.FOOD_FOODCATE+'step/',{'pk':pk,'flag':flag}).then(res=>{
        if(this.cateList[index].parent){
          this.reloadChildren(this.cateList[index].parent)
        }else{
          this.reloadParent()
        }
        this.cate=false
      })
    },
    submitCate(){
      let form={name:this.editCateNameForm.name,parent:this.editCateNameForm.parent}
      request.put(CoreApi.FOOD_FOODCATE+this.editCateNameForm.id+'/',form).then(res=>{
        this.editCateNameDialog = false
      })
     /*
      如果修改的是左边 加载左边 否者加载右边
      */
     if(form.parent){
       this.reloadChildren(form.parent)
     }else{
       this.reloadParent()
     }
    },
    reloadParent(){
      this.cateloading=true
      request.get(CoreApi.FOOD_FOODCATE,{parent:-1}).then(res=>{
        this.cateList=res
        this.cateloading=false
      })
    },
    reloadChildren(id){
      console.log('right',id)
      this.cateloading=true
      request.get(CoreApi.FOOD_FOODCATE,{parent:id}).then(res=>{
        this.cateChildren=res
        this.cateloading=false
      })
    }
  }
}
</script>
<style>
  .main{
    min-height: 450px;
  }
  .params .el-form-item{
    margin-bottom: 0;
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
  .page-data .img-box{
    text-align: center;
  }
  .page-data .img-box img{
    width: 100%;
  }
  .container-header{
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
    margin: 10px 20px;
    border: dashed 1px #1890ff;
    clear: both;
    padding: 0 5px 0 5px;
  }
  .container-header .params{
    display: inline-block;
  }
  .container-header .header-add{
    margin: 0 5px;
    float: right;
  }
  .header-add{
    float: right;
  }
  .m-page{
    padding: 30px 10px 20px 10px;
    text-align: right;
  }
  .clearfix:before {
    content: "\20";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .img-container img{
    overflow: hidden;
  }
  .edit-dialog input{
    width: 300px;
  }
  .edit-dialog .uploader{
  text-align: center;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
  }
  .edit-dialog .uploader i{
    margin: auto;
    font-size: 28px;
  }
  .uploader-box{
    position: relative;
    width: 148px;
    height: 148px;
  }
  .uploader-box img{
    border-radius: 5px;
    position: relative;
    width: 100%;
  }
  .uploader-box .image-preview-action{
    z-index: 9999;
    border-radius: 5px;
    position: absolute;
    padding: 10px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    text-align: center;
    line-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .uploader-box .image-preview-action:hover{
    opacity: 1;
  }


  /*分类编辑*/
  .cateDditDialog{


  }
  .cateDditDialog .container-cate{
    /*height: 500px;*/
    overflow: auto;
  }
  .cateDditDialog .container-cate .parent-cate{
    padding: 20px;
    float: left;
    width: 400px;

  }
  .cate-item, .cate-children-item{
    padding: 10px 10px;
  }
  .cateDditDialog .container-cate .children-cate{
    float: left;
    padding: 20px;
    width: 400px;
    display: inline-block;
  }
  .cateDditDialog .cate-item{
    list-style: none;
    /*cursor: pointer;*/

  }
  .active{
    background-color: aliceblue;
  }
  .cate-item:hover,.cate-children-item:hover{
    background-color: aliceblue;
  }
  .cateDditDialog .children-cate{
    padding: 5px 10px;
    list-style: none;
    /*cursor: pointer;*/
  }

</style>
