<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'
import superuser from './superuser'

export default {
  name: 'user',
  components: { admin, superuser },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('superuser')) {
      this.currentRole = 'superuser'
    } else {
      this.currentRole = 'admin'
    }
  }
}
</script>
