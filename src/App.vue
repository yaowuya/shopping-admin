<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<!--<script>-->
<!--  import { mapActions } from 'vuex'-->
<!--  import { getToken } from '@/utils/auth'-->

<!--  export default {-->
<!--    name: 'app',-->
<!--    created () {-->
<!--      const hasToken = getToken()-->
<!--      if (hasToken) {-->
<!--        if (this.$route.path !== '/login') {-->
<!--          this.getMenu()-->
<!--        } else {-->
<!--          this.$router.replace('/login')-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--      ...mapActions('user', [-->
<!--        'getMenu'-->
<!--      ])-->
<!--    }-->
<!--  }-->
<!--</script>-->
<style lang="scss" scoped>
</style>
