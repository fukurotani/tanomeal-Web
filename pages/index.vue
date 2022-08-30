<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-h3">たのみーる 店舗側管理</div>

      <div v-if="user">
        <p class="text-h6 my-4">ようこそ、{{ user.displayName }}さん</p>
        <p class="text-h4">操作メニュー</p>
        <v-btn href="readQR">
          <v-icon>
            mdi-qrcode-scan
          </v-icon>
          QRコードをスキャン
        </v-btn>

        <v-btn href="manageMenu">
          <v-icon>
            mdi-playlist-edit
          </v-icon>
          メニューを管理
        </v-btn>

        <v-btn href="order">
          <v-icon>
            mdi-database-eye
          </v-icon>
          注文状況を確認
        </v-btn>

      </div>
      <div v-else>
        <div class="text-body-1"></div>
        <v-row>
          <v-col cols="auto">
            <v-btn href="/login?mode=0">ログイン</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" href="/login?mode=1">新規登録</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'IndexPage',
  computed:{
    user(){
      return this.$store.state.accounts.user
    }
  }
})
</script>
