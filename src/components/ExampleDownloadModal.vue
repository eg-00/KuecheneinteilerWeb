<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isOpen"
    class="modal-backdrop"
    @click="close"
  ></div>

  <!-- Modal Content -->
  <div
    v-if="isOpen"
    class="modal-content"
  >
    <div class="modal-header">
      <h2>📥 Beispieldateien herunterladen</h2>
      <button
        class="modal-close"
        @click="close"
      >
        ✕
      </button>
    </div>

    <div class="modal-body">
      <p style="color: #64748b; margin-bottom: 24px; line-height: 1.6;">
        Laden Sie die folgenden CSV-Dateien herunter, um die richtige Formatierung zu verstehen.
        Bearbeiten Sie die Dateien dann mit Excel, Calc oder einem Texteditor.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 28px;">
         <!-- People CSV Download -->
         <a :href="`${baseUrl}people_example.csv`" download class="btn-primary" style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: auto; padding: 16px; text-decoration: none; justify-content: center;">
           <span style="font-size: 2rem;">👥</span>
           <span>people.csv</span>
           <span style="font-size: 0.85rem; opacity: 0.8;">Personen</span>
         </a>

         <!-- Meals CSV Download -->
         <a :href="`${baseUrl}meals_example.csv`" download class="btn-success" style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: auto; padding: 16px; text-decoration: none; justify-content: center;">
           <span style="font-size: 2rem;">🍳</span>
           <span>meals.csv</span>
           <span style="font-size: 0.85rem; opacity: 0.8;">Mahlzeiten</span>
         </a>
       </div>

      <!-- Format Guidelines -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <h3 style="color: #1e3c72; margin-bottom: 12px; font-weight: 600;">📋 Formatierungsrichtlinien:</h3>
        
        <!-- People Format -->
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 12px;">
          <p style="color: #1e3c72; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem;">👥 people.csv:</p>
          <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 4px;">
            <strong>Spalten:</strong> Name, Typ
          </p>
          <p style="color: #64748b; font-size: 0.85rem;">
            <strong>Typ:</strong> LEITER oder TEILNEHMER
          </p>
        </div>

        <!-- Meals Format -->
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="color: #1e3c72; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem;">🍳 meals.csv:</p>
          <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 4px;">
            <strong>Spalten:</strong> Tag, Tageszeit, KöcheLeiter, KöcheTeilnehmer, SpülerLeiter, SpülerTeilnehmer
          </p>
          <p style="color: #64748b; font-size: 0.85rem;">
            <strong>Tage:</strong> Montag bis Freitag | <strong>Zeiten:</strong> Frühstück, Mittag, Abend
          </p>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button
        @click="close"
        class="btn-primary"
      >
        ✓ Schließen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Get base URL from Vite (handles both dev and prod paths)
const baseUrl = import.meta.env.BASE_URL;

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

function close() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 51;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e3c72;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #1e3c72;
}

.modal-body {
  padding: 28px;
}

.modal-footer {
  padding: 16px 28px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 20px 24px;
  }

  .modal-footer {
    padding: 12px 24px;
  }
}
</style>
