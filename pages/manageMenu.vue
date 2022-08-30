<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">

      <ItemEditDialogBody v-if="dialog" @close="dialogClose" :initial-item="dialogItem"></ItemEditDialogBody>
    </v-dialog>
    <p class="text-h3">メニュー管理</p>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.enable="{ item }">
        <v-switch
          :value="item.enable"
          :input-value="item.enable"
          :label="item.enable?'販売中':'販売中止'"
          disabled
        >
        </v-switch>
      </template>
      <template v-slot:item.amount="{ item }">
        <v-progress-linear
          :value="((item.nowAmount??0)/item.maxAmount)*100"

          background-color="success"
          color="error"
          height="25"
        >
          販売済み:<strong>{{ item.nowAmount??0}}/{{item.maxAmount}}</strong>
        </v-progress-linear>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn fab small color="primary" @click.stop="dialogOpen(item)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>

    </v-data-table>
    <v-btn block color="primary" x-large @click.stop="dialogOpen(null)">
      <v-icon>
        mdi-plus
      </v-icon>
      商品を追加
    </v-btn>
  </div>
</template>

<script lang="ts">

import Vue from "vue";
import {DataTableHeader, DataTableItemProps} from "vuetify";
import firebase from "firebase/compat";
import FieldPath = firebase.firestore.FieldPath;
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export class ItemType {
  name: string
  price: number
  enable: boolean
  nowAmount: number
  maxAmount: number

  public constructor(name: string, price: number, enable: boolean, nowAmount: number, maxAmount: number) {
    this.name = name
    this.price = price
    this.enable = enable
    this.nowAmount = nowAmount
    this.maxAmount = maxAmount
  }

  static fromDoc(docData: DocumentSnapshot): ItemType {
    const data = docData.data()
    return new ItemType(docData.id, data?.price, data?.enable, data?.nowAmount, data?.maxAmount)
  }

}

export default Vue.extend({
  name: "manageMenu",
  mounted() {
    this.$fire.firestore.collection(this.menus).onSnapshot((collectionSnapshot) => {

      const items = collectionSnapshot.docs.map((menu) => {
        return ItemType.fromDoc(menu)
      })
      this.items = items;
    })
  },
  computed: {
    menus() {
      return `stores/${this.$store.state.accounts.user.uid}/menus/`
    }
  },
  data() {
    return {
      dialog: false,
      dialogItem: null as ItemType | null,
      headers: [
        {
          text: '商品名',
          align: 'start',
          value: 'name',
        },
        {text: '値段', value: 'price'},
        {text: '販売中', value: 'enable'},
        {text: '在庫', value: 'amount'},
        {text: '編集', value: 'actions', sortable: false},
      ] as DataTableHeader[],
      items: [] as ItemType[]
    }
  },
  methods: {
    dialogOpen(item: ItemType | null) {
      this.dialogItem = item
      this.dialog = true
    },
    dialogClose(item?: ItemType) {
      if (item) {
        this.$fire.firestore.doc(`${this.menus}${item.name}`).set({
          price: item.price,
          enable: item.enable,
          maxAmount: item.maxAmount,
        },{merge:true}).catch((error) => {
          console.error(error)
        })
      } else {
        //なにも変更されていない
      }
      this.dialogItem = null
      this.dialog = false
    },
  }
})
</script>

<style scoped>

</style>
