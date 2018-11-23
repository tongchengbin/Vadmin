<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" style="background:#1890ff" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible" custom-class="upload-image">
        <el-upload class="image-uploader"
                   :data="dataObj"
                   drag
                   :multiple="false"
                   :show-file-list="false"
                   action="http://up.qiniup.com"
                   :before-upload="beforeUpload"
                   bucket="public"
                   :on-success="handleImageScucess">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview-wrapper" v-show="imageUrl">
          <img :src="imageUrl" alt="">
          <div class="image-preview-action">
            <i @click="rmImage" class="el-icon-delete"></i>
          </div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
    import request from '@/api/public'
    import CoreApi from '@/api/CoreApi'

    export default {
      name: 'editimage',
      props: {
        value: String
      },

      data() {
        return {
          dialogVisible: false,
          imageUrl: '',
          dataObj: { token: '', key: '' }
        }
      },
      mounted() {

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
          this.imageUrl = this.domain_url + file.key
        },
        beforeUpload(file) {
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
        },
        handleSubmit() {
          this.$emit('successCBK', this.imageUrl)
          this.imageUrl =
                this.dialogVisible = false
        }
      }
    }
</script>
<!--<style scoped>-->

    <!--.image-uploader{-->
        <!--margin: auto;-->


    <!--}-->
    <!--.upload-image{-->
        <!--width: 100px!important;-->

    <!--}-->
    <!--.el-dialog{-->
        <!--width: 100px;-->

    <!--}-->


<!--</style>-->