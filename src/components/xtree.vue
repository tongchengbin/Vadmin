<template>
  <el-tree
    class="filter-tree"
    :data="data"
    :props="defaultProps"
    defaultExpandAll
    highlight-current
    ref="tree2">
  </el-tree>
</template>

<script>
  export default {
    name: 'xtree',
    props: {
      data: {
        type: Array,
        default: {}
      }
    },
    data() {
      return {
      }
    }

  }
</script>

<style scoped>
  .back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .back-to-ceiling:hover {
    background: #d5dbe7;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }

  .back-to-ceiling .Icon {
    fill: #9aaabf;
    background: none;
  }
</style>
