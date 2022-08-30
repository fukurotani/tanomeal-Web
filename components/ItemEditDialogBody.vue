<template>
  <v-card>
    <v-card-title>
      {{ initialItem?.name ?? "新商品" }}の設定画面
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
          :disabled="initialItem?.name!=null"
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
          :label="itemEnable?'販売':'中止' "
        ></v-switch>
        <v-slider
          v-model="itemMaxAmount"
          :max="255"
          label="販売可能量"
          :hint="`販売済み：${this.$props.initialItem?.nowAmount ?? 0}個`"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model="itemMaxAmount"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click.stop="close"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="primary"
        @click.stop="save"
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
  name: "ItemEditDialogBody",
  props: {
    initialItem: {
      type: Object as PropType<ItemType | null>,
      default: null,
    },
  },
  mounted() {
    this.valid = null
    this.itemName = this.$props.initialItem?.name ?? ""
    this.itemPrice = this.$props.initialItem?.price ?? ""
    this.itemEnable = this.$props.initialItem?.enable ?? true
    this.itemMaxAmount = this.$props.initialItem?.maxAmount ?? 0
  },

  data() {
    return {
      valid: null as HTMLFormElement | null,
      itemName: this.$props.initialItem?.name ?? "",
      itemPrice: this.$props.initialItem?.price ?? "",
      itemEnable: this.$props.initialItem?.enable ?? true,
      itemMaxAmount: this.$props.initialItem?.maxAmount ?? 0,
      rules: {
        required: (value: any) => !!value || '必須項目です',
        min: (v: any) => v.length >= 8 || '短すぎます',
        number: (value: any) => !Number.isNaN(Number(value)) || '数字で指定しましょう'
      }
    }
  }

  ,
  computed: {
    isChanged(): boolean {
      if (this.initialItem) {
        return this.initialItem != this.Item
      } else return true
    },
    Item(): ItemType {
      return {
        name: this.itemName,
        price: this.itemPrice,
        enable: this.itemEnable,
        nowAmount:this.$props.initialItem?.maxAmount,
        maxAmount:this.itemMaxAmount,
      } as ItemType
    }
  },
  methods: {
    close() {
      this.$emit("close", null)
    },
    save() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        this.$emit("close", this.Item)
      }
    }
  }
})
</script>

<style scoped>

</style>
