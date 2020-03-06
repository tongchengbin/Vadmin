<template>
  <div class="app-container">
    <!--页面容器    -->
    <div class="page-header" style="border: solid 1px transparent;border-color: #ddd;padding: 6px 10px;">
      <div>
        <el-button @click="addFormHandle" style="float: right;margin: 0 5px;" size="small" type="primary">添加类型</el-button>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="page-content">
      <!-- table 内容布局  可以滑动     -->
      <div class="tb">
        <el-table :data="dataList" width="100%">
          <el-table-column label="#" prop="rank" align="center"  width="200px" ></el-table-column>
          <el-table-column label="费用名称" prop="name" align="center"  min-width="200px" ></el-table-column>
          <el-table-column label="操作" prop="menu_name" align="center" type="index" width="200px" class="img-col" cell-class-name="changeCellStyle">
            <template slot-scope="scope">
              <el-button @click="editItem(scope.row)"size="mini" type="primary">编辑</el-button>
              <el-button @click="removeItem(scope.row)"size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page-foot"></div>
    <el-dialog
      :visible.sync="form.show"
      width="350px">
      <el-form size="small" style="width: 250px;margin: auto">
        <el-form-item label="费用名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="form.rank"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form.show = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import request from '../../api/public'
  import CoreApi from '../../api/CoreApi'
  export default {
    name: "billType",
    data(){
      return {
        dataList:[],
        form:{
          show:false,
          id:null,
          name:"",
          rank:0
        }
      }
    },
    created() {
      this.getList()
    },
    methods:{
      getList(){
        request.get(CoreApi.BILL_BILLTYPE,{}).then(res=>{
          this.$data.dataList=res.results;
        })
      },
      addFormHandle(){
        this.$data.form={
          show:true,
          id:null,
          name:"",
          rank:0
        };
      },
      submitForm(){
        let data={
          rank:this.$data.form.rank,
          name:this.$data.form.name
        };
        if(this.$data.form.id){
        //  update
          request.put(CoreApi.BILL_BILLTYPE+this.$data.form.id+'/',data).then(res=>{
            this.$data.form.show=false;
            this.getList();
          });
        }else{
          request.post(CoreApi.BILL_BILLTYPE,data).then(res=>{
            this.$data.form.show=false;
            this.getList();
          })
        }
      },
      editItem(item){
        console.log(item)
        this.$data.form.id=item.id;
        this.$data.form.name=item.name;
        this.$data.form.rank=item.rank;
        this.$data.form.show=true;
      },
      removeItem(item){

      }
    }
  }
</script>

<style scoped>

</style>
