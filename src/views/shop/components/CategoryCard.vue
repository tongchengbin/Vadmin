<template>
  <div class="category">
    <el-dialog :visible.sync="show">
      <h3>
        分类选择
      </h3>
      
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      show: { type: [Object, Array, Boolean] }
    },
    data() {
      return {}
    },
    methods: {

    },
    computed: {

    },
    mounted() {
      console.log('mounted')
    },
    components: {
    },
    created() {
      console.log('created')
    }

  }
</script>
<style>
  .el-dialog{
    width: 450px;
  }
  .el-dialog__body{
    padding: 20px 10px;
  }
</style>