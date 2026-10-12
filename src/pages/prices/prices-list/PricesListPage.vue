<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, Label } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import { usePricesListPageModel } from './usePricesListPageModel'
import type { PriceDto } from '@/entities/price/types'
import { useActionsAvailableChecks } from '@/shared/composables/entity-list-form/useActionsAvailableChecks'
import { computed } from 'vue'
import BatchActionsBar from '@/features/batch-actions-bar/BatchActionsBar.vue'

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

/* ──────────────────── operations available checks ─────────────────── */
const actionsAvailableChecks = useActionsAvailableChecks(dirtyIds)

// TODO: rename to items in all components
const canUpdate = (item: PriceDto) =>
  Boolean(item.name && item.price != null && actionsAvailableChecks.canUpdate(item.id))
const canDelete = (item: PriceDto) =>
  priceEntities.value.length !== 1 && actionsAvailableChecks.canDelete(item.id)
const canCancel = (item: PriceDto) => actionsAvailableChecks.isEntityChanged(item.id)

const canAdd = computed(() =>
  Boolean(
    newPrice.value.name &&
      newPrice.value.price != null &&
      !isLoading.value &&
      actionsAvailableChecks.canAdd(),
  ),
)
const canSaveAll = computed(
  () => priceEntities.value.length !== 1 && actionsAvailableChecks.canBatchOperation(),
)
const canCancelAll = computed(() => actionsAvailableChecks.canBatchOperation())

/* ──────────────────────── operations ──────────────────────── */
const addPriceSecured = () => {
  if (!canAdd.value) return
  addPrice()
}
</script>

<template>
  <form v-if="priceEntities?.length" @submit.prevent class="w-2/3 min-w-200 space-y-2">
    <div class="price-row text-2xl font-medium">
      <h3>Название</h3>
      <h3>Стоимость</h3>
    </div>
    <div
      v-for="item of priceEntities"
      :key="item.id"
      class="price-row"
      :class="{ 'input-group--highlighted': actionsAvailableChecks.isEntityChanged(item.id) }"
    >
      <InputText v-model.trim="item.name" placeholder="Название" />
      <InputNumber
        v-model="item.price"
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
        :disabled="!canUpdate(item)"
        icon="pi pi-save"
        @click="updatePrice(item.id, { name: item.name, price: item.price })"
      />
      <Button
        :disabled="!canDelete(item)"
        icon="pi pi-trash"
        severity="danger"
        @click="deletePrice(item.id)"
      />
      <Button
        :disabled="!canCancel(item)"
        icon="pi pi-undo"
        severity="contrast"
        @click="cancelChange(item.id)"
      />
    </div>

    <BatchActionsBar
      :can-save-all="canSaveAll"
      :can-cancel-all="canCancelAll"
      @save-all="saveAllChanges"
      @cancel-all="cancelAllChanges"
    />
  </form>
  <form @submit.prevent class="w-2/3 min-w-200 mt-10">
    <h3 class="text-3xl mb-2">Добавить новую цену</h3>
    <div class="new-price-row">
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium" for="new-price-text">Название</Label>
        <InputText
          id="new-price-text"
          v-model.trim="newPrice.name"
          placeholder="Название"
          class="w-full"
          @keydown.enter="addPriceSecured"
        />
      </div>
      <!--
      InputNumber почему-то работает только с модификатором .lazy для v-model, поэтому значение обновляется на блюре,
      в нашем случае такая обработка сделает UX менее приятным из-за атрибута disabled у кнопки добавления,
      поэтому пишем кастомный обработчик на событие input
      -->
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium" for="new-price-text">Стоимость</Label>
        <InputNumber
          v-model="newPrice.price"
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
        :loading="isLoading"
        :disabled="!canAdd"
        @click="addPrice()"
      />
    </div>
  </form>
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

.price-row,
.new-price-row {
  & > *,
  & .p-inputnumber > :deep(input) {
    min-width: 0;
  }
}
</style>
