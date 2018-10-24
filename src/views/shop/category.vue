<template>
    <div class="warp" style="min-width: 1200px">
        <div>
            <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :offset="6"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
        </div>
        <el-container width="300px">
            <el-aside>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-aside>
            <el-main>
                <el-form ref="form" :model="tempForm" label-width="80px" size="mini">
                    <el-form-item label="活动名称">
                        <el-input v-model="tempForm.name"></el-input>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
        <!--<div class="content">-->
            <!---->
            <!--<div class="box pd">-->
                <!--<div>分类</div>-->
                <!--<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
            <!--</div>-->
            <!--<div class="box fm">-->
                <!--<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">-->
                    <!--<el-form-item label="活动名称">-->
                        <!--&lt;!&ndash;<el-input v-model="sizeForm.name"></el-input>&ndash;&gt;-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>


<script>
    export default {
      data() {
        return {
            tempForm:{
                name:"dfdsfsdfdsfsdf"
            },

          data: [{
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }, {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }, {
            label: '一级 3',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        }
  },
      methods: {
        handleNodeClick(data) {
          console.log(data)
        }
      }
    }
</script>
<style>
    .content{
        margin-top: 30px;
        margin-left: 10px;
        padding: 20px;
        width: 350px;
    }
    .box{
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 20px;
        margin-top: 3px;
        position: relative;
        transition: all .2s ease-in-out;
    }
    .box:hover {
        box-shadow: 0 2px 7px rgba(0,0,0,.33);
        border-color: transparent;
        position: relative;
    }
    .warp {
        min-width: 1000px;
    }
    .content .pd{
        width: 350px;
        float: left;
        padding: 10px;
    }
    .content .fm{
        width: 600px;
        float: right;
        padding: 10px;
    }

</style>