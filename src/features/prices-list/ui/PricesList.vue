<script setup lang="ts">
import { Button, InputText, ConfirmPopup } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import { usePricesListModel } from '../model/usePricesListModel'

const {
  priceEntities,
  newPrice,
  addPrice,
  updatePrice,
  deletePrice,
  confirmCancelAll,
  confirmSaveAll,
} = usePricesListModel()
</script>

<template>
  <div v-if="priceEntities?.length" class="w-2/3 min-w-150 space-y-2">
    <div v-for="price in priceEntities" :key="price.id" class="flex items-center gap-2">
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
        :max="10_000_000"
      />
      <Button
        :disabled="!price.name"
        icon="pi pi-save"
        @click="updatePrice(price.id, { name: price.name, price: price.price })"
      />
      <Button
        :disabled="priceEntities.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="deletePrice(price.id)"
      />
    </div>

    <div class="flex gap-2 mt-6">
      <Button
        :disabled="priceEntities.length === 1"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="primary"
        @click="confirmSaveAll($event)"
      />
      <Button
        label="Сбросить изменения"
        icon="pi pi-times"
        severity="danger"
        @click="confirmCancelAll($event)"
      />
    </div>
  </div>
  <div class="w-2/3 min-w-150 mt-10">
    <h3 class="text-xl mb-2">Добавить новую цену</h3>
    <div class="flex gap-2">
      <InputText v-model.trim="newPrice.name" placeholder="Название" class="flex-3" />
      <!-- InputNumber работает с модификатором .lazy для v-model и поэтому значение обновляется только на блюре
      в нашем случае такая обработка сделает UX менее приятным
      поэтому пишем кастомный обработчик на событие input -->
      <InputNumber
        :modelValue="newPrice.price"
        class="flex-1"
        mode="currency"
        currency="RUB"
        locale="ru-RU"
        placeholder="Стоимость"
        :minFractionDigits="0"
        :min="0"
        :max="10_000_000"
        :step="1"
        @input="(e) => (newPrice.price = e.value as number)"
      />
      <Button
        label="Добавить"
        icon="pi pi-plus"
        :disabled="!newPrice.name || newPrice.price == null"
        @click="addPrice()"
      />
    </div>
  </div>

  <ConfirmPopup class="w-[400px]" />
</template>

<style scoped lang="scss"></style>
