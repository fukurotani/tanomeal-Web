<template>
  <v-row>
    <v-col :cols="$vuetify.breakpoint.smAndDown?12:7" >
      <qrcode-stream ref="a" v-resize="onResize" class="qrcode-area" :camera="isCameraOff?'off':camera"
                     :track="paintOutline"
                     @init="onInit"
                     @decode="onDecode"
      >
        <v-btn class="ma-1" :disabled="noFrontCamera||noRearCamera" @click="switchCamera">
          <v-icon>
            mdi-camera-flip
          </v-icon>
        </v-btn>
      </qrcode-stream>
    </v-col>
    <v-spacer></v-spacer>
    <v-col :cols="$vuetify.breakpoint.smAndDown?12:4">
      <div class="text-h3">読み取り結果</div>
      <v-card v-if="orderData">
        <v-card-title class="subheading font-weight-bold">
          注文ID:{{ orderData.orderId }}
        </v-card-title>

        <v-divider></v-divider>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>注文商品:</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ Object.entries(orderData.items).map(([name, amount]) => {
              return name + ":" + amount
            }).toString() }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>注文日時:</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ orderData.order_date }}
            </v-list-item-content>
          </v-list-item>


        </v-list>


        <v-btn :disabled="orderData.accept_flag" block color="primary" @click="setReceived(orderData)">
          <v-icon v-if="!orderData.accept_flag">
            mdi-check
          </v-icon>
          {{orderData.accept_flag?"受け取り済み": "受け取り済みにする" }}
        </v-btn>
        <v-btn block  @click="resetCamera">
          <v-icon>
            mdi-reload
          </v-icon>
          再読み取り
        </v-btn>
      </v-card>

    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {orderFromDoc, IOrder} from "~/pages/order.vue";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export default Vue.extend({
  name: "readQR",
  data() {
    return {
      camera: 'front',
      isCameraOff: false,
      noRearCamera: false,
      noFrontCamera: false,
      windowSize: {
        x: 0,
        y: 0,
      },
      orderData: null as IOrder | null
    }
  },
  mounted() {
    this.onResize()
  },
  computed: {
    ordersRef() {
      return `test-stores/${this.$store.state.accounts.user.uid}/orders/`
    },
  },
  methods: {
    resetCamera(){
      this.orderData=null
      this.isCameraOff = false
    },
    async setReceived(orderData: IOrder) {
      await this.$fire.firestore.doc(this.ordersRef + orderData.orderId).update({
        accept_flag:  true,
        accept_date:  firebase.firestore.FieldValue.serverTimestamp()
      })
      this.orderData=null
      this.isCameraOff = false

    },
    async onDecode(content: String) {
      this.isCameraOff = true

      this.$data.orderData = orderFromDoc(await this.$fire.firestore.doc(this.ordersRef + content).get())


    },
    onResize() {
      this.windowSize = {x: window.innerWidth, y: window.innerHeight}
    },
    //QRコード領域の描画
    paintOutline(detectedCodes: (any & { boundingBox: DOMRectReadOnly, cornerPoints: any })[], ctx: CanvasRenderingContext2D) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const {x, y} of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    },
    switchCamera() {
      switch (this.camera) {
        case 'front':
          this.camera = 'rear'
          break
        case 'rear':
          this.camera = 'front'
          break
      }
    },
    async onInit(promise: Promise<unknown>) {
      try {
        await promise
      } catch (e: any) {
        const triedFrontCamera = this.camera === 'front'
        const triedRearCamera = this.camera === 'rear'

        const cameraMissingError = e.name === 'OverconstrainedError'
        if (cameraMissingError) {
          if (triedRearCamera) {
            this.noRearCamera = true

          }

          if (triedFrontCamera) {
            this.noFrontCamera = true

          }
          this.switchCamera()
        } else {

        }


        console.error(e)
      }
    }
  }
})
</script>

<style scoped>
.qrcode-area {

}
</style>
