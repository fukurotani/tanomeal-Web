<template>
  <v-card>
    <v-card-title>
      {{ initialItem.name }}の設定画面
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          label="商品名"
          v-model="itemName"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          label="価格"
          v-model="itemPrice"
          :rules="[rules.required,rules.number]"
          required
        ></v-text-field>
        <v-switch
          v-model="itemEnable"
          :rules="[rules.required]"
          :label="itemEnable?'販売':'中止' "
        ></v-switch>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="close"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="primary"
        @click="save"
      >
        <span v-if="$props.initialItem" :disabled="!isChanged">変更を保存</span><span v-else>商品を追加</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {ItemType} from "~/pages/manageMenu.vue";

export default Vue.extend({
  name: "ItemEditDialog",
  props: {
    initialItem: {
      type: Object as PropType<ItemType>,
    },
  },
  data(){
    return{
      valid:{

      },
      rules: {
        required: (value: any) => !!value || '必須項目です',
        min: (v: any) => v.length >= 8 || '短すぎます',
        number: (value: any) => {
          return parseInt(value,10) !=NaN
        }
      }
    }
  },
  computed: {
    isChanged():boolean {
      if (this.initialItem) {
        return this.initialItem != {} as ItemType
      }else return true
    }
  },
  methods: {
    save() {
      const e = new Event("", {})
      this.$emit("onsave", e)
    }
  }
})
</script>

<style scoped>

</style>
