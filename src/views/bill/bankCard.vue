<template>
  <div class="app-container">
  <!--页面容器    -->
    <div class="page-header" style="border: solid 1px transparent;border-color: #ddd;padding: 6px 10px;">
      <div>
        <el-button style="float: right;margin: 0 5px;" size="small" type="primary" @click="openBankCard">账户管理</el-button>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="page-content">
    <!-- table 内容布局  可以滑动     -->
      <div class="tb">
        <el-table></el-table>
      </div>
    </div>
    <div class="page-foot"></div>
    <el-dialog
    :visible="accountForm.show"
    width="460px"
    center
    @close="accountForm.show=false"
    >
      <div class="bk">
        <div v-for="item in bankcardList" style="width: 410px;margin:auto" >
          <svg-icon :icon-class="item.cardtype" style="font-size: 20px;width: 40px" />
          <span style="font-size: 20px;display: inline-block;width: 250px;margin-left:30px;margin-top: 3px;margin-bottom: 3px;">{{item.card_no}}</span>
          <el-button @click="editBk(item)" size="small" style="padding:5px 5px" type="primary">编辑</el-button><el-button size="small" style="padding:5px 5px" type="danger">删除</el-button>
        </div>
        <div style="width: 300px;margin: auto">
          <el-button type="primary" size="small" style="width: 300px;margin:10px auto" @click="addBankCardHandle">添加银行卡,支付账户</el-button>
        </div>

      </div>
    </el-dialog>
    <el-dialog
      :visible="addBkForm.show" width="300px">
      <el-form>
        <el-form-item label="账户类型">
          <el-select size="middle" v-model="addBkForm.cardtype" placeholder="账户类型">
            <el-option
              v-for="item in bkOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡号" >
          <el-input size="middle" v-model="addBkForm.card_no"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBkForm.show = false">取 消</el-button>
        <el-button type="primary" @click="submitBk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import request from '../../api/public'
  import CoreApi from '../../api/CoreApi'
    export default {
        name: "billList",
      data(){
          return {
            bankcardList:[],
            accountForm:{
              show:false
            },
            addBkForm:{
              card_no:null,
              cardtype:'',
              show:false
            },
            bkOptions:[
              {
                key:"weixin",
                name:"微信支付"
              },
              {
                key:"alipay",
                name:"支付宝"
              },
              {
                key:"paypal",
                name:"PayPal"
              },
              {
                key:"bank",
                name:"银行"
              }
            ]
          }
      },
      created() {


      },

      methods:{
        getBankCard(){
          request.get(CoreApi.BILL_BANKCARD,{"page":1}).then(res=>{
            this.$data.bankcardList=res.results;
            console.log(this.$data.bankcardList)
          })
        },
        openBankCard(){
          this.getBankCard();
          this.$data.accountForm.show=true;
        },
        addBankCardHandle(){
          this.$data.addBkForm.id=null;
          this.$data.addBkForm.show=true;
        },
        editBk(item){
          this.addBkForm.id=item.id;
          this.addBkForm.card_no=item.card_no;
          this.addBkForm.cardtype=item.cardtype;
          this.addBkForm.show=true;
        },
        submitBk(){
          let data={
            card_no:this.$data.addBkForm.card_no,
            cardtype:this.$data.addBkForm.cardtype
          };
          if(this.$data.addBkForm.id){
          //  update
            request.put(CoreApi.BILL_BANKCARD+this.$data.addBkForm.id+"/",data).then(res=>{
              this.addBkForm.show=false;
              this.openBankCard()
            })
          }else{
            request.post(CoreApi.BILL_BANKCARD,data).then(res=>{
              this.addBkForm.show=false;
              this.openBankCard()
            })
          }

        }
      }
    }
</script>

<style scoped>
  .bk{
    margin: auto;
  }

</style>
