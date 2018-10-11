<template>
    <div>
        <div class="cate">
            <div class="box pd">
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
    </div>

</template>


<script>
    export default {
      data() {
        return {
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
    .cate{
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
    .pd{
        padding: 10px;
    }
</style>