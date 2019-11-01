<template>
  <div class="createPost-container">
    <header class="header">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
      <el-button v-loading="loading" type="warning">草稿</el-button>
    </header>
    <div>
      <el-form ref="postForm" class="form-container" :model="postForm" size="mini">
        <div class="createPost-main-container">
          <textarea class="titleInput Input-wrapper" placeholder="请输入标题（最多 50 个字）" style="height: 44px;" />
          <textarea class="descInput" placeholder="请输入标题简介" style="height: 44px;" />
          <div style="margin-bottom: 20px; margin-top: 20px">
            <Upload v-model="postForm.summary_img" />
          </div>
          <div class="editor-container">
            <markdown-editor id="contentEditor" ref="contentEditor" v-model="defaultForm.content" :height="300" />
          </div>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import Upload from '@/components/Upload/singleImage3'
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import { fetchArticle, feachCategory, updateArticle, createArticle } from '@/api/blog'
export default {
  name: 'ArticleDetail',
  components: { Upload, MarkdownEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

      defaultForm: {
        status: 1,
        title: '', // 文章题目
        content: '', // 文章内容
        summary: '', // 文章摘要
        summary_img: '', // 文章图片
        category: '', // 文章分类
        display_time: undefined, // 前台展示时间
        id: undefined,
        article_from: null,
        is_top: false,
        category_id: null
      },
      options: [],
      postForm: Object.assign({}, this.defaultForm),
      loading: false,
      categorylist: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.summary.length
    }
  },
  created() {
    this.featchcalss()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, this.defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
      }).catch(err => {
        console.log(err)
      })
    },
    featchcalss() {
      feachCategory().then(response => {
        this.options = response.data
      })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      this.loading = true
      // post
      if (this.isEdit) {
        updateArticle(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        })
      } else {
        createArticle(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        })
      }
      this.$router.push({ path: '/blog/list' })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  @import "src/styles/mixin.scss";
  .createPost-container {
  position: relative;
  .createPost-main-container {
    margin: auto;
    width: 900px;
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
    .titleInput{
      text-align: center;
      margin: auto;
      height: 44px;
      min-height: 44px;
      display: block;
      width: 800px;
      border: 0;
      font-size: 32px;
      line-height: 1.4;
      font-weight: 600;
      font-synthesis: style;
      outline: none;
      box-shadow: none;
      resize:none;
      overflow:hidden;
    }
    .descInput{
      text-align: center;
      padding: 30px;
      margin: auto;
      height: 30px;
      min-height: 30px;
      display: block;
      width: 800px;
      border: 0;
      font-size: 14px;
      font-weight: 600;
      font-synthesis: style;
      outline: none;
      box-shadow: none;
      resize:none;
      overflow:hidden;
    }
    .line-edit{
      padding: 40px;
    }
    .header{
      width: 100%;
      border-bottom:1px solid transparent;
      border-color:rgba(0,0,0,.08);
      padding-top: 5px;
      padding-bottom: 5px;
      float:right;
      button{
        float: right;
        margin-right: 0;
      }

    }
    .editor-toolbar{
      opacity:0.9;
      border: 0px solid #bbb;
      width: 800px;
      margin: auto;
    }
}

</style>
