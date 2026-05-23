<template>
  <div v-if="store.hasSchedule" class="statistics-container">
    <h3>📊 Einteilungsstatistik</h3>
    
    <div class="stats-list">
      <div v-for="person in sortedPeople" :key="`${person.name}-${person.type}`" class="stat-item">
        <div class="stat-name">
          {{ person.name }}
          <span class="type-badge">({{ person.type === 'LEITER' ? 'L' : 'T' }})</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar">
            <div
              class="stat-bar-fill"
              :style="{ width: `${((assignments.get?.(person) ?? 0) / (maxAssignments || 1) * 100) || 0}%` }"
              :class="[
                (assignments.get?.(person) ?? 0) <= minAssignments + 1 ? '' : 'warning'
              ]"
            ></div>
          </div>
          <span class="stat-count">{{ assignments.get?.(person) || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="stats-summary">
      <p><strong>ℹ️ Fairness-Übersicht:</strong></p>
      <p>Min: <strong>{{ minAssignments }}</strong> | Max: <strong>{{ maxAssignments }}</strong> | Differenz: <strong>{{ maxAssignments - minAssignments }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore } from '../stores/scheduleStore';
import { Person } from '../models/index';

const store = useScheduleStore();

const assignments = computed(() => store.getAssignmentStats());

const sortedPeople = computed(() => {
  return [...store.people].sort((a, b) => {
    const countA = assignments.value.get(a) || 0
    const countB = assignments.value.get(b) || 0
    if (countA !== countB) return countB - countA
    return a.name.localeCompare(b.name)
  })
})

const maxAssignments = computed(() => {
  let max = 0
  const stats = assignments.value
  if (!stats) return max
  for (const count of stats.values()) {
    if (count > max) max = count
  }
  return max
})

const minAssignments = computed(() => {
  let min = Infinity
  const stats = assignments.value
  if (!stats) return 0
  for (const count of stats.values()) {
    if (count < min) min = count
  }
  return min === Infinity ? 0 : min
})
</script>
