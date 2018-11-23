<template>
  <div class="upload-container">
    <el-upload v-if="value.length===0"  class="image-uploader" v-loading="uploadStatus"
               :data="dataObj"
               drag
               :multiple="false"
               :show-file-list="false"
               action="http://up.qiniup.com"
               :before-upload="beforeUpload"
               bucket="public"
               :on-success="handleImageScucess"
              >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div v-if="value.length>0" class="image-preview">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage"></i>
        </div>
      </div>
  </div>
</template>

<script>
import request from '@/api/public'
import CoreApi from '@/api/CoreApi'

export default {
  name: 'singleImageUpload3',
  props: {
    value: String
  },
  data() {
    return {
      uploadStatus: false,
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  mounted() {
    console.log('v model', this.value)
  },
  create() {
    console.log('v model', this.value)
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(file) {
      this.emitInput(this.domain_url + file.key)
      this.uploadStatus = false
    },
    beforeUpload(file) {
      this.uploadStatus = true
      const _self = this
      return new Promise((resolve, reject) => {
        request.get(CoreApi.QINIU_TOKEN, {}).then(response => {
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = file.name
          this.domain_url = response.data.domain_url
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .upload-container {
    .image-uploader {
      margin: auto;
      width: 850px;
    }
    .image-preview {
      margin: auto;
      position: relative;
      img {
        width: 100%;
        margin: auto;
        display: block;
      }
      .image-preview-action{
        position: absolute;
        bottom: 0px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.34);
        .el-icon-delete{
          color: #fff;
          font-size: 35px;
          speak: none;
          font-style: normal;
          font-weight: 400;
          -webkit-font-feature-settings: normal;
          font-feature-settings: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }
    }

  }
</style>