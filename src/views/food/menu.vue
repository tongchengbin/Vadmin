<template>
  <div class="main">
    <div class="page-header clearfix">
      <!--搜索类-->
      <el-input placeholder="名称搜索" v-model="params.name" size="mini"  class="header-input"></el-input>
      <el-button size="mini" type="primary" @click="menulist">搜索</el-button>
      <el-button class="header-add" size="small" type="primary" @click="importDialog=true" >导入</el-button>
      <router-link to='addMenu'><el-button class="header-add" size="small" type="primary" >添加</el-button></router-link>
    </div>
    <div class="page-containe">
      <div class="panel panel-default radius"></div>
      <div class="page-data">
        <el-table
          ref="table"
                  v-loading="loading" :data="menuList"
                  :border="true" :highlight-current-row="true"
                  @sort-change="sortChange"
                   style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="主图" align="center" type="index" width="100px" >
            <template slot-scope="scope">
              <div v-if="scope.row.display_img" style="width: 80px">
                <img  :src="scope.row.display_img+'?x-oss-process=style/size'" alt="" style="width: 100%">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="300px"
            prop="name"
            label="菜单"
            sortable="custom"
            align="center"></el-table-column>
          <el-table-column
            prop="cate_name"
            label="分类"
            width="120px"
            align="center"></el-table-column>
          <el-table-column
            label="是否启用"
            align="center"
            width="100px"
          >
            <template slot-scope="scope">
              <el-switch @change="changeSwitch(scope.$index)" v-model="scope.row.is_active"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            width="150px"
            prop="time"
            label="时间(分钟)"
            align="center"></el-table-column>
          <el-table-column width="180px" label="难度" align="center">
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.difficulty"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
            </template>
          </el-table-column>
          <!--<el-table-column width="200px" label="使用食材" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-for="item in scope.row.foodList">-->
                <!--<el-tag>-->
                  <!--{{item.name}}({{item.unit}})-->
                <!--</el-tag>-->
              <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="标签">
            <el-tag>好吃不上火</el-tag>
          </el-table-column>
          <el-table-column align="center" label="操作" width="400px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary"><router-link :to="{path:'addMenu',query:{id:scope.row.id}}">编辑</router-link></el-button>
              <el-button @click="actionDel(scope.$index)"size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!loading" class="mupAction">
          <el-button size="small" @click="mupDelete" type="danger">批量删除</el-button>
        </div>
      </div>
      <div  class="m-page">
        <el-pagination :background="true" layout="total, prev, pager, next" :total="listTotal"  @current-change="changePgae" :page-size="params.pagesize">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="导入"
               :modal="false"
               :visible.sync="importDialog"
               width="360px">
      <el-form size="mini">
        <el-form-item label="连接">
          <el-input v-model="importurl"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="submitImport" size="mini" type="primary">导入</el-button>
        <el-button @click="importDialog=false" size="mini" type="primary">取消</el-button>
      </div>
    </el-dialog>
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
        params: {
          name:null,
          page:1,
          pagesize:60,
          orderby:null
        },
        listTotal:0,
        loading:false,
        menuList: [],
        //导入dialog
        importDialog:false,
        importurl:null
      }
    },
    created() {
      this.menulist()
    },
    methods: {
      // 菜单列表
      menulist() {
        this.loading=true
        this.params.page=1
        request.get(CoreApi.FOOD_MENULIST, this.params).then(res => {
          this.menuList = res.results
          this.listTotal=res.count
          this.loading=false
        })
      },
      //换页
      changePgae(page) {
        this.params.page=page
        this.menulist()
      },
      actionEdit(id) {
        // 编辑 跳转新页面

      },
      // 修改排序
      sortChange(item){
        if(item.order==='descending'){
          this.params.orderby='-'+item.prop
        }else if(item.order==='ascending'){
          this.params.orderby='-'+item.prop
        }else{
          item.params.order=null
        }
        this.menulist()
      },
      actionDel(index) {
        // 删除
        request.delete(CoreApi.FOOD_MENULIST + this.menuList[index].id + '/').then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.menulist()
        }).catch(err=>{
          console.log(err)
          Message({
            message: '操作失败',
            type: 'error',
            duration: 5 * 1000
          })

        })
      },
      //批量删除
      mupDelete(){
        var ids=[]
        for(var i=0;i< this.$refs.table.selection.length;i++){
          ids.push(this.$refs.table.selection[i].id)
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.post(CoreApi.FOOD_MENULIST_MUPDEL,ids).then(res=>{
            Message({
              type: 'success',
              message: '删除成功'
            });
            this.menulist()
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
      submitAdd: function() {
        request.post(CoreApi.FOOD_CATELIST, this.addForm).then(res => {
          Message({
            message: '添加成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
        this.addDialog=false
        this.foodlist(this.params)
      },
      changeSwitch: function(index) {
        const item = this.menuList[index]
        request.patch(CoreApi.FOOD_MENULIST + item.id + '/', { 'is_active': item.is_active }).then(res => {
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
      },
      submitImport:function() {
        let data={"url":this.importurl}
        this.$router.push({
          name: 'addmenu',
          query: data
        });

      }
    }
  }
</script>
<style>
  .main{
    min-height: 450px;
  }
  .page-header{
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
  }
  .page-containe{
    margin: 20px 20px;
    padding: 25px 10px;
    /*position: absolute;*/
    /*top: 100px;*/
    /*left: 20px;*/
    /*right: 20px;*/
    /*bottom: 20px;*/
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
  }
  .page-data{
    width: 100%;
    overflow: auto;
    /*top: 70px;*/
    /*bottom: 80px;*/
  }
  .page-header{
    margin: 10px 20px;
    border: dashed 1px #1890ff;
    clear: both;
    padding: 5px;
  }
  .header-add{
    margin: 0 5px;
    float: right;
  }
  .m-page{
    padding: 10px 10px 10px 10px;
    text-align: right;
  }

  .panel-default {
    border-color: #ddd;
  }
  .radius {
    border-radius: 4px;
  }
  .panel {
    background-color: #fff;
  }
  .clearfix:before {
    content: "\20";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .page-header .header-input{
    display: inline-block;
    width: 120px;
  }
  .mupAction{
    margin: 10px 0;
  }
</style>
