<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title>たのみ～る</v-toolbar-title>
      <v-spacer/>
        <div  v-if="user!=null">
          <v-btn>
            <v-icon>
              mdi-account
            </v-icon>
            {{user.displayName}}
          </v-btn>
        </div>
        <div v-else>
          <v-btn href="/login">新規登録・ログイン</v-btn>
        </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>&copy;たのみ～る {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  mounted() {
  },
  computed:{
    user(){
      return this.$store.state.accounts.user
    }
  },
  name: 'DefaultLayout',
  data() {
    return {

    }
  },

})
</script>
