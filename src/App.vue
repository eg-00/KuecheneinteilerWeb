<template>
  <div id="app">
    <!-- Header -->
    <header>
      <h1>🍳 Kücheneinteilung</h1>
      <p>Faire Verteilung von Küchendiensten</p>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Controls -->
      <div class="controls-bar">
        <div class="flex gap-3 flex-wrap">
          <button
            @click="store.loadExample"
            class="btn-success"
          >
            📚 Beispieldaten
          </button>
          <button
            @click="store.clearAll"
            :disabled="!store.isReady"
            :class="store.isReady ? 'btn-danger' : 'opacity-60 cursor-not-allowed'"
          >
            🗑️ Alles löschen
          </button>
        </div>

        <div :class="['controls-status', store.isReady ? 'ready' : 'pending']">
          <span v-if="store.isReady">
            {{ store.people.length }} Personen | {{ store.meals.length }} Mahlzeiten
          </span>
          <span v-else>
            CSV-Dateien hochladen
          </span>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="store.error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p class="font-semibold">❌ {{ store.error }}</p>
      </div>

      <!-- File Upload Section -->
      <div v-show="!store.hasSchedule">
        <FileUpload />
      </div>

      <!-- Results Section (shown after schedule generation) -->
      <template v-if="store.hasSchedule">
        <!-- Schedule Display -->
        <ScheduleDisplay />

        <!-- Warnings -->
        <WarningsPanel />

        <!-- Statistics -->
        <StatisticsPanel />

        <!-- Export -->
        <ExportOptions />
      </template>
    </main>

    <!-- Footer -->
    <footer>
      <p>
        Kücheneinteilung Web • Lokale Datenspeicherung • <a href="#" class="text-blue-400 hover:text-blue-300">Hilfe</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useScheduleStore } from './stores/scheduleStore';
import FileUpload from './components/FileUpload.vue';
import ScheduleDisplay from './components/ScheduleDisplay.vue';
import WarningsPanel from './components/WarningsPanel.vue';
import StatisticsPanel from './components/StatisticsPanel.vue';
import ExportOptions from './components/ExportOptions.vue';

const store = useScheduleStore();

onMounted(() => {
  store.initialize();
});
</script>
