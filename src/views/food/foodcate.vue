<template>
  <div class="main">
    <div class="left l-f">
      <div class="inner-left">
        <div class="inner-header">
          <el-button @click="editCate('add')" size="mini" class="head-btn" type="primary">添加</el-button>
          <el-button @click="editCate('edit')"  size="mini" class="head-btn" type="primary">修改</el-button>
          <el-button @click="editCate('del')" size="mini" class="head-btn" type="primary">删除</el-button>
        </div>
        <div class="inner-header">
          <el-input
            size="mini"
          placeholder="请输入内容"
          v-model="typeSearch">
          <template   slot="append"><el-button type="primary" size="mini" @click="treeSearch" class="search el-icon-search"></el-button></template>
        </el-input>
        </div>
        <el-tree ref="tree" class="tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="container">
        <div class="page-header">
          <el-input placeholder="名称搜索" style="width: 100px" size="mini" v-model="params.name"></el-input>
          <el-button @click="foodlist" size=mini type="primary" class="el-icon-search"></el-button>
        </div>
        <div class="page-data">
          <el-table class="table-data" v-loading="loading"  size="mini" :data="fooddata" :border="true" :highlight-current-row="true" style="width: 100%;min-width: 300px">-->
            <el-table-column width="80px" label="主图" align="center" >
              <template slot-scope="scope">
                <div style="width: 60px"><img-viewer :src="scope.row.img"></img-viewer></div>
              </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称"
            width="160px"
            align="center"></el-table-column>
            <el-table-column
            prop="full_cate_name"
            label="分类"
            width="150px"
            align="center"></el-table-column>
            <el-table-column
              title="dsfsdfsfd"
            prop="type_name"
            label="类型"
            width="100px"
            align="center"></el-table-column>
            <el-table-column
              label="是否启用"
              min-width="40px"
              align="center">
              <template slot-scope="scope">
                <el-switch @change="changeSwitch(scope.$index)" v-model="scope.row.is_active"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
            prop="vname"
            width="150px"
            label="别名"
            align="center"></el-table-column>
            <el-table-column
            prop="suitable"
            label="适宜人群"
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
          <el-pagination :background="true" layout="total, prev, pager, next" :total="total"  @current-change="changePgae">
          </el-pagination>
        </div>
    </div>
    <div class="Dialog">
      <el-dialog
        :title="editCateNameForm.id?'分类编辑':'添加分类'"
        :visible.sync="editCateFormShow"
        :modal-append-to-body="false"
        top="50px"
        width="300px"
        :before-close="handleClose"
      >
        <el-form class="cate-form" size="mini">
          <el-form-item label="上级">
            <el-select  filterable  v-model="editCateNameForm.parent" placeholder="分类" clearable>
              <el-option
                v-for="(item,index) in editCateNameOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="editCateNameForm.name"></el-input>
          </el-form-item>
          <el-form-item label="">
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button @click="submitAddCate" size="mini" type="primary">确定</el-button>
                <el-button @click="editCateFormRest" size="mini" type="primary">取消</el-button>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        :title="editForm.id?'食材编辑':'食材添加'"
        :visible.sync="editDialog"
        :modal-append-to-body="false"
        top="50px"
        width="500px"
        :before-close="handleClose"
      >
        <el-form class="edit" size="small" label-position="right" label-width="80px" :model="editForm">
          <el-form-item label="图片">
            <div @click="editForm.img=null" v-if="editForm.img" class="uploader-box">
              <div class="image-preview-action">
                <i  class="el-icon-delete" style="margin: auto"></i>
              </div>
              <img :src="editForm.img" alt="">
            </div>
            <el-upload v-else  class="uploader"
                       :show-file-list="false"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :http-request="uploadfile"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item  :required='true' label="分类">
            <el-select  filterable  v-model="editForm.cate" placeholder="分类" clearable>
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
          <el-form-item label="别名" >
            <el-input v-model="editForm.vname"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="editForm.is_active"></el-switch>
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
  </div>

</template>

