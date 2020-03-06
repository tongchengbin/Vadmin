<template>
  <div class="main">
<!--    轮播图配置-->
    <div class="shuffling">
      <div class="shuffling-show">一个轮播图</div>
<!--      控制数据-->
      <div class="s-table">
        <el-table>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="主图" align="center" type="index" width="80px" class="img-col" cell-class-name="changeCellStyle">
            <template slot-scope="scope">
              <div v-if="scope.row.display_img" style="width: 60px">
                <img-viewer :src="scope.row.display_img"></img-viewer>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="轮播名称" prop="name" align="center" type="index" width="80px" class="img-col" cell-class-name="changeCellStyle">
          </el-table-column>
          <el-table-column label="菜谱名称" prop="menu_name" align="center" type="index" width="80px" class="img-col" cell-class-name="changeCellStyle">
          </el-table-column>
          <el-table-column label="操作" prop="menu_name" align="center" type="index" width="80px" class="img-col" cell-class-name="changeCellStyle">
            <template slot-scope="scope">
              <el-button @click="actionDel(scope.$index)"size="mini" type="success">删除</el-button>
              <el-button size="mini" type="primary"><router-link :to="{path:'addMenu',query:{id:scope.row.id}}">上移</router-link></el-button>
              <el-button @click="actionDel(scope.$index)"size="mini" type="danger">下移</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import ImgViewer from '../../components/ImgViewer'
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
          pagesize:10,
          orderby:null
        },
        listTotal:0,
        loading:false,
        data: [],
        //导入dialog
        importDialog:false,
        importurl:null,
        detail:{
          data:{},
          visible:false
        }
      }
    },
    components: { ImgViewer },

    created() {
      this.getData()
    },
    methods: {
      // 菜单列表
      getData() {
        this.loading=true;
        request.get(CoreApi.FOOD_MENULIST,{}).then(res => {
          this.data = res.results;
          this.loading=false;
        })
      },
      //换页
      changePgae(page) {
        this.params.page=page;
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
          });
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

      },
      actionDetail(item){
        console.log(item,this.menuList)
        var obj=this.menuList[item]
        console.log(obj)
        request.get(CoreApi.FOOD_MENULIST+obj.id+'/').then(res=>{
          this.detail.visible=true
          this.detail.data=res
          console.log(res)
        })
      }
    }
  }
</script>
<style scoped>
  .right {
    float: right;
  }
  .main{
    overflow: auto;
    min-height: 450px;
  }
  .page-header{
    padding: 5px 5px;
    margin-top: 10px;
    margin-bottom: 0!important;
    margin-left: 20px;
    margin-right: 20px;
    border: dashed 1px #1890ff;
    clear: both;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px #e8ebeb;
  }
  .page-containe{
    margin: 10px 20px;
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
  .page-data table td{
    padding-top: 0;
    padding-bottom: 0;
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


  /*item*/
  .item-detail{

  }
  .item-detail .inner{
    padding: 10px 10px;

  }
  .item-detail .banner {
    /*display: block;*/
    /*width: 690px;*/
    /*height: 390px;*/
    /*overflow: hidden;*/
    /*border-radius: 8px;*/
  }
  .item-detail .banner .banner-item{
    border-radius: 10px;
  }
  .item-detail .title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
    line-height: 24px;
  }
  .item-detail .el-dialog__body{
    padding-top: 0px;
  }
  .item-detail .metarial{

  }

  .item-detail .mini-title {
    font-size: 18px;
    color: #333;
    line-height: 18px;
    font-weight: bold;
    margin: 30px 0 20px;
  }
  .metarial .lirre {
    width: 343px;
    border-right: 1px solid #e5e5e5;
  }
  .metarial .scname {
    display: inline-block;
    width: 254px;
    padding-right: 5px;
  }

  .metarial table {
    margin-left: 1px;
    color: #999;
    border-collapse: collapse;
    border-spacing: 0;
    overflow: hidden;
  }

  .metarial tr {
    background: #F1F7FA;
    color: #333;
  }
  .metarial td {
    border-top: 1px solid #e5e5e5;
    padding: 13px 0;
    width: 50%;
  }
  .metarial span {
    padding: 0 18px;
    font-size: 15px;
  }
  .item-detail .stepcont {
    margin: 25px 0 40px;
  }

  .stepcont a {
    float: left;
  }

  .stepcont .stepinfo {
    float: left;
    padding: 0;
    width: 480px;
    min-height: 200px;
    word-wrap: break-word;
    margin-left: 10px;
    font-size: 15px;
    color: #333;
    line-height: 27px;
    overflow: hidden;
  }
  .stepcont .stepinfo p {
    line-height: 0;
    font-weight: bold;
  }
  .br8 {
    border-radius: 8px;
  }
</style>
