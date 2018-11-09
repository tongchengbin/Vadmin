<template>
  <article-detail :is-edit='false'></article-detail>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'createForm',
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