<template>
  <div class="container">
    <!--内容区-->

    <div class="box">
      <aside><span>添加菜谱</span></aside>
      <el-form ref="form" :rules="rules" width="50px">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input style="width: 300px" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="80px" require="true">
          <el-select v-model="form.cate" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间(分钟)" label-width="80px" >
          <el-input style="width: 200px" v-model="form.time" type="number"></el-input>
        </el-form-item>
        <el-form-item label="难度" label-width="80px">
          <el-rate :max="10" v-model="form.difficulty"></el-rate>
        </el-form-item>
        <el-form-item label="图片" label-width="80px">
          <el-upload
            :action="uploadActionUrl"
            list-type="picture-card"
            :file-list="imgs"
          :on-success="uploadSuccess"
          :headers=header
            :limit="6"
            :on-remove="removeImg"
            :on-exceed="onExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!--材料-->
        <el-form-item label="食材" label-width="80px">
          <el-table :data="foodList" size="mini" :show-header="false" style="width: 400px">
            <el-table-column
              prop="name"
              label="名称"
              width="180px">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="数量"
              width="120px">
            </el-table-column>
            <el-table-column
              label="数量"
              width="100px">
              <template slot-scope="scope">
                <el-button @click="removeFood(scope.$index)" class="el-icon-error" size="small" type="danger"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="add-food"><el-button @click="addfood" size="small" type="primary" icon="el-icon-plus" :plain="true"></el-button></div>
        </el-form-item>
        <el-form-item label="步骤" label-width="80px">
          <div style="overflow: auto" v-for="(item,index) in form.steps">
            <div>步骤{{index+1}}<span @click="stepDel(index)" style="color: red;font-size: 15px;padding-left: 5px;cursor: pointer" class="el-icon-error"></span></div>
            <div class="step-form">
              <!--左边标题和内容 右边图片-->
              <div class="step-left">
                <div  class="avatar-uploader" v-if="item.img">
                  <div @click="removeStepImg(index)" class="image-preview-action">
                    <i  class="ab-al el-icon-delete" style="line-height: 180px"></i>
                  </div>
                  <img style="width: 100%;" v-if="item.img" :src="item.img" class="avatar" alt="">
                </div>
                <el-upload v-else action="" :data="{index:index}" class="avatar-uploader" :show-file-list="false" :http-request="uploadStepFile">
                  <i  class="ab-al el-icon-plus avatar-uploader-icon">{{item.img}}</i>
                </el-upload>
              </div>
              <div class="step-right">
                <label>
                  <textarea class="step-title" :value="item.title"></textarea>
                </label>
                <!--<el-input type="textarea" placeholder="标题" :rows="10" class="step-title" size="mini"  v-model="item.title"></el-input>-->
              </div>

            </div>
          </div>
          <div  class="add-step"><el-button @click="addstep" size="small" type="primary" icon="el-icon-plus" :plain="true"></el-button></div>
        </el-form-item>
        <el-form-item align="center" label-width="80px">
          <el-button  type="primary" @click="submitAdd()">{{ id ?'更新':'添加'}}</el-button>
          <el-button @click="goback">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--添加材料弹框-->
    <el-dialog
      title="添加材料"
      :modal="false"
      :visible.sync="dialogVisible"
      width="360px">
      <div>
        <el-form style="width: 100%" label-width="80px" size="mini">
          <el-form-item label="食材">
            <el-select v-model="foodForm.id" filterable  placeholder="请选择" ref="sel">
              <el-option
                v-for="item in foodoptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" >
            <el-input style="width:180px" v-model="foodForm.unit"></el-input>
          </el-form-item>
          <el-form-item label-width="0"  align="center">
            <el-button @click="addToList" type="primary">添加</el-button>
          </el-form-item>
        </el-form>


      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import request from '../../api/public'
  import CoreApi from '../../api/CoreApi'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'addMenu',
    data: function() {
      let  header={
          "token":getToken()
      };
      let uploadActionUrl=process.env.VUE_APP_BASE_API+CoreApi.uploadActionUrl
      return {
          header,
          uploadActionUrl,
        // 分类选项
          imgs:[],
        id:null,
        dialogVisible:false,
        foodoptions:[],
        options:[],
        // 添加材料
        foodForm:{
          id:null,
          name:null,
          unit:null
        },
        foodList:[],
        stepForm:{title:null,content:null,img: null},
        form: {
          steps:[],
          imgs:[],
          name: null,
          difficulty:null,
          cate:null,
          time:null,
          tags:[]
        },
        rules:{
          named :[{required: true, message: '请输入', trigger: 'blur'}],
          sex :[{required: true, message: '请输入', trigger: 'blur'}]
        }
      }
    },
    created(){
    //  初始化
    //  加载分类选项
      this.id=this.$route.query.id;
      this.url=this.$route.query.url;
       // 如果有id 就是编辑 否者就是新增
      if(this.id){
      //  拉取数据
        request.get(CoreApi.FOOD_MENULIST+this.id+'/',{}).then(res=>{
          this.foodList=res.foodList;
          this.form.name=res.name;
          this.form.difficulty=res.difficulty;
          this.form.time=res.time;
          this.form.cate=res.cate;
          this.form.is_active=res.is_active;
          this.form.tags=res.tags;
          for (var i = 0; i < res.imgs.length; i++) {
            this.imgs.push({name:"",url:res.imgs[i]+"?x-oss-process=style/size"})
          }
          this.form.steps=res.steps;
          }
        )
      }
      if(this.url){
        let data={url:this.url}
        Promise.all([request.post(CoreApi.FOOD_MENULIST+'importitem/',data),request.get(CoreApi.FOOD_CATELIST_CHILDRENS, {}),request.get(CoreApi.FOOD_FOODCATE+'options/',{})]).then(vals=>{
          console.log(vals)
        })
        this.feathOptions()

        request.post(CoreApi.FOOD_MENULIST+'importitem/',data).then(res=>{
          this.form.name=res.name
          var imgs=res.imgs
          this.form.imgs=imgs.map(function(i){return {name:"",url:i}})
          this.form.steps=res.steps
        })
      }

      },
    methods: {
      feathOptions(){
        request.get(CoreApi.FOOD_CATELIST_CHILDRENS, {}).then(res => {
          this.options = res
          return res
        })
      },
      goback() {
        this.$router.back(-1)
      },
      // 提交添加
      submitAdd() {
        // 数据校验
        //更新还是添加
          this.form.imgs=[];
          for(let i=0;i<this.imgs.length;i++){
              this.form.imgs.push(this.imgs[i].url.split("?")[0])
          }
        if(this.id){
          request.put(CoreApi.FOOD_MENULIST+this.id+'/',this.form).then(res=>{
              console.log(this.form)
            this.goback()
          })
        }else{
          request.post(CoreApi.FOOD_MENULIST,this.form).then(res => {
            this.goback()
          })
        }
      },
      removeImg(t,f) {
          this.imgs=f
      },
      removeFood(index) {
        this.foodList.pop(index)
      },
      onExceed: function() {
        Message({
          message: '仅支持一张图片',
          type: 'warning',
          duration: 5 * 1000
        })
      },
      // 添加材料 打开弹框
      addfood:function() {
        this.dialogVisible=true;
      //  加载下拉选项
        request.get(CoreApi.FOOD_FOODLIST_SELECT,{}).then(res=>{
          this.foodoptions=res
        })

      },
      addstep:function() {
      //  添加步骤
        this.form.steps.push(this.stepForm);
        this.stepForm={}
      },
      stepDel: function(index){
        this.form.steps.pop(index);
        this.$notify.success({
          title: 'Info',
          message: '删除成功',
          showClose: false
        });
      },
      addToList:function() {
        this.foodForm.name=this.$refs.sel.query
        this.dialogVisible=false
        this.foodList.push(this.foodForm)
      },
      // 步骤图片
      uploadStepFile:function(file) {
        const formData = new FormData()
        formData.append('file', file.file)
        request.post(CoreApi.uploadActionUrl, formData).then(res => {
          this.form.steps[file.data.index].img=res.url
          Message({
            message: '上传成功',
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(err => {
          console.log(err)
        })

      },
      removeStepImg:function(index) {
        this.form.steps[index].img=null
      },

        uploadSuccess(response, file, fileList){
            this.imgs.push({"name":"","url":response.url})
        }

    }
  }
</script>

<style scoped>
  .app-main{
    overflow: auto;

  }
  .container{
    min-width: 600px;
    overflow: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .container .box{
    margin: 30px 60px;
    border: 1px solid #eee;
    padding: 10px 10px 10px;

  }
  .container .box:hover{
      box-shadow: 0 2px 7px rgba(0,0,0,.15);
      border-color: transparent;
      position: relative;
  }
  .container .box:before{
    content: "";
    display: table;
  }
  .ab-al{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .box .add-food{
    width: 400px;
    text-align: center;
    margin-left: -40px;
    margin-bottom: 10px;
    margin-top: 10px
  }
  .add-step{
    margin-left: 140px;
  }

  .step-form{
    min-width: 600px;
    margin-bottom: 10px;
    position: relative;
    height: 200px;
    width:600px;
    border: 1px dashed #1890ff;
  }

  .step-form .step-right .step-title{
    padding: 5px 10px 5px;
  }
  .step-form .step-right{
    width: 67%;
    height: 100%;
    float: left;
  }
  .step-form .step-left{
    height: 100%;
    width: 33%;
    float: left;
  }
  .step-form .step-left .avatar-uploader{
    position: relative;
    height: 100%;
    width: 100%;
    padding: 10px;

  }
  .step-form .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 200px;
    text-align: center;
  }
  .step-form .step-left .image-preview-action{
    z-index: 9999;
    position: absolute;
    padding: 10px;
    left: 10px;
    top: 10px;
    right: 10px;
    bottom: 10px;
    cursor: pointer;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    text-align: center;
    line-height: 200px;
  }
  .step-form .image-preview-action:hover{
    opacity: 1;
  }
  .step-form .step-title{
    resize:none;
    margin-top: 10px;
    margin-left: 10px;
    width: 380px;
    height: 180px
  }

</style>
