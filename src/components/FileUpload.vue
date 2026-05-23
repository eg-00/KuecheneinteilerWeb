<template>
  <div class="upload-section">
    <h2>📤 CSV-Dateien hochladen</h2>
    
    <div class="upload-container">
      <!-- Help Link -->
      <div style="margin-bottom: 24px; display: flex; justify-content: flex-end;">
        <button
          @click="showModal = true"
          style="background: none; border: none; color: #2563eb; cursor: pointer; font-weight: 500; text-decoration: underline; font-size: 0.95rem; padding: 0;"
        >
          📥 Beispieldateien herunterladen
        </button>
      </div>

      <!-- People Upload -->
      <div class="upload-item">
        <h3>👥 1. Personen (people.csv)</h3>
        <div
          @dragover.prevent="peopleFileHovered = true"
          @dragleave.prevent="peopleFileHovered = false"
          @drop.prevent="handlePeopleDrop"
          :class="['upload-dropzone', peopleFileHovered && 'active']"
        >
          <input
            type="file"
            accept=".csv"
            @change="handlePeopleFileSelect"
            ref="peopleFileInput"
            class="hidden"
          />
          <div @click="() => peopleFileInput?.click()" class="cursor-pointer">
            <p>📄 CSV-Datei hochladen oder hierhin ziehen</p>
            <p>Format: Name, Typ (LEITER oder TEILNEHMER)</p>
            <p v-if="peopleFileName" class="upload-filename">✓ {{ peopleFileName }}</p>
          </div>
        </div>
        <div v-if="peopleParsed" class="upload-preview">
          <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">✓ {{ peopleParsed.length }} Personen gefunden:</div>
          <div v-for="(person, i) in peopleParsed.slice(0, 5)" :key="i">
            • {{ person.name }} ({{ person.type }})
          </div>
          <div v-if="peopleParsed.length > 5" style="color: #0c4a6e; margin-top: 4px;">
            ... und {{ peopleParsed.length - 5 }} weitere
          </div>
        </div>
      </div>

      <!-- Meals Upload -->
      <div class="upload-item">
        <h3>🍳 2. Mahlzeiten (meals.csv)</h3>
        <div
          @dragover.prevent="mealsFileHovered = true"
          @dragleave.prevent="mealsFileHovered = false"
          @drop.prevent="handleMealsDrop"
          :class="['upload-dropzone', mealsFileHovered && 'active']"
        >
          <input
            type="file"
            accept=".csv"
            @change="handleMealsFileSelect"
            ref="mealsFileInput"
            class="hidden"
          />
          <div @click="() => mealsFileInput?.click()" class="cursor-pointer">
            <p>📄 CSV-Datei hochladen oder hierhin ziehen</p>
            <p>Format: Tag, Tageszeit, KöcheLeiter, KöcheTeilnehmer, SpülerLeiter, SpülerTeilnehmer</p>
            <p v-if="mealsFileName" class="upload-filename">✓ {{ mealsFileName }}</p>
          </div>
        </div>
        <div v-if="mealsParsed" class="upload-preview">
          <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">✓ {{ mealsParsed.length }} Mahlzeiten gefunden:</div>
          <div v-for="(meal, i) in mealsParsed.slice(0, 5)" :key="i">
            • {{ meal.day }}, {{ meal.time }}
          </div>
          <div v-if="mealsParsed.length > 5" style="color: #0c4a6e; margin-top: 4px;">
            ... und {{ mealsParsed.length - 5 }} weitere
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="parseErrors.length > 0" class="upload-error">
        <strong>⚠️ Fehler beim Parsen:</strong>
        <ul>
          <li v-for="(err, i) in parseErrors" :key="i">
            {{ err.row ? `Zeile ${err.row}: ` : '' }}{{ err.message }}
          </li>
        </ul>
      </div>

      <!-- Buttons -->
      <div class="upload-buttons">
        <button
          @click="confirmUpload"
          :disabled="!peopleParsed || !mealsParsed"
          :class="peopleParsed && mealsParsed ? 'btn-primary' : 'opacity-60 cursor-not-allowed'"
        >
          ✓ Daten bestätigen
        </button>
        <button
          @click="loadExample"
          class="btn-success"
        >
          📚 Beispieldaten laden
        </button>
      </div>
    </div>

    <!-- Example Download Modal -->
    <ExampleDownloadModal v-model="showModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScheduleStore } from '../stores/scheduleStore';
import { CsvParser } from '../services/csvParser';
import ExampleDownloadModal from './ExampleDownloadModal.vue';

const store = useScheduleStore();
const csvParser = new CsvParser();

// Modal state
const showModal = ref(false);

// File references
const peopleFileInput = ref<HTMLInputElement | undefined>()
const mealsFileInput = ref<HTMLInputElement | undefined>()

// UI State
const peopleFileHovered = ref(false)
const mealsFileHovered = ref(false)
const peopleFileName = ref('')
const mealsFileName = ref('')

// Parsed data preview
const peopleParsed = ref<any[]>([])
const mealsParsed = ref<any[]>([])

// Errors
const parseErrors = ref<any[]>([])

// Handle people file selection
function handlePeopleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    readPeopleFile(input.files[0])
  }
}

// Handle people file drop
function handlePeopleDrop(event: DragEvent) {
  peopleFileHovered.value = false
  if (event.dataTransfer?.files?.[0]) {
    readPeopleFile(event.dataTransfer.files[0])
  }
}

// Read people file
function readPeopleFile(file: File) {
  if (!file.name.endsWith('.csv')) {
    parseErrors.value = [{ message: 'Bitte wählen Sie eine CSV-Datei' }]
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    peopleFileName.value = file.name
    const result = csvParser.parsePeople(content)
    peopleParsed.value = result.people
    parseErrors.value = result.errors
  }
  reader.readAsText(file)
}

// Handle meals file selection
function handleMealsFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    readMealsFile(input.files[0])
  }
}

// Handle meals file drop
function handleMealsDrop(event: DragEvent) {
  mealsFileHovered.value = false
  if (event.dataTransfer?.files?.[0]) {
    readMealsFile(event.dataTransfer.files[0])
  }
}

// Read meals file
function readMealsFile(file: File) {
  if (!file.name.endsWith('.csv')) {
    parseErrors.value = [{ message: 'Bitte wählen Sie eine CSV-Datei' }]
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    mealsFileName.value = file.name
    const result = csvParser.parseMeals(content)
    mealsParsed.value = result.meals
    parseErrors.value = result.errors
  }
  reader.readAsText(file)
}

// Confirm upload and generate schedule
function confirmUpload() {
  if (!peopleParsed.value || !mealsParsed.value) return

  // Load via store (which uses CSV parser)
  const peopleSuccess = store.loadPeopleCsv(
    'Name,Typ\n' + peopleParsed.value.map((p) => `${p.name},${p.type}`).join('\n')
  )
  const mealsSuccess = store.loadMealsCsv(
    'Tag,Tageszeit,KöcheLeiter,KöcheTeilnehmer,SpülerLeiter,SpülerTeilnehmer\n' +
      mealsParsed.value
        .map(
          (m) =>
            `${m.day},${m.time},${m.cookingRequirement.leiter},${m.cookingRequirement.kinder},${m.cleaningRequirement.leiter},${m.cleaningRequirement.kinder}`
        )
        .join('\n')
  )

  if (peopleSuccess && mealsSuccess) {
    store.generateSchedule()
  }
}

// Load example data
function loadExample() {
  store.loadExample()
}
</script>
