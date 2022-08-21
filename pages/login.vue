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
              autocomplete="username"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="input-pw"
              label="パスワード"
              autocomplete="current-password"
              hint="半角英数(記号含む)最低8文字以上"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-btn color="primary" :disabled="!loginValid" @click="submitLoginForm">
              ログイン
            </v-btn>
          </v-form>

        </v-tab-item>
        <v-tab-item
          :key="1">
          <v-form
            ref="createForm"
            v-model="createValid"
            lazy-validation
          >
            <v-autocomplete
              v-model="school"
              :rules="[rules.required]"
              filled
              name="input-sh"
              :items="['zhJWaJ1t9M4XOzhssK1i']"
              label="学校名(DocID)"
            ></v-autocomplete>
            <v-text-field
              v-model="name"
              :rules="[rules.required]"
              name="input-dn"
              label="店舗名"
            ></v-text-field>
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
              autocomplete="new-password"
              hint="半角英数(記号含む)最低8文字以上"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-btn color="primary" :disabled="!createValid" @click="submitCreateForm">
              新規作成
            </v-btn>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
      <div>
        {{ formStatus }}
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/compat";
import FieldValue = firebase.firestore.FieldValue;


export const Tabs = {
  SignIn: 0,
  Create: 1,
}
export default Vue.extend({
  name: "login",
  data() {
    return {
      school: "",
      loginValid: true,
      createValid: true,
      email: "",
      password: "",
      name: "",
      showPassword: false,
      tab: null,
      formStatus: "",
      rules: {
        required: (value: any) => !!value || '必須項目です',
        min: (v: any) => v.length >= 8 || '短すぎます',
        emailAddress: (value: string) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'メールアドレスが無効です'
        },
      }
    }
  },
  methods: {
    submitLoginForm() {
      if ((this.$refs.loginForm as Vue & { validate: () => boolean }).validate()) {
        this.formStatus = "作成中です"
        this.loginValid = false//ボタンをたくさん押すのを防ぐ
        this.loginAccount().finally(() => {
          this.loginValid = true
        })
      }
    },
    submitCreateForm() {
      if ((this.$refs.createForm as Vue & { validate: () => boolean }).validate()) {
        this.formStatus = "作成中です"
        this.createValid = false//ボタンをたくさん押すのを防ぐ
        this.createAccount().finally(() => {
          this.createValid = true
        })
      }
    },
    async loginAccount() {
      const userCredential=await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password).catch((e) => {
        const errorCode = e.code
        switch (errorCode) {
          //メールアドレスが無効な場合にスローされます。
          case "auth/invalid-email": {
            this.$data.formStatus = "そのメールアドレスは無効です"
            break
          }
          //指定された電子メールに対応するユーザーが無効になっている場合にスローされます。
          case "auth/user-disabled": {
            this.$data.formStatus = "無効なユーザーです。お問い合わせください。"
            break
          }
          //指定されたメールに対応するユーザーがいない場合にスローされます。
          case "auth/user-not-found": {
            this.$data.formStatus = "ユーザーが見つかりませんでした。"
            break
          }
          //指定された電子メールのパスワードが無効である場合、または電子メールに対応するアカウントにパスワードが設定されていない場合にスローされます。
          case "auth/wrong-password": {
            this.$data.formStatus = "パスワードが違います"
            break
          }
          default: {

          }
        }
      })
      if (userCredential&& userCredential.user!=null){
        await this.$router.push("/")
      }
    },
    async createAccount() {
      const userCredential = await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
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
            this.$data.formStatus = "パスワードが弱すぎます"
            break;
          }
          default: {
            this.$data.formStatus = errorCode + ":" + error.message
          }

        }
      })

      if (userCredential && userCredential.user != null) {//作成成功
        const currentUser = userCredential.user
        await currentUser.updateProfile({
          displayName: this.name,
        })
        const storePath = "stores/" + currentUser.uid
        await this.$fire.firestore.doc(storePath).set({
          name: this.name
        })
        await this.$fire.firestore.doc("schools/" + this.school).update({
          name: this.name,
          stores: FieldValue.arrayUnion(storePath)
        })
        await this.$router.push("/")
      }
    },
  }
})
</script>

