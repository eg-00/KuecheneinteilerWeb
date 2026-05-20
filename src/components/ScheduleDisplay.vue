<template>
  <div v-if="store.hasSchedule" class="schedule-container">
    <div class="schedule-display">
      {{ scheduleText }}
    </div>
  </div>
  <div v-else class="empty-state">
    <p>ℹ️ Laden Sie CSV-Dateien hoch und generieren Sie einen Einteilungsplan</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore } from '../stores/scheduleStore';
import { ScheduleFormatter } from '../services/scheduleFormatter';

const store = useScheduleStore();
const formatter = new ScheduleFormatter();

const scheduleText = computed(() => {
  if (!store.schedule) return '';
  return formatter.formatAsPlainText(store.schedule, store.meals, []);
});
</script>
