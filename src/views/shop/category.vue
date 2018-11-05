<template>
  <div class="warp" style="min-width: 1200px">
    <el-container>
      <el-container>
        <el-aside width="300px">
          <div class="box-tree">
            <div class="custom-tree-container">
              <div class="action-buttom">
                <div style="padding: 10px">分类管理</div>
                <el-button @click="editNode('add')" size="mini" type="primary" icon="el-icon-circle-plus" circle></el-button>
                <el-button @click="editNode('update')" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="delNode()" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </div>
                <el-tree  v-loading="treeLoading"
                        :data="treedata"
                        node-key="id"
                          ref="category"
                        default-expand-all
                        :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
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
                <el-button @click="handleAddAttribute" size="mini" type="primary" icon="el-icon-circle-plus" circle></el-button>
              </div>
            </div>
            <!--属性管理-->
            <el-table :data="attrsData" style="width: 100%">
              <el-table-column prop="category_name" label="分类" width="180"></el-table-column>
              <el-table-column prop="name" min-width="300px" label="名称" ></el-table-column>
              <el-table-column
                      fixed="right"
                      label="操作"
                      width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
        <el-container>
          <el-main>
            <el-dialog :visible.sync="dialogVisible">
              <div class="box">
                <el-form label-width="80px" size="mini">
                  <el-form-item label="上级分类">
                    <el-input  v-model="formTree.parentLabel"  @focus="categoryCardShow = true"></el-input>
                  </el-form-item>
                  <el-form-item label="分类名称">
                    <el-input v-model="formTree.label"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button v-if="formAction=='add'" type="primary" @click="submitForm" >添加</el-button>
                    <el-button v-else type="primary" @click="submitForm" >提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <categorycard :show.sync="categoryCardShow" @handleSelectedTree="handleSelectedTree"></categorycard>
    <el-dialog :visible.sync="treeVisible" custom-class="categorydialog">
      <div class="box">
        <el-form label-width="80px" size="mini">
          <el-form-item label="分类">
            <el-input :disabled="true" v-model="attributeForm.category.label"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--属性编辑对话框-->
    <el-dialog :visible.sync="attrbuteVisible" title="属性编辑">
      <el-form>
        <el-form-item label="分类">
          <el-input :disabled="true" v-model="attributeForm.category.label"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input :disabled="true" v-model="attributeForm.category.label"></el-input>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>


<script>
  import { featchCategoryTree } from '@/api/shop'
  import request from '@/api/public'
  import categorycard from '@/views/shop/components/CategoryCard'
  export default {
    data() {
      return {
        // 属性对话框
        attrbuteVisible: true,
        // 分类组件
        categoryCardShow: false,
        treeCardVisible: true,

        // 分类属性列表
        treeVisible: false,
        treeCardSelectNode: null,
        attrsParams: {
          page: 1,
          pagesize: 10
        },
        attributeForm: {
          category: {
            id: '',
            label: ''
          }
        },
        attrsData: [],
        attributeDialog: false,
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
      },
      submitForm() {
        if (this.formAction == 'update') {
          const data = {
            pid: this.formTree.pid,
            label: this.formTree.label,
            id: this.formTree.id
          }
          request.httpPatch('/api/admin/shop/category/{pk}/', data, data.id).then(res => {
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
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
        this.dialogVisible = false
        this.featchtreeDate()
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
        const node = this.$refs.category.currentNode && this.$refs.category.currentNode.node
        if (action === 'update') {
          if (!node) {
            this.$message({
              message: '请选择节点',
              type: 'warring'
            })
          } else {
            this.dialogVisible = true
            this.formAction = action
            this.formTree = node.data
            this.formTree.parentLabel = node.parent.label
          }
        } else {
        //  create
          this.dialogVisible = true
          this.formAction = action
          this.formTree = {}
          this.formTree.pid_id = node.data.id
          this.formTree.parentLabel = node.label
        }
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
        request.fetchGet('/api/admin/shop/attribute/', this.attrsParams).then(response => {
          this.attrsData = response.data.results.map(v => {
            this.$set(v, 'edit', false)
            v.originalName = v.name
            return v
          })
        })
      },
      handleAddAttribute() {
        this.attributeDialog = true
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
        console.log('parent', this.formTree)
      },
      handleEditAttribute(row) {
        console.log(row)
      }

    },
    created() {
      this.featchtreeDate()
      this.feathAttributeData()
    },
    components: {
      categorycard
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
  categorydialog .el-dialog{
    width: 600px;
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