<template>
  <div class="simplemde-container">
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn"></editorImage>
    </div>
    <markdown-editor
            v-model="content"
            :highlight="true"
            preview-class="markdown-body">
    </markdown-editor>
  </div>
</template>

<script>
  import editorImage from './components/editorImage'
  import hljs from 'highlight.js';
  import markdownEditor from 'vue-simplemde/src/markdown-editor';
  import 'highlight.js/styles/atom-one-dark.css'
  import 'simplemde/dist/simplemde.min.css';
  import 'github-markdown-css';
  window.hljs = hljs;
  export default {
    name: 'simplemde-md',
    data() {
      return {
        content: '``` \nconsole.log("lalala") \n```',
        simplemde: null,
        hasChange: false,
        markdownId:this.id
      }
    },
    components: { markdownEditor,editorImage },


    methods: {
    }
  }
</script>

<style scoped>
  .simplemde-container >>>.CodeMirror {
    min-height: 150px;
    line-height: 20px;
    border:0px solid #ddd;
    /*width: 800px;*/
  }

  .simplemde-container>>>.CodeMirror-scroll {
    min-height: 150px;
  }

  .simplemde-container>>>.CodeMirror-code {
    padding-bottom: 40px;
  }

  .simplemde-container>>>.editor-statusbar {
    display: none;
  }

  .simplemde-container>>>.CodeMirror .CodeMirror-code .cm-link {
    color: #1890ff;
  }

  .simplemde-container>>>.CodeMirror .CodeMirror-code .cm-string.cm-url {
    color: #2d3b4d;
  }

  .simplemde-container>>>.CodeMirror .CodeMirror-code .cm-formatting-link-string.cm-url {
    padding: 0 2px;
    color: #E61E1E;
  }
  .simplemde-container >>> .editor-toolbar.fullscreen,
  .simplemde-container >>> .CodeMirror-fullscreen {
    z-index: 1003;
  }
  .editor-upload-btn{
    position: relative;
    top: 2px;
    margin-top: 2px;
    float: right;
    z-index: 19;
  }


</style>
