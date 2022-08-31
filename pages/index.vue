<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-h3">たのみーる 店舗管理</div>

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
        <div class="text-h6 my-10">スムーズなオンライン購入体験を手軽に実現</div>
        <div class="text-h5">
          機能
          <v-list class="text-body-1 ml-6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-qrcode-scan
                </v-icon>
              </v-list-item-icon>
              QRコードスキャンで迅速な受け取り処理
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-playlist-edit
                </v-icon>
              </v-list-item-icon>
              手軽なメニュー管理画面。個数制限も可能
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-database-eye
                </v-icon>
              </v-list-item-icon>
              注文状況をリアルタイムで更新。音と画面でお知らせ
            </v-list-item>
          </v-list>
        </div>
        <v-row>
          <v-col cols="auto">
            <v-btn href="/login?mode=0">ログイン</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" href="/login?mode=0">新規登録</v-btn>
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
  computed: {
    user() {
      return this.$store.state.accounts.user
    }
  }
})
</script>