<script>
import { Message } from 'element-ui'
import request from '../../api/public'
import CoreApi from '../../api/CoreApi'
import ImgViewer from '../../components/ImgViewer'
export default {
  components: { ImgViewer },
  data: function() {
    return {
      //left
      typeSearch:null,
      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      editCateFormShow:false,
      editCateForm:{
        parent:null,
        id:null,
        name:null,
      },
      //right
      loading:false,
      tableSearch:null,
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
      cateOptions:[],
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
      editCateNameOptions:false,
      editCateNameForm:{id:null,name:null,parent:null},
    }
  },

  created() {
    this.loadTree()
    this.foodlist()
  },

  methods: {
    // tree
    loadTree() {
      request.get(CoreApi.FOOD_FOODCATE+'tree/',{}).then(res=>{
        this.treeData=res
      })
    },
    handleNodeClick(node) {
      this.params.page=1
      this.params.type=node.id
      this.foodlist()
    },
    editCate(action) {
      let currentNode=this.$refs.tree.getCurrentNode()
      if(action==='edit'){
        if(currentNode){
          this.editCateNameForm=currentNode
        }else{
          Message({
            message: '请选择节点',
            type: 'warn',
            duration: 5 * 1000
          })
          return
        }

      }else if(action==='del'){
        if(currentNode){
          request.delete(CoreApi.FOOD_FOODCATE+currentNode.id+'/').then(res=>{
            this.loadTree()
            Message({
              message: '删除成功',
              type: 'error',
              duration: 5 * 1000
            })
          })
        }else{
          Message({
            message: '请选择节点',
            type: 'warn',
            duration: 5 * 1000
          })
        }
        return
      }
      this.editCateFormShow=true
      request.get(CoreApi.FOOD_FOODCATE,{level:1}).then(res=>{
        this.editCateNameOptions=res
      })
    },
    submitAddCate() {
      if(this.editCateNameForm.id){
      //  edit
        request.patch(CoreApi.FOOD_FOODCATE+this.editCateNameForm.id+'/',this.editCateNameForm).then(res=>{
          this.editCateFormRest()
          this.loadTree()
        })
      }else{
        // add
        request.post(CoreApi.FOOD_FOODCATE,this.editCateNameForm).then(res=>{

          this.editCateFormRest()
          this.loadTree()
        })
      }
    },
    editCateFormRest() {
      this.editCateFormShow=false
      this.editCateFormRest={id:null,name:null,parent:null}
    },
    foodlist() {
      this.loading=true
      request.get(CoreApi.FOOD_FOODLIST, this.params).then(res => {
        this.fooddata = res.results
        this.total=res.count
        this.loading=false
      })
    },
    treeSearch() {
      this.loadTree()
      this.params.type=null
      this.foodlist()
    },
    //换页
    changePgae(page) {
      this.params.page=page
      this.foodlist()
    },
    // 编辑
    actionEdit: function(id) {
      // 加载下拉
      request.get(CoreApi.FOOD_FOODCATE,{level:2}).then(res=>{
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
    changeSwitch(index) {
    //  修改是否启用

      let item = this.fooddata[index]
      console.log(index,item)
      request.patch(CoreApi.FOOD_FOODLIST+item.id+'/',{is_active:!item.is_active}).then(res=>{
        console.log(res)
      })
    },
    formRest() {
      console.log("form rest")
      this.editForm={
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
      }
    },
    // 添加
    actionAdd() {
      request.get(CoreApi.FOOD_FOODCATE,{level:2}).then(res=>{
        this.cateOptions=res
      })
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
<style scoped>
  /*
  通用
  */
  .l-f{
    float: left;
  }
  .l-r{
    float: right;
  }


  /*
  vue
   */
  .search{
    /*color: #fff!important;*/
  }
  .el-select .el-input {
    width: 130px;
  }
  .el-input-group__append {
    background-color: #1890ff;
  }
  .el-input-group__append i{
    color: #fff;
  }
  .tree{
    height: 100%;
    overflow: auto;
    padding-top: 20px;
  }
  /*main*/
  .main{
    /*background-color: #9dc8db;*/
    position: absolute;
    left: 15px;
    right: 15px;
    top: 15px;
    bottom: 15px;
  }
  .left{
    overflow: hidden;
    height: 100%;
    width: 20%;
  }
  .left .inner-header{
    text-align: center;
  }
  .left .inner-header .head-btn{
    margin: 5px 0;
    width: 32%;
  }
  .left .inner-left{
    overflow: hidden;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px;
    height: 100%;

  }
  /*page header*/
  .page-header{
    border: solid 1px #eee;
    padding: 10px;
    margin-bottom: 20px;
    margin-left: 0;
    margin-right: 0;
  }

  .main .container{
    height: 100%;
    padding: 0 15px;
    overflow: auto;

  }
  .main .container .box{
    width: 100%;
    height: 100%;
  }
  .container .page-header .el-form-item{
    margin-bottom: 0;
  }

  .container .m-page{
    margin: 20px 10px;
    text-align: right;
  }
  /*table data*/
  .table-data thead th{
    width: 100%;
    background-color: #F5FAFE;
  }


  .clearfix {
    clear: both;
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
  .cate-form .el-input, .cate-form .el-select{
    width: 100%;
  }
  .edit .el-input{
    width: 320px;
  }
  .edit .el-select{
    width: 320px;
  }
</style>
