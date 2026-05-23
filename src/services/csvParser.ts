/**
 * CSV Parser Service
 * Converts CSV file content to People and Meals using Papa Parse
 */

import Papa from 'papaparse';
import {
  Person,
  Meal,
  PersonType,
  DayOfWeek,
  MealTime,
  parsePersonType,
  fromString as parseDayOfWeek,
  fromStringMealTime,
  createMealRequirement,
  createMeal,
  createPerson,
} from '../models/index';

export interface ParseError {
  message: string;
  row?: number;
  field?: string;
}

export class CsvParser {
  /**
   * Parse people from CSV content
   * Expected headers: Name, Typ
   */
  parsePeople(csvContent: string): { people: Person[]; errors: ParseError[] } {
    const errors: ParseError[] = [];
    const people: Person[] = [];

    try {
      const result = Papa.parse(csvContent, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
      });

      if (!result.data || result.data.length === 0) {
        errors.push({ message: 'CSV-Datei ist leer' });
        return { people, errors };
      }

      // Check headers
      const firstRow = result.data[0] as any;
      if (!firstRow.Name || !firstRow.Typ) {
        errors.push({ message: 'Ungültige Header. Erwartet: Name, Typ' });
        return { people, errors };
      }

      // Parse rows
      result.data.forEach((row: any, index: number) => {
        if (!row.Name && !row.Typ) return; // Skip empty rows

        try {
          const name = (row.Name || '').trim();
          const typeStr = (row.Typ || '').trim();

          if (!name) {
            errors.push({
              message: 'Name darf nicht leer sein',
              row: index + 2,
            });
            return;
          }

          const type = parsePersonType(typeStr);
          people.push(createPerson(name, type));
        } catch (e) {
          errors.push({
            message: `${e instanceof Error ? e.message : 'Unbekannter Fehler'}`,
            row: index + 2,
          });
        }
      });

      if (people.length === 0 && errors.length === 0) {
        errors.push({ message: 'Keine gültigen Personen gefunden' });
      }
    } catch (e) {
      errors.push({
        message: `CSV-Parsing-Fehler: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`,
      });
    }

    return { people, errors };
  }

  /**
   * Parse meals from CSV content
   * Expected headers: Tag, Tageszeit, KöcheLeiter, KöcheTeilnehmer, SpülerLeiter, SpülerTeilnehmer
   */
  parseMeals(csvContent: string): { meals: Meal[]; errors: ParseError[] } {
    const errors: ParseError[] = [];
    const meals: Meal[] = [];

    try {
      const result = Papa.parse(csvContent, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
      });

      if (!result.data || result.data.length === 0) {
        errors.push({ message: 'CSV-Datei ist leer' });
        return { meals, errors };
      }

      // Check headers
      const firstRow = result.data[0] as any;
      const requiredHeaders = ['Tag', 'Tageszeit', 'KöcheLeiter', 'KöcheTeilnehmer', 'SpülerLeiter', 'SpülerTeilnehmer'];
      const missingHeaders = requiredHeaders.filter(h => !firstRow[h]);

      if (missingHeaders.length > 0) {
        errors.push({
          message: `Ungültige Header. Erforderlich: ${requiredHeaders.join(', ')}`,
        });
        return { meals, errors };
      }

      // Parse rows
      result.data.forEach((row: any, index: number) => {
        if (!row.Tag && !row.Tageszeit) return; // Skip empty rows

        try {
          const dayStr = (row.Tag || '').trim();
          const timeStr = (row.Tageszeit || '').trim();
          const cooksLeiter = this.parseInt(row.KöcheLeiter, 'KöcheLeiter');
          const cooksTeilnehmer = this.parseInt(row.KöcheTeilnehmer, 'KöcheTeilnehmer');
          const cleanersLeiter = this.parseInt(row.SpülerLeiter, 'SpülerLeiter');
          const cleanersTeilnehmer = this.parseInt(row.SpülerTeilnehmer, 'SpülerTeilnehmer');

          const day = parseDayOfWeek(dayStr);
          const time = fromStringMealTime(timeStr);
          const cookingReq = createMealRequirement(cooksLeiter, cooksTeilnehmer);
          const cleaningReq = createMealRequirement(cleanersLeiter, cleanersTeilnehmer);

          meals.push(createMeal(day, time, cookingReq, cleaningReq));
        } catch (e) {
          errors.push({
            message: `${e instanceof Error ? e.message : 'Unbekannter Fehler'}`,
            row: index + 2,
          });
        }
      });

      if (meals.length === 0 && errors.length === 0) {
        errors.push({ message: 'Keine gültigen Mahlzeiten gefunden' });
      }
    } catch (e) {
      errors.push({
        message: `CSV-Parsing-Fehler: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}`,
      });
    }

    return { meals, errors };
  }

  private parseInt(value: string, fieldName: string): number {
    try {
      const num = parseInt((value || '').trim(), 10);
      if (isNaN(num)) {
        throw new Error(`Ungültige Zahl für ${fieldName}: ${value}`);
      }
      if (num < 0) {
        throw new Error(`${fieldName} darf nicht negativ sein: ${value}`);
      }
      return num;
    } catch (e) {
      throw new Error(`Ungültige Zahl für ${fieldName}: ${value}`);
    }
  }
}
