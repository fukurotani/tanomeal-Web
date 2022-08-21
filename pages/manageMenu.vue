<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.disable="{ item }">
      <v-switch
        :value="!item.disable"
        :disabled="item!=edit"
      >
      </v-switch>
    </template>
    <template v-slot:item.actions="{ item }">

      <v-icon
        class="mr-2"
        @click="setEdit(item)"
        v-if="item!=edit"
      >
        mdi-pencil
      </v-icon>
      <div v-else>
        <v-tooltip bottom>
          <span>保存</span>
          <template v-slot:activator="{on,attrs}">
            <v-btn small color="green" fab v-on="on" v-bind="attrs" @click="save(item)">
              <v-icon>
                mdi-content-save
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip bottom>
          <span>キャンセル</span>
          <template v-slot:activator="{on,attrs}">
            <v-btn small color="orange" fab v-on="on" v-bind="attrs" @click="setEdit(null)">
              <v-icon>
                mdi-cancel
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">

import Vue from "vue";
import {DataTableHeader, DataTableItemProps} from "vuetify";

export type ItemType = {
  name: string,
  price: number,
  disable: boolean
}
export default Vue.extend({
  name: "manageMenu",
  data() {
    return {
      edit: null as ItemType | null,
      headers: [
        {
          text: '商品名',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {text: '値段', value: 'price'},
        {text: '販売中', value: 'disable'},
        {text: '編集', value: 'actions', sortable: false},
      ] as Array<DataTableHeader>,
      items: [
        {
          name: "Aセット",
          price: 100,
          disable: false
        } as ItemType
      ]
    }
  },
  methods: {
    setEdit(item: ItemType) {
      this.edit = item
    },
    save(oldData:ItemType){

    },
  }
})
</script>

<style scoped>

</style>
