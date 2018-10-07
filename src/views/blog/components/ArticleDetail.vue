<template>
  <div class="createPost-container">
    <sticky :className="'sub-navbar '+postForm.status">
      <el-select v-model="postForm.category" placeholder="分类">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
      </el-button>
      <el-button v-loading="loading" type="warning" >草稿</el-button>
    </sticky>
    <Upload v-model="postForm.summary_img" />
    <div>
      <el-form class="form-container" :model="postForm"  ref="postForm">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" prop="title">
                <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                  标题
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
            <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short">
            </el-input>
            <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
          </el-form-item>
          <div class="editor-container">
            <!--<Tinymce :height=400 ref="editor" v-model="postForm.content" />-->
            <markdown-editor id="contentEditor" v-model="postForm.content" :height="300" :zIndex="20"></markdown-editor>
          </div>
        </div>
      </el-form>
    </div>


  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage2'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle, feachCategory, updateArticle, createArticle } from '@/api/blog'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
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
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown, MarkdownEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      postForm: Object.assign({}, defaultForm),
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
      this.postForm = Object.assign({}, defaultForm)
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
          display: inline-block;
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
}
</style>
