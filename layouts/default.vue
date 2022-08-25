<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title>たのみ～る 管理画面</v-toolbar-title>
      <v-spacer/>

      <v-menu offset-y v-if="user!=null">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on">
            <v-icon>
              mdi-account
            </v-icon>
            {{ user.displayName }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-else href="/login">新規登録・ログイン</v-btn>
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
  computed: {
    user() {
      return this.$store.state.accounts.user
    }
  },
  name: 'DefaultLayout',
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$fire.auth.signOut()
    }
  }

})
</script>
