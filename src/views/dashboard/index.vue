<template>
  <h1>Index</h1>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin') && !this.roles.includes('superuser')) {
      this.currentRole = 'editorDashboard'
    }

    window.__this = this
  }
}
</script>
