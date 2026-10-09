<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, ConfirmPopup, useConfirm } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import { usePricesListPageModel } from './usePricesListPageModel'
import type { PriceDto } from '@/entities/price/types'
import { useUiStateUtilsByDirtyCheck } from '@/shared/composables/editable-entity-list/useUiStateUtilsByDirtyCheck'

usePageTitle('Цены')

const {
  priceEntities,
  newPrice,
  isLoading,
  dirtyIds,
  addPrice,
  updatePrice,
  deletePrice,
  cancelAllChanges,
  saveAllChanges,
  cancelChange,
} = usePricesListPageModel()

const confirmService = useConfirm()

const confirmCancelAll = (event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: 'Отменить все текущие изменения цен?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Нет',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Да',
      severity: 'danger',
    },
    accept: cancelAllChanges,
  })
}

const confirmSaveAll = (event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: 'Сохранить все текущие изменения цен?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Нет',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Да',
    },
    accept: saveAllChanges,
  })
}

const addPriceSecured = () => {
  if (isAddBtnDisabled()) return
  addPrice()
}

/* ──────────────────── ui state methods ─────────────────── */
const uiStateUtils = useUiStateUtilsByDirtyCheck(dirtyIds)

const isUpdateBtnDisabled = (price: PriceDto) =>
  !price.name || price.price == null || uiStateUtils.isUpdateBtnDisabled(price.id)
const isDeleteBtnDisabled = (price: PriceDto) =>
  priceEntities.value.length === 1 || uiStateUtils.isDeleteBtnDisabled(price.id)
const isCancelBtnDisabled = (price: PriceDto) => !uiStateUtils.isEntityChanged(price.id)
const isSaveAllBtnDisabled = () =>
  priceEntities.value.length === 1 || uiStateUtils.isBatchBtnDisabled()
const isCancelAllBtnDisabled = () => uiStateUtils.isBatchBtnDisabled()
const isAddBtnDisabled = () =>
  !newPrice.value.name ||
  newPrice.value.price == null ||
  isLoading.value ||
  uiStateUtils.isAddBtnDisabled()
</script>

<template>
  <form v-if="priceEntities?.length" @submit.prevent class="w-2/3 min-w-150 space-y-2">
    <div class="price-row text-xl font-medium">
      <h3>Название</h3>
      <h3 style="min-width: 13rem">Стоимость</h3>
    </div>
    <div
      v-for="price of priceEntities"
      :key="price.id"
      class="price-row"
      :class="{ 'input-group--highlighted': uiStateUtils.isEntityChanged(price.id) }"
    >
      <InputText v-model.trim="price.name" placeholder="Название" />
      <InputNumber
        v-model="price.price"
        mode="currency"
        currency="RUB"
        locale="ru-RU"
        placeholder="Стоимость"
        :min="0"
        :step="1"
        :minFractionDigits="0"
        :max="10_000_000"
      />
      <Button
        :disabled="isUpdateBtnDisabled(price)"
        icon="pi pi-save"
        @click="updatePrice(price.id, { name: price.name, price: price.price })"
      />
      <Button
        :disabled="isDeleteBtnDisabled(price)"
        icon="pi pi-trash"
        severity="danger"
        @click="deletePrice(price.id)"
      />
      <Button
        :disabled="isCancelBtnDisabled(price)"
        icon="pi pi-undo"
        severity="contrast"
        @click="cancelChange(price.id)"
      />
    </div>

    <div class="flex gap-2 mt-6">
      <Button
        :disabled="isSaveAllBtnDisabled()"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="primary"
        @click="confirmSaveAll($event)"
      />
      <Button
        :disabled="isCancelAllBtnDisabled()"
        label="Сбросить изменения"
        icon="pi pi-times"
        severity="danger"
        @click="confirmCancelAll($event)"
      />
    </div>
  </form>
  <form @submit.prevent class="w-2/3 min-w-150 mt-10">
    <h3 class="text-xl mb-2">Добавить новую цену</h3>
    <div class="new-price-row">
      <div class="flex flex-col gap-2">
        <Label for="new-price-text">Название</Label>
        <InputText
          id="new-price-text"
          v-model.trim="newPrice.name"
          placeholder="Название"
          class="w-full"
          @keydown.enter="addPriceSecured"
        />
      </div>
      <!-- TODO: видимо из-за этого решения не работают ограничения по экстремальным значениям в случае если добавление/апдейт происходят до блюра с поля -->
      <!--
      InputNumber почему-то работает только с модификатором .lazy для v-model, поэтому значение обновляется на блюре,
      в нашем случае такая обработка сделает UX менее приятным из-за атрибута disabled у кнопки добавления,
      поэтому пишем кастомный обработчик на событие input
      -->
      <div class="flex flex-col gap-2">
        <Label for="new-price-text">Стоимость</Label>
        <InputNumber
          :modelValue="newPrice.price"
          class="w-full"
          mode="currency"
          currency="RUB"
          locale="ru-RU"
          placeholder="Стоимость"
          :minFractionDigits="0"
          :min="0"
          :max="10_000_000"
          :step="1"
          @input="(e) => (newPrice.price = e.value as number)"
          @keydown.enter="addPriceSecured"
        />
      </div>
      <Button
        label="Добавить"
        icon="pi pi-plus"
        class="self-end"
        :disabled="isAddBtnDisabled()"
        :loading="isLoading"
        @click="addPrice()"
      />
    </div>
  </form>

  <ConfirmPopup class="w-[400px]" />
</template>

<style scoped lang="scss">
.price-row {
  display: grid;
  grid-template-columns: 2fr 1fr repeat(3, 2.5rem);
  align-items: center;
  column-gap: 0.5rem;
}
.new-price-row {
  display: grid;
  grid-template-columns: 2fr 1fr 8.5rem;
  align-items: center;
  column-gap: 0.5rem;
}
</style>
