/**
 * Pinia Store for Schedule Management
 * Handles state, localStorage persistence, and business logic orchestration
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  Person,
  Meal,
  Assignment,
  PersonType,
  Schedule,
} from '../models/index';
import { CsvParser, ParseError } from '../services/csvParser';
import { AssignmentEngine } from '../services/assignmentEngine';
import { ConflictDetector } from '../services/conflictDetector';
import { ScheduleFormatter } from '../services/scheduleFormatter';

// LocalStorage key
const STORAGE_KEY = 'kuecheneinteilung_data_v1';

interface StoredState {
  people: Person[];
  meals: Meal[];
  schedule: Assignment[];
  warnings: string[];
  timestamp: number;
}

export const useScheduleStore = defineStore('schedule', () => {
  // State
  const people = ref<Person[]>([]);
  const meals = ref<Meal[]>([]);
  const schedule = ref<Schedule | null>(null);
  const warnings = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const parseErrors = ref<ParseError[]>([]);

  // Services
  const csvParser = new CsvParser();
  const conflictDetector = new ConflictDetector();
  const scheduleFormatter = new ScheduleFormatter();

  // Computed
  const isReady = computed(() => people.value.length > 0 && meals.value.length > 0);

  const assignmentStats = computed(() => {
    if (!schedule.value) return new Map();
    return getAssignmentStats();
  });

  const hasSchedule = computed(() => schedule.value !== null && schedule.value.size() > 0);

  /**
   * Get assignment statistics
   */
  function getAssignmentStats(): Map<Person, number> {
    const stats = new Map<Person, number>();
    if (!schedule.value) return stats;

    for (const person of people.value) {
      const count = schedule.value
        .getAllAssignments()
        .filter(a => a.person.name === person.name && a.person.type === person.type).length;
      stats.set(person, count);
    }
    return stats;
  }

  /**
   * Load people from CSV content
   */
  function loadPeopleCsv(content: string): boolean {
    error.value = null;
    parseErrors.value = [];

    try {
      const result = csvParser.parsePeople(content);
      parseErrors.value = result.errors;

      if (result.errors.length > 0 && result.people.length === 0) {
        error.value = result.errors[0].message;
        return false;
      }

      people.value = result.people;
      saveToLocalStorage();
      return true;
    } catch (e) {
      error.value = `Fehler beim Laden der Personen: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`;
      return false;
    }
  }

  /**
   * Load meals from CSV content
   */
  function loadMealsCsv(content: string): boolean {
    error.value = null;
    parseErrors.value = [];

    try {
      const result = csvParser.parseMeals(content);
      parseErrors.value = result.errors;

      if (result.errors.length > 0 && result.meals.length === 0) {
        error.value = result.errors[0].message;
        return false;
      }

      meals.value = result.meals;
      saveToLocalStorage();
      return true;
    } catch (e) {
      error.value = `Fehler beim Laden der Mahlzeiten: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`;
      return false;
    }
  }

  /**
   * Generate schedule from current people and meals
   */
  function generateSchedule(): boolean {
    error.value = null;

    if (people.value.length === 0) {
      error.value = 'Bitte laden Sie zuerst die Personen.';
      return false;
    }

    if (meals.value.length === 0) {
      error.value = 'Bitte laden Sie zuerst die Mahlzeiten.';
      return false;
    }

    try {
      loading.value = true;

      const engine = new AssignmentEngine(people.value);
      schedule.value = engine.generateAssignments(meals.value);
      warnings.value = conflictDetector.detectConflicts(schedule.value, meals.value);

      saveToLocalStorage();
      return true;
    } catch (e) {
      error.value = `Fehler beim Generieren der Einteilung: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`;
      schedule.value = null;
      warnings.value = [];
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load example data
   */
  function loadExample(): void {
    error.value = null;
    parseErrors.value = [];

    // Example people
    const peopleCsv = `Name,Typ
Emil,LEITER
Maria,LEITER
Julia,LEITER
Max,LEITER
Anna,TEILNEHMER
Tom,TEILNEHMER
Sofia,TEILNEHMER
Lisa,TEILNEHMER
Peter,TEILNEHMER
Felix,TEILNEHMER`;

    // Example meals
    const mealsCsv = `Tag,Tageszeit,KöcheLeiter,KöcheTeilnehmer,SpülerLeiter,SpülerTeilnehmer
Montag,Morgens,1,3,1,2
Montag,Mittags,2,4,1,3
Montag,Abends,1,2,2,4
Dienstag,Morgens,1,3,1,2
Dienstag,Mittags,2,3,1,3
Dienstag,Abends,1,2,1,2
Mittwoch,Morgens,1,2,1,2
Mittwoch,Mittags,1,3,1,3
Mittwoch,Abends,2,4,2,3
Donnerstag,Morgens,1,3,1,2
Donnerstag,Mittags,1,3,1,3
Donnerstag,Abends,1,2,1,2
Freitag,Morgens,1,2,1,2
Freitag,Mittags,2,4,2,4
Freitag,Abends,1,3,1,3`;

    loadPeopleCsv(peopleCsv);
    loadMealsCsv(mealsCsv);
    generateSchedule();
  }

  /**
   * Export as plain text
   */
  function exportAsPlainText(): string {
    if (!schedule.value) return '';
    return scheduleFormatter.formatAsPlainText(schedule.value, meals.value, warnings.value);
  }

  /**
   * Export as HTML for printing
   */
  function exportAsHTML(): string {
    if (!schedule.value) return '';
    return scheduleFormatter.formatAsHTML(schedule.value, meals.value, warnings.value);
  }

  /**
   * Export as CSV (without warnings, just data)
   */
  function exportAsCSV(): string {
    if (!schedule.value) return '';
    return scheduleFormatter.formatAsCSV(schedule.value);
  }

  /**
   * Export as JSON
   */
  function exportAsJSON(): string {
    if (!schedule.value) return '';
    const data = scheduleFormatter.formatAsJSON(schedule.value, meals.value, []);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear all data
   */
  function clearAll(): void {
    people.value = [];
    meals.value = [];
    schedule.value = null;
    warnings.value = [];
    parseErrors.value = [];
    error.value = null;
    saveToLocalStorage();
  }

  /**
   * Save state to localStorage
   */
  function saveToLocalStorage(): void {
    try {
      const state: StoredState = {
        people: people.value,
        meals: meals.value,
        schedule: schedule.value ? schedule.value.getAllAssignments() : [],
        warnings: warnings.value,
        timestamp: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Fehler beim Speichern in localStorage:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  function loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const state: StoredState = JSON.parse(stored);

      people.value = state.people || [];
      meals.value = state.meals || [];
      warnings.value = state.warnings || [];

      // Reconstruct schedule
      if (state.schedule && state.schedule.length > 0) {
        schedule.value = new Schedule();
        for (const assignment of state.schedule) {
          schedule.value.addAssignment(assignment);
        }
      }
    } catch (e) {
      console.error('Fehler beim Laden aus localStorage:', e);
      clearAll();
    }
  }

  /**
   * Initialize store - load from localStorage on app start
   */
  function initialize(): void {
    loadFromLocalStorage();
  }

  return {
    // State
    people,
    meals,
    schedule,
    warnings,
    loading,
    error,
    parseErrors,

    // Computed
    isReady,
    assignmentStats,
    hasSchedule,

    // Actions
    loadPeopleCsv,
    loadMealsCsv,
    generateSchedule,
    loadExample,
    exportAsPlainText,
    exportAsHTML,
    exportAsCSV,
    exportAsJSON,
    clearAll,
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
    getAssignmentStats,
  };
});
