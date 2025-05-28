<script setup lang="ts">
import { useTreatmentStore } from '@/entities/treatment/store'
import { onMounted, ref } from 'vue'
const treatmentStore = useTreatmentStore()

const newTreatmentName = ref('')

onMounted(() => {
  treatmentStore.loadTreatments()
})
</script>
<template>
  <ul v-if="treatmentStore.treatments?.length">
    <li v-for="treatment of treatmentStore.treatments" :key="treatment.id">
      <input type="text" v-model="treatment.name" />
    </li>
  </ul>
  <input type="text" v-model="newTreatmentName" />
  <br />
  <button @click="treatmentStore.addTreatment({ name: newTreatmentName })">Добавить</button>
  <br />
  <button @click="treatmentStore.saveAllTreatments()">Сохранить все</button>
</template>
