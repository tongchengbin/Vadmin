<template>
  <div>
    <div style="margin-left: 1vw;margin-right: 1vw" class="cl pd-5 header_body" >
    <span>
        <el-button type="primary" size="small" icon="el-icon-plus" >添加分类</el-button>
    </span>
    </div>
    <el-row>
      <el-col :span="4">
        <el-tree
          class="left_category"
          :data="category"
          :props="defaultProps"
          defaultExpandAll
          highlight-current>
        </el-tree>
      </el-col>
      <el-col :span="20">
        <div >
          <el-form :model="form" label-width="80px">
            <el-form-item label="分类名称"  >
              <el-input style="width: 400px" v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-input @click="dialogVisible=true" disabled style="width: 200px" v-model="form.category" placeholder="请选父节点"></el-input>
              <el-button @click="dialogVisible=true">选择父节点分类</el-button>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-col>
    </el-row>
    <div>
    <el-dialog
      title="选择上级分类"
      :visible.sync="dialogVisible"
      width="25%"
      show-close
    :before-close="handleClose"
    class="category"
      id="category"
    >
      <el-tree
        class="filter-tree"
        :data="category"
        :props="defaultProps"
        defaultExpandAll

        highlight-current>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <!--<el-button  type="primary" size="small" @click="UpdateData">提交</el-button>-->
      </div>
    </el-dialog>
    </div>
  </div>

</template>

<script>
  import xtree from '@/components/xtree'
  import http from '@/api/public'
  import CoreApi from '@/api/CoreApi'
  export default {
    name: 'category',
    data() {
      return {
        dialogVisible: false,
        filterText: '',
        category: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        form: {

        },
        params: {

        }
      }
  },
    methods: {

      featchCategory() {
        // 获取分类数据
        http.fetchGet(CoreApi.SHOP_CATEGORY_LIST, {}).then(res => {
          this.category = res.data
        })
      },
      onSubmit() {
        console.log()
      },
      checkCategory() {
        console.log(1)
      },
      handleClose() {
        this.dialogVisible = false
      }
    },
    created() {
      this.featchCategory()
    },
    components: { xtree }

  }
</script>

<style lang="css"  >
    .category  .el-dialog__header {
      padding: 20px 20px 0px ;
    }
   .category  .el-dialog__body {
     padding: 15px 20px!important;
     color: #606266;
     line-height: 24px;
     font-size: 14px;
   }
    .category  .el-dialog__title {
      line-height: 18px;
      font-size: 14px;
      color: #303133;
    }



</style>
<style scoped>
  .header_body {
    padding: 20px 0px;
  }
  .left_category {
    padding: 10px 20px;
  }
</style>
