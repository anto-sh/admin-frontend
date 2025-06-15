<script setup lang="ts">
import { Button, InputText, ConfirmPopup } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import { usePricesListModel } from '../model/usePricesListModel'

const { priceStore, newPrice, addPrice, deletePrice, confirmCancelAll, confirmSaveAll } =
  usePricesListModel()
</script>

<template>
  <div v-if="priceStore.prices?.length" class="w-2/3 min-w-200 space-y-2">
    <div v-for="price in priceStore.prices" :key="price.id" class="flex items-center gap-2">
      <InputText v-model.trim="price.name" placeholder="Название" class="flex-2" />
      <InputNumber
        v-model="price.price"
        mode="currency"
        currency="RUB"
        locale="ru-RU"
        class="flex-1"
        placeholder="Стоимость"
        :min="0"
        :step="1"
        :minFractionDigits="0"
      />
      <Button
        :disabled="!price.name"
        icon="pi pi-save"
        @click="priceStore.updatePrice(price.id, { name: price.name, price: price.price })"
      />
      <Button
        :disabled="priceStore.prices.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="deletePrice(price.id)"
      />
    </div>

    <div class="flex gap-2 mt-6">
      <Button
        :disabled="priceStore.prices.length === 1"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="success"
        @click="confirmSaveAll($event)"
      />
      <Button
        label="Сбросить изменения"
        icon="pi pi-times"
        severity="secondary"
        @click="confirmCancelAll($event)"
      />
    </div>
  </div>
  <div class="w-2/3 min-w-200 mt-10">
    <h3 class="text-xl mb-2">Добавить новую цену</h3>
    <div class="flex gap-2">
      <InputText v-model.trim="newPrice.name" placeholder="Название" class="flex-3" />
      <!-- по дефолту InputNumber работает с модификатором .lazy для v-model и поэтому значение обновляется только на блюре
      в нашем случае нет причин оставлять такую обработку
      поэтому пишем кастомный обработчик на событие input -->
      <InputNumber
        v-model="newPrice.price"
        mode="currency"
        currency="RUB"
        locale="ru-RU"
        class="flex-1"
        placeholder="Стоимость"
        :minFractionDigits="0"
        :min="0"
        :step="1"
        @input="(e) => (newPrice.price = e.value as number)"
      />
      <Button
        label="Добавить"
        icon="pi pi-plus"
        :disabled="!(newPrice.name && newPrice.price)"
        @click="addPrice()"
      />
    </div>
  </div>

  <ConfirmPopup class="w-[400px]" />
</template>

<style scoped lang="scss"></style>
