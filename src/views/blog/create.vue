<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'CreateForm',
  components: { ArticleDetail }
}
</script>

<style>
  .editor-toolbar{
    opacity:0.9;
    border: 0 !important;
    width: 800px;
    margin: auto;
  }

</style>
