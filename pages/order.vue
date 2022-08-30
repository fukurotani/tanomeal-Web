<template>
  <div>
    <v-row>
      <v-col cols="6">
        <div class="text-h3">注文処理</div>
        <v-data-table hide-default-footer :headers="ordersHeader" :items="orders">
        </v-data-table>
      </v-col>
      <v-col cols="6">
        <div class="text-h3">商品</div>
        <v-data-table hide-default-footer :headers="itemsHeader" :items="itemsData">

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
  items: Array<string>,
  order_date: string
}
export function orderFromDoc(doc:DocumentSnapshot<DocumentData>):IOrder {
  const o = doc.data() as IOrder
  o.orderId = doc.id
  o.order_date=(doc.get("order_date") as Timestamp).toDate().toLocaleString()
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
          this.orders.push(o)
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
          const o = change.doc.data() as IOrder
          this.orders[this.orders.findIndex(v=>v.orderId==change.doc.id)]=o
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
          this.orders=this.orders.filter(item=>item.orderId!=change.doc.id)
        }
      })

    })
  },
  computed: {
    ordersRef() {
      return `stores/${this.$store.state.accounts.user.uid}/orders/`
    },
    itemsData(){//アイテムごとの表
      const r=[] as {name:string,amount:number}[]
      this.orders.forEach((o)=>{
        o.items.forEach((item)=>{
         const index= r.findIndex(v=>v.name==item)
          if (index!=-1) {//存在している
            r[index].amount++;
          }else{
            r.push({
              name:item,
              amount:1
            })
          }
        })
      })
      return r
    }
  },
  data(){
    return{
      itemsHeader:[
        {
          text: '商品名',
          align: 'start',
          value: 'name',
        },
        {text: '数量', value: 'amount'}
      ] as Array<DataTableHeader>,
      ordersHeader:[
        {
          text: '注文ID',
          align: 'start',
          value: 'orderId',
        },
        {text: '商品', value: 'items'},
        {text:'日時',value:'order_date'}
      ]as Array<DataTableHeader>,
      orders:[] as IOrder[]
    }
  }
})
</script>

<style scoped>

</style>
