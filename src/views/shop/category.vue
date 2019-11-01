<template>
  <div class="warp" style="min-width: 1200px">
    <el-container>
      <el-container>
        <!--分类管理-->
        <el-aside width="300px">
          <div class="box-tree">
            <div class="custom-tree-container">
              <div class="action-buttom">
                <div style="padding: 10px">分类管理</div>
                <el-button size="mini" type="primary" icon="el-icon-circle-plus" circle @click="addNode('add')" />
                <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="editNode('update')" />
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="delNode()" />
              </div>
              <el-tree
                ref="category"
                v-loading="treeLoading"
                :data="treedata"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ node.label }}  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="main-table">
            <div class="app-container">
              <div class="filter-container" style="float: right">
                <el-button size="mini" type="primary" icon="el-icon-circle-plus" circle @click="handleAddAttribute" />
              </div>
            </div>
            <!--属性列表-->
            <el-table v-loading="attrTableLoading" :data="attrsData" style="width: 100%" size="mini">
              <el-table-column prop="category_name" label="分类" width="180" />
              <el-table-column prop="name" min-width="300px" label="名称" />
              <el-table-column fixed="right" label="操作" width="130">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEditAttribute(scope.row)" />
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelAttribute(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
            <div class="block right">
              <el-pagination
                :current-page="attrsParams.page"
                :page-size="attrsParams.pagesize"
                :page-sizes="[5, 10, 20, 30]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />

            </div>
          </div>
        </el-main>
        <el-container>
          <el-main />
        </el-container>
      </el-container>
    </el-container>
    <!--分类编辑对话框-->
    <el-dialog :visible.sync="treeVisible" custom-class="categorydialog" title="分类编辑" :center="true">
      <el-form label-width="80px" size="mini">
        <el-form-item label="上级分类">
          <el-input v-model="formTree.parentLabel" @focus="categoryCardShow = true" />
          <categorycard :show.sync="categoryCardShow" :data="treedata" @submitNode="handleSelectedTree" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="formTree.label" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="formAction=='add'" size="mini" type="primary" @click="submitForm">添加</el-button>
        <el-button v-else size="mini" type="primary" @click="submitForm">提交</el-button>
      </span>
    </el-dialog>
    <!--属性编辑对话框-->
    <el-dialog :visible.sync="attrbuteVisible" title="属性编辑" custom-class="attribute" :center="true">
      <el-form>
        <el-form-item label="分类">
          <categorycard :show.sync="attrcategoryCardShow" :data="treedata" @submitNode="handleSelectedTreeAttr" />
          <el-input v-model="attributeForm.category_name" @focus="attrcategoryCardShow = true" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="attributeForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="attrformAction=='add'" size="mini" type="primary" @click="submitAttrForm('add')">添加</el-button>
        <el-button v-else size="mini" type="primary" @click="submitAttrForm(edit)">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { featchCategoryTree } from '@/api/shop'
import request from '@/api/public'
import categorycard from '@/views/shop/components/CategoryCard'
export default {
  components: {
    categorycard
  },
  data() {
    return {
      // 分页相关
      total: 0,
      attrcategoryCardShow: false, // 属性选择分类
      attrformAction: 'update', // 属性操作
      attrbuteVisible: false, // 属性编辑对话框
      attrTableLoading: true,
      categoryCardShow: false, // 分类选择分类
      treeCardVisible: true, // 分类选择对话框
      treeVisible: false, // 分类编辑对话框
      treeCardSelectNode: null,
      attrsParams: {
        page: 1,
        pagesize: 10
      },
      attributeForm: {

      },
      attrsData: [],

      treeLoading: true,
      dialogVisible: false,
      tempForm: {
        name: 'dfdsfsdfdsfsdf'
      },
      formAction: 'update',
      formTree: {
        label: '',
        id: '',
        pid: '',
        parentLabel: ''
      },
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.featchtreeDate()
    this.feathAttributeData()
  },
  methods: {
    wa(data) {
      console.log(data)
    },
    featchtreeDate() {
      this.restTree()
      this.treeLoading = true
      featchCategoryTree().then(res => {
        this.treedata = res.data
      })
      this.treeLoading = false
      console.log('刷新数据成功')
    },
    submitForm() {
      if (this.formAction == 'update') {
        const data = this.formTree
        request.httpPatch('/api/admin/shop/category/{pk}/', data, data.id).then(res => {
          this.featchtreeDate()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } else {
        const data = {
          label: this.formTree.label,
          pid: this.formTree.pid
        }
        request.post('/api/admin/shop/category/', data, data.id).then(res => {
          this.featchtreeDate()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      }
      this.treeVisible = false
    },
    // 属性提交
    submitAttrForm(action) {
      console.log(this.attributeForm)
      if (action == 'edit') {
        const data = this.attributeForm
        request.httpPatch('/api/admin/shop/attribute/{pk}/', data, data.id).then(res => {
          this.featchtreeDate()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } else {
        const data = this.attributeForm
        request.post('/api/admin/shop/attribute/', data, data.id).then(res => {
          this.featchtreeDate()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
        this.feathAttributeData()
      }
      this.attrbuteVisible = false
    },
    handleDrop(before, after, inner) {
      const data = {
        id: before.data.id,
        pid: after.data.id
      }
      if (inner == 'before') {
        data.pid = after.data.pid_id
      }
      request.httpPatch('/api/admin/shop/category/{pk}/', data, data.id).then(res => {
        this.featchtreeDate()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    editNode(action) {
      this.formAction = action
      const node = this.$refs.category.currentNode && this.$refs.category.currentNode.node
      if (node) {
        this.treeVisible = true
        this.formTree = {
          id: node.data.id,
          label: node.label,
          pid: node.pid,
          parentLabel: node.parent.label
        }
      } else {
        this.$message({
          message: '请选择节点',
          type: 'warring'
        })
      }
    },
    addNode(action) {
      this.formAction = action
      this.treeVisible = true
      this.formTree = {}
    },
    delNode() {
      const key = this.$refs.category.getCurrentKey()
      if (key) {
        this.treeLoading = true
        request.httpDelete('/api/admin/shop/category/{pk}/', key).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.featchtreeDate()
        })
      } else {
        this.$message({
          message: '请选择节点',
          type: 'warring'
        })
      }
      this.restTree()
    },
    restTree() {
      this.formTree = {}
    },
    feathAttributeData() {
      this.attrTableLoading = true
      request.get('/api/admin/shop/attribute/', this.attrsParams).then(response => {
        this.attrsData = response.data.results
        this.total = response.data.count
        this.attrTableLoading = false
      })
    },
    handleAddAttribute() {
      this.attrformAction = 'add'
      this.attrbuteVisible = true
    },
    handleDelAttribute(row) {
      request.httpDelete('/api/admin/shop/attribute/{pk}/', row.id).then(response => {
        this.feathAttributeData()
      })
    },
    cancelEdit(row) {
      row.originalName = row.name
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.name = row.originalName
      const data = {
        id: row.id,
        name: row.originalName
      }
      request.httpPatch('/api/admin/shop/attribute/{pk}/', data, data.id).then(response => {
        this.feathAttributeData()
      })
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    handleSelectedTree(node) {
      this.formTree.parentLabel = node.label
      this.formTree.pid = node.id
    },
    // 属性编辑选择分类回调
    handleSelectedTreeAttr(node) {
      console.log('我是子组件传递过来的', node)
      this.attributeForm.category = node.id
      this.attributeForm.category_name = node.label
    },
    handleEditAttribute(row) {
      this.attrformAction = 'edit'
      this.attributeForm = row
      this.attrbuteVisible = true
    },
    handleSizeChange(size) {
      this.attrsParams.pagesize = size
      this.feathAttributeData()
    },
    handleCurrentChange(page) {
      this.attrsParams.page = page
      this.feathAttributeData()
    }
  }
}
</script>
<style>
  .custom-tree-node {
    -ms-flex: 1;
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
    .box-tree {
        padding: 24px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 20px;
        margin-top: 3px;
        position: relative;
        transition: all .2s ease-in-out;
    }
    .box {
        max-width: 600px;
        min-height:200px ;
        padding: 24px 100px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 20px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 3px;
        position: relative;
        transition: all .2s ease-in-out;
    }
    .box-tree:hover {
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
  .categorydialog {
    width: 500px;
  }
  .attribute {
    width: 500px;
  }
  .action-buttom{
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: auto;
  }
  .action-buttom > button {
    margin: auto;
    padding: 0 5px;
  }
  .main-table{
    padding-left: 15px;
  }
  .main-table .table-head {
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

</style>
