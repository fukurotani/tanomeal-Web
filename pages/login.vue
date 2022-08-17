<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-tabs
        v-model="tab">
        <v-tabs-slider/>
        <v-tab :key="0">
          ログイン
        </v-tab>
        <v-tab :key="1">
          新規登録
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          :key="0">
          <v-form
            ref="loginForm"
            v-model="loginValid"
            lazy-validation
          >
            <v-text-field
              v-model="email"
              :rules="[rules.required,rules.emailAddress]"
              type="email"
              name="input-em"
              label="メールアドレス"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="input-pw"
              label="パスワード"
              hint="半角英数(記号含む)最低8文字以上"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-btn color="primary" :disabled="!loginValid" @click="submitLoginForm">
              ログイン
            </v-btn>
          </v-form>
          <div>
            {{ formStatus }}
          </div>
        </v-tab-item>
        <v-tab-item
          :key="1">
          新規登録画面
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export const Tabs = {
  SignIn: 0,
  Create: 1,
}
export default Vue.extend({
  name: "login",
  data() {
    return {
      loginValid: true,
      createValid: true,
      email: "",
      password: "",
      showPassword: false,
      tab: null,
      formStatus: "",
      rules: {
        required: (value: any) => !!value || '必須項目です',
        min: (v: any) => v.length >= 8 || '短すぎます',
        emailAddress: (value: string) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      }
    }
  },
  methods: {
    submitLoginForm() {
      if ((this.$refs.loginForm as Vue & { validate: () => boolean }).validate()) {
        this.formStatus = "作成中です"
        this.loginValid=false//ボタンをたくさん押すのを防ぐ
        this.createAccount().finally(()=>{
          this.loginValid=true
        })
      }
    },
    async createAccount() {
      const user = await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
        const errorCode = error.code
        switch (errorCode) {
          case "auth/email-already-in-use": {//指定されたメール アドレスを持つアカウントが既に存在する場合にスローされます。(ＧＯＯＧＬＥ　ＴＲＡＮＳＬＡＴＥ)
            this.$data.formStatus = "すでにそのメールアドレスは使用されています。"
            break;
          }
          case "auth/invalid-email": {//メールアドレスが無効な場合にスローされます。
            this.$data.formStatus = "メールアドレスが無効です。"
            break;
          }
          /*case "auth/operation-not-allowed":{//emailpassword アカウントが有効になっていない場合にスローされます。 Firebase コンソールの [認証] タブで、メールパスワード アカウントを有効にします。
            break;
          }*/
          case "auth/weak-password": {// パスワードが十分に強力でない場合にスローされます。
            this.$data.formStatus="パスワードが弱すぎます"
            break;
          }
          default: {
            this.$data.formStatus=errorCode+":"+error.message
          }

        }
      })
      if (user) {//作成成功

      }
    },
    loginAccount() {

    }
  }
})
</script>

