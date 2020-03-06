<template>
  <div class="app-container">
  <!--页面容器    -->
    <div class="page-header" style="border: solid 1px transparent;border-color: #ddd;padding: 6px 10px;">
      <div>
        <el-button @click="addBillHandle" style="float: right;margin: 0 5px;" size="small" type="primary">记账一笔</el-button>
        <el-button style="float: right;margin: 0 5px;" size="small" type="primary">费用类型管理</el-button>
        <el-button style="float: right;margin: 0 5px;" size="small" type="primary">费用类型管理</el-button>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="page-content">
    <!-- table 内容布局  可以滑动     -->
      <div class="tb">
        <el-table :data="dataList" v-loading="tbLoading">
          <el-table-column label="交易时间" prop="bill_time" :formatter="dateFormat" align="center"  width="160px" ></el-table-column>
          <el-table-column label="用户名" prop="username" align="center"  width="150px" ></el-table-column>
          <el-table-column label="交易类型" prop="bill_type_name" align="center"  width="100px" ></el-table-column>
          <el-table-column label="账户" prop="bank_card_name" align="center"  width="200px" ></el-table-column>
          <el-table-column label="金额"  align="center"  width="100px" >
            <template slot-scope="scope">
              <span>{{scope.row.currency_name}} &nbsp; {{scope.row.money}}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款人/收款人"  align="center"  width="200px" >
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.target_account_type" style="font-size: 20px;width: 40px" /> <span>&nbsp; {{scope.row.target_account_no}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易备注" prop="remark" align="center"  width="180px" ></el-table-column>
          <el-table-column label="付款人/收款人"  align="center"  width="180px" >
            <template slot-scope="scope">
              <el-button @click="editHandle(scope.row)" size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-page">
        <el-pagination :background="true" layout="prev, pager, next" :total="total"  @current-change="changePgae">
        </el-pagination>
      </div>

    </div>
    <div class="page-foot"></div>

    <el-dialog :visible="billForm.show" :title="billForm.id?'修改账单':'添加账单'" center  @close="billForm.show=false">

      <div>
        <el-form size="mini" style="width:420px;" label-width="120px">
          <el-form-item label="交易时间">
            <el-date-picker
              v-model="billForm.bill_time"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易类型">
            <el-select  v-model="billForm.bill_type" placeholder="账户类型" style="width: 300px;">
              <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额(元)" >
            <el-select  v-model="billForm.currency" placeholder="货币" style="width:100px;">
              <el-option
                v-for="item in currency"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>
            <el-input v-model="billForm.money" @input="checkNumber(billForm.money)" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="交易账户">
            <el-select  v-model="billForm.bank_card" placeholder="交易账户" style="width: 300px;">
              <el-option
                v-for="item in bankCard"
                :key="item.id"
                :label="item.cardtype_name+' : '+item.card_no"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款人/付款人">
            <el-select  v-model="billForm.target_account_type" placeholder="账户类型" style="width:100px;">
              <el-option
                v-for="item in accountType"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>
            <el-input placeholder="账户编号" v-model="billForm.target_account_no" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="交易备注">
            <el-input v-model="billForm.remark"  style="width: 300px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="billForm.show = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitBill">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import request from '../../api/public'
  import CoreApi from '../../api/CoreApi'
  import {Message} from "element-ui";
    export default {
        name: "billList",
      data(){
          return {
            total:0,
            params:{
              page:1,
            },
            tbLoading:true,
            dataList:[],
            currency:[
              {key:10, label:"￥"},
              {key:11,label:"$"}
            ],
            accountType:[
              {key:'weixin',label:"微信"},
              {key:'alipay',label:"支付宝"},
              {key:'paypal',label:"paypal"},
              {key:'bank',label:"银行"}
            ],
            bankCard:[],
            billType:[],
            billForm:{
              show:false,
              id:null,
              bill_type:null,
              money:0,
              currency:10,
              bank_card:null,
              target_account_no:null,
              target_account_type:null,
              remark:null
            }
          }
      },
      created() {
          this.getList()
      },
      methods:{
        getList(){
          let params={
            page:this.$data.params.page,
          };
          this.$data.tbLoading=true;
          request.get(CoreApi.BILL_BILL,params).then(res=>{
            this.$data.dataList=res.results;
            this.$data.total=res.count;
            this.$data.tbLoading=false;
          })
        },
        changePgae(page) {
          this.params.page=page;
          this.getList()
        },
        addBillHandle(){
          this.getBillType();
          this.getBankCard();
          this.$data.billForm.show=true;
        },
        getBankCard(){
          request.get(CoreApi.BILL_BANKCARD,{}).then(res=>{
            this.$data.bankCard=res.results;
          })
        },
        getBillType(){
          request.get(CoreApi.BILL_BILLTYPE,{}).then(res=>{
            this.$data.billType=res.results;
          })
        },
        submitBill(){
          let billForm=this.$data.billForm;
          let data={
            bill_type:billForm.bill_type,
            bill_time:billForm.bill_time,
            money:billForm.money,
            currency:billForm.currency,
            bank_card:billForm.bank_card,
            target_account_no:billForm.target_account_no,
            target_account_type:billForm.target_account_type,
            remark:billForm.remark,
          };
          let id=this.$data.billForm.id;
          console.log(this.$data.billForm);
          if(id){
            request.put(CoreApi.BILL_BILL+id+'/',data).then(res=>{
              Message({
                message: '修改成功',
                type: 'success',
                duration: 5 * 1000
              });
              this.$data.billForm.show=false;
              this.getList()
            })

          }else{
            request.post(CoreApi.BILL_BILL,data).then(res=>{
              Message({
                message: '添加成功',
                type: 'success',
                duration: 5 * 1000
              });
              this.$data.billForm.show=false;
              this.getList()
            })
          }

        },
        checkNumber:function(v){
          v=v.replace(/[^\d.]/g, "");
          v=v.replace(/\.{3,}/g, "");
          this.$data.billForm.money=v;
        },
        dateFormat:function(v){
          return v.bill_time.substr(0,v.bill_time.lastIndexOf(':')).replace("T"," ")
        },
        editHandle(item){
          let billForm={
              show:true,
              id:item.id,
              bill_time:item.bill_time,
              bill_type:item.bill_type,
              money:item.money,
              currency:item.currency,
              bank_card:item.bank_card,
              target_account_no:item.target_account_no,
              target_account_type:item.target_account_type,
              remark:item.remark
          };
          this.$data.billForm=billForm;
          this.getBillType();
          this.getBankCard();
        }
      }
    }
</script>

<style scoped>

</style>
