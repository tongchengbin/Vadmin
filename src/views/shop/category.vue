<!-- 递归树组件示例 -->
<template>
  <div class="tree">
    <div class="content">
      <div class="float">
        <tree-view :isLoading="syncTreeLoading" :value="syncTreeData" :icon="deepIcon" :nodeClick="nodeClick"></tree-view>
      </div>
      <div class="right">
        <!--分类编辑-->
        <el-form>
            <el-form-item label="分类名称">
            <el-input v-model="cateform.name"></el-input>
            </el-form-item>
            <el-form-item label="上级分类">
                <el-input v-model="lastcate.name"></el-input>
            </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
    import treeView from '../../components/tree/tree-view'
import http from '@/api/public'
    import CoreApi from '@/api/CoreApi'
    export default {
      name: 'tree-view-demo',
      components: {
        treeView
      },
      data() {
        return {
          cateform: {
            name: 'test'
          },
          lastcate: {
            name: null
          },
          deep: 10,
          count: 5,
          syncTreeLoading: false,
          syncTreeData: [],
          deepIcon: ['help', 'gear-a', 'edit', 'refresh']
        }
  },
      methods: {
        nodeClick(node, parent) {
          console.log(node)
          for (var index in parent) {
            if (parent[index].id === node.pid_id) {
              this.lastcate = parent[index]
              break
            }
          }
        },
        featchCategory() {
          // 获取分类数据
          http.fetchGet(CoreApi.SHOP_CATEGORY_LIST, {}).then(res => {
            this.syncTreeData = res.data
          })
        }
      },
      created() {
        const self = this
        self.syncTreeLoading = true
        self.featchCategory()
        self.syncTreeLoading = false
    }
    }
</script>

<style scoped>
  .tree {
    width: 100%;
    height: 100%;
  }
  .tree p {
    font-size: 16px;
    color: black;
    font-weight: bold;
    text-align: center;
  }
  .tree .float {
    float: left;
    width: 350px;
    height: 100%;
    text-align: left;
    margin-right: 10px;
    background: #fff;
    margin-top: 10px;
  }
  .content {
    margin-top: 10px;

  }
  .content .right{
      float: left;
    width: 750px;
  }
</style>