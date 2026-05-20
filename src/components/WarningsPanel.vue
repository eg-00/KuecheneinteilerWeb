<template>
  <div v-if="store.warnings.length > 0" class="warnings-container">
    <h3>⚠️ Warnungen</h3>
    <div class="warnings-list">
      <div v-for="(warning, i) in store.warnings" :key="i" class="warning-item">
        <span class="warning-icon">⚠️</span>{{ warning }}
      </div>
    </div>
  </div>
  <div v-else-if="store.hasSchedule" class="warnings-container">
    <div class="warnings-success">
      ✓ Keine Warnungen - alle Anforderungen erfüllt!
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScheduleStore } from '../stores/scheduleStore';

const store = useScheduleStore();
</script>
