<script setup lang="ts">
import { Button } from 'primevue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExercisesListModel } from '../model/useExercisesListModel'

const {
  exerciseCategoryStore: ecStore,
  confirmDeleteExercise,
  goToExerciseCreate,
  goToExerciseEdit,
  goToExerciseView,
} = useExercisesListModel()
</script>

<template>
  <Button
    @click="goToExerciseCreate()"
    label="Добавить новое упражнение"
    size="large"
    icon="pi pi-plus"
  />
  <template v-if="ecStore.exerciseCategories?.length">
    <Accordion :value="['0']" multiple class="mt-10">
      <AccordionPanel
        v-for="ec in ecStore.exerciseCategories"
        :key="ec.id"
        :value="ec.id"
        class="my-3"
      >
        <AccordionHeader>
          <div>
            <span class="text-2xl">{{ ec.name }}</span>
            <br />
            <span class="text-gray-600">/{{ ec.url }}/</span>
          </div>
          <Button
            @click.stop="goToExerciseCreate(ec.id)"
            icon="pi pi-plus"
            class="ml-auto mr-4"
            label="Добавить упражнение в категорию"
          />
        </AccordionHeader>
        <AccordionContent>
          <ul v-if="ec.exercises?.length">
            <li v-for="exercise in ec.exercises" :key="exercise.id" class="exercise-list-item">
              <span class="exercise-list-item__name">{{ exercise.name }}</span>
              <span class="exercise-list-item__actions">
                <Button
                  @click="goToExerciseView(exercise.id)"
                  variant="text"
                  icon="pi pi-eye"
                  title="Просмотреть"
                />
                <Button
                  @click="goToExerciseEdit(exercise.id)"
                  variant="text"
                  icon="pi pi-pencil"
                  title="Редактировать"
                />
                <Button
                  @click="confirmDeleteExercise(exercise.id, $event)"
                  severity="danger"
                  variant="text"
                  icon="pi pi-trash"
                  title="Удалить"
                />
              </span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </template>
  <ConfirmPopup
    class="w-[200px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>

<style scoped lang="scss">
.exercise-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--p-surface-200);
  transition: 0.3s background-color;

  &:hover {
    background-color: var(--p-surface-800);
  }

  &__name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
