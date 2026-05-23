<template>
  <div v-if="store.hasSchedule" class="export-container">
    <h3>📥 Exportieren</h3>
    
    <div class="export-buttons">
      <!-- Copy to Clipboard -->
      <button
        @click="copyToClipboard"
        class="btn-primary"
      >
        📋 Kopieren
      </button>

      <!-- Download as Text -->
      <button
        @click="downloadAsText"
        class="btn-success"
      >
        💾 Text
      </button>

      <!-- Print/HTML -->
      <button
        @click="printHTML"
        class="btn-warning"
      >
        🖨️ Drucken
      </button>

      <!-- Download as CSV -->
      <button
        @click="downloadAsCSV"
        class="btn-orange"
      >
        📊 CSV
      </button>
    </div>

    <!-- Toast notification -->
    <div v-if="showToast" class="toast-notification">
      ✓ {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScheduleStore } from '../stores/scheduleStore';

const store = useScheduleStore();
const showToast = ref(false);
const toastMessage = ref('');

function showNotification(message: string) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function copyToClipboard() {
  const text = store.exportAsPlainText();
  navigator.clipboard.writeText(text).then(() => {
    showNotification('In Zwischenablage kopiert!');
  });
}

function downloadAsText() {
  const text = store.exportAsPlainText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `kuecheneinteilung_${getCurrentDate()}.txt`);
  showNotification('Text-Datei heruntergeladen!');
}

function printHTML() {
  const html = store.exportAsHTML();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.addEventListener('load', () => {
      newWindow.print();
    });
  }
}

function downloadAsCSV() {
  const csv = store.exportAsCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `kuecheneinteilung_${getCurrentDate()}.csv`);
  showNotification('CSV-Datei heruntergeladen!');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getCurrentDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}
</script>
