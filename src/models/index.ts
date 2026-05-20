/**
 * All TypeScript interfaces and enums for the Kuecheneinteiler application
 * These mirror the Java model classes but adapted for TypeScript
 */

// PersonType enum - Personen Typ
export enum PersonType {
  LEITER = 'LEITER',
  TEILNEHMER = 'TEILNEHMER',
}

export function getPersonTypeDisplay(type: PersonType): string {
  return type === PersonType.LEITER ? 'L' : 'T'
}

export function getPersonTypeName(type: PersonType): string {
  return type === PersonType.LEITER ? 'Leiter' : 'Teilnehmer'
}

// DayOfWeek enum - Wochentage
export enum DayOfWeek {
  MONTAG = 'Montag',
  DIENSTAG = 'Dienstag',
  MITTWOCH = 'Mittwoch',
  DONNERSTAG = 'Donnerstag',
  FREITAG = 'Freitag',
  SAMSTAG = 'Samstag',
  SONNTAG = 'Sonntag',
}

export function getDayOfWeekDisplay(day: DayOfWeek): string {
  return day
}

export function getDayOfWeekOrdinal(day: DayOfWeek): number {
  const days = [DayOfWeek.MONTAG, DayOfWeek.DIENSTAG, DayOfWeek.MITTWOCH, DayOfWeek.DONNERSTAG, DayOfWeek.FREITAG, DayOfWeek.SAMSTAG, DayOfWeek.SONNTAG]
  return days.indexOf(day)
}

export function fromString(value: string): DayOfWeek {
  const day = Object.values(DayOfWeek).find((d) => d === value)
  if (!day) {
    throw new Error(`Ungültiger Wochentag: ${value}`)
  }
  return day
}

// MealTime enum - Tageszeiten
export enum MealTime {
  MORGENS = 'Morgens',
  MITTAGS = 'Mittags',
  ABENDS = 'Abends',
}

export function getMealTimeDisplay(time: MealTime): string {
  return time
}

export function getMealTimeOrdinal(time: MealTime): number {
  const times = [MealTime.MORGENS, MealTime.MITTAGS, MealTime.ABENDS]
  return times.indexOf(time)
}

export function fromStringMealTime(value: string): MealTime {
  const time = Object.values(MealTime).find((t) => t === value)
  if (!time) {
    throw new Error(`Ungültige Tageszeit: ${value}`)
  }
  return time
}

// Role enum - Rollen
export enum Role {
  COOKING = 'COOKING',
  CLEANING = 'CLEANING',
}

export function getRoleDisplay(role: Role): string {
  return role === Role.COOKING ? 'Kochen' : 'Spülen'
}

export function getRoleEmoji(role: Role): string {
  return role === Role.COOKING ? '🍳' : '🧹'
}

// Person interface
export interface Person {
  name: string
  type: PersonType
}

export function createPerson(name: string, type: PersonType): Person {
  if (!name || name.trim().length === 0) {
    throw new Error('Name darf nicht leer sein')
  }
  return { name, type }
}

export function personToString(person: Person): string {
  return `${person.name} (${getPersonTypeDisplay(person.type)})`
}

// MealRequirement interface
export interface MealRequirement {
  leiter: number
  kinder: number
}

export function createMealRequirement(leiter: number, kinder: number): MealRequirement {
  if (leiter < 0 || kinder < 0) {
    throw new Error('Anforderungen dürfen nicht negativ sein')
  }
  return { leiter, kinder }
}

// Meal interface
export interface Meal {
  day: DayOfWeek
  time: MealTime
  cookingRequirement: MealRequirement
  cleaningRequirement: MealRequirement
}

export function createMeal(
  day: DayOfWeek,
  time: MealTime,
  cookingRequirement: MealRequirement,
  cleaningRequirement: MealRequirement
): Meal {
  return {
    day,
    time,
    cookingRequirement,
    cleaningRequirement,
  }
}

export function mealIdentifier(meal: Meal): string {
  return `${meal.day}, ${meal.time}`
}

export function mealEquals(meal1: Meal, meal2: Meal): boolean {
  return meal1.day === meal2.day && meal1.time === meal2.time
}

// Assignment interface
export interface Assignment {
  person: Person
  meal: Meal
  role: Role
}

export function createAssignment(person: Person, meal: Meal, role: Role): Assignment {
  return { person, meal, role }
}

// Schedule class
export class Schedule {
  assignments: Assignment[] = []

  addAssignment(assignment: Assignment): void {
    this.assignments.push(assignment)
  }

  getAllAssignments(): Assignment[] {
    return [...this.assignments]
  }

  getAssignmentsByMealAndRole(meal: Meal, role: Role): Assignment[] {
    return this.assignments.filter((a) => mealEquals(a.meal, meal) && a.role === role)
  }

  size(): number {
    return this.assignments.length
  }

  clear(): void {
    this.assignments = []
  }
}

// Helper function to parse PersonType from string
export function parsePersonType(value: string): PersonType {
  const type = Object.values(PersonType).find((t) => t === value)
  if (!type) {
    throw new Error(`Ungültig PersonType: ${value}. Muss 'LEITER' oder 'TEILNEHMER' sein`)
  }
  return type
}
