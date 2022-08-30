<template>
  <div>
    <v-row>
      <v-col cols="8">
        <div class="text-h3">注文</div>

        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                注文ID
              </th>
              <th class="text-left">
                商品
              </th>
              <th class="text-left">
                日時
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in orders"
              :key="item.orderId"
              :class=" highLightElements.includes(item.orderId)?'green':''"
            >
              <td>{{ item.orderId }}</td>
              <td class="text-h6">{{Object.entries(item.items).map(([name, amount]) => {
                return name + ":" + amount
              }).toString() }}</td>
              <td>{{ item.order_date }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="4">
        <div class="text-h3">商品</div>
        <v-data-table hide-default-footer :headers="itemsHeader" :items="itemsData">
          <template v-slot:item.amount="{item}">
            <div class="text-h6"> {{ item.amount }}</div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {DataTableHeader} from "vuetify";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;

export interface IOrder {
  orderId: string | undefined
  accept_date: Timestamp,
  accept_flag: boolean,
  items: Map<string, number>,
  order_date: string
}

export function orderFromDoc(doc: DocumentSnapshot<DocumentData>): IOrder {
  const o = doc.data() as IOrder
  o.orderId = doc.id
  o.order_date = (doc.get("order_date") as Timestamp).toDate().toLocaleString()
  return o
}

export default Vue.extend({
  name: "order",
  mounted() {
    this.$fire.firestore.collection(this.ordersRef).onSnapshot((collectionSnapshot) => {
      collectionSnapshot.docChanges().forEach((change) => {

        if (change.type === "added") {

          console.log("New city: ", change.doc.data());
          const o = orderFromDoc(change.doc)/*change.doc.data() as Order
          o.orderId = change.doc.id*/
          if (!o.accept_flag) {
            this.orders.push(o)
            this.addAction(o.orderId!!)
            this.playNoti()
          }
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
          const o = change.doc.data() as IOrder
          if (o.accept_flag) {
             this.orders.splice(this.orders.findIndex(v => v.orderId == change.doc.id), 1)
          } else {
            this.orders[this.orders.findIndex(v => v.orderId == change.doc.id)] = o
          }
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
          this.orders = this.orders.filter(item => item.orderId != change.doc.id)
        }
      })

    })
  },
  computed: {
    ordersRef() {
      return `stores/${this.$store.state.accounts.user.uid}/orders/`
    },
    itemsData() {//アイテムごとの表
      const r = [] as { name: string, amount: number }[]
      this.orders.forEach((o) => {

        Object.entries(o.items).forEach(([item, amount]) => {
          const index = r.findIndex(v => v.name == item)
          if (index != -1) {//存在している
            r[index].amount += amount;
          } else {//新規追加
            r.push({
              name: item,
              amount: amount
            })
          }
        })
      })
      return r
    }
  },
  methods: {
    playNoti() {
      this.audio.currentTime = 0
      this.audio.play()
    },
    addAction(orderId:string){
       let index= this.highLightElements.push(orderId)
      window. setTimeout(()=>{
        this.highLightElements.splice(index-1,1)
      },5000)
    }
  },
  data() {
    return {
      highLightElements:[] as string[],
      audio: new Audio('notification.ogg'),
      itemsHeader: [
        {
          text: '商品名',
          align: 'start',
          value: 'name',
        },
        {text: '数量', value: 'amount'}
      ] as Array<DataTableHeader>,
      ordersHeader: [
        {
          text: '注文ID',
          align: 'start',
          value: 'orderId',
        },
        {text: '商品', value: 'items'},
        {text: '日時', value: 'order_date'}
      ] as Array<DataTableHeader>,
      orders: [] as IOrder[]
    }
  }
})
</script>

<style scoped>

</style>
