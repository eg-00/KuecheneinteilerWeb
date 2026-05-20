/**
 * Assignment Engine Service
 * Implements fair rotation algorithm for assigning people to meals
 *
 * Fair rotation prioritizes:
 * 1. Fewer assignments (more fair distribution)
 * 2. Longer time since last assignment
 * 3. Alphabetically (for determinism)
 */

import {
  Person,
  Meal,
  Assignment,
  PersonType,
  Role,
  Schedule,
  createAssignment,
} from '../models/index';

export class AssignmentEngine {
  private people: Person[];
  private schedule: Schedule;
  private assignmentCount: Map<Person, number>;
  private lastAssignmentTime: Map<Person, number>;

  constructor(people: Person[]) {
    this.people = [...people];
    this.schedule = new Schedule();
    this.assignmentCount = new Map();
    this.lastAssignmentTime = new Map();

    // Initialize tracking for each person
    for (const person of this.people) {
      this.assignmentCount.set(person, 0);
      this.lastAssignmentTime.set(person, 0);
    }
  }

  /**
   * Generate assignments for all meals using fair rotation
   */
  generateAssignments(meals: Meal[]): Schedule {
    this.schedule.clear();

    let timeCounter = 0;

    for (const meal of meals) {
      // Assign cooks
      this.assignRole(meal, Role.COOKING, timeCounter);
      timeCounter++;

      // Assign cleaners
      this.assignRole(meal, Role.CLEANING, timeCounter);
      timeCounter++;
    }

    return this.schedule;
  }

  /**
   * Assign people for a specific meal and role
   */
  private assignRole(meal: Meal, role: Role, timeCounter: number): void {
    const requirement = role === Role.COOKING
      ? meal.cookingRequirement
      : meal.cleaningRequirement;

    // Assign leaders
    const assignedLeiter = this.selectPeople(PersonType.LEITER, requirement.leiter, meal, role, timeCounter);
    for (const person of assignedLeiter) {
      this.schedule.addAssignment(createAssignment(person, meal, role));
      this.updateTracking(person, timeCounter);
    }

    // Assign participants
    const assignedTeilnehmer = this.selectPeople(PersonType.TEILNEHMER, requirement.kinder, meal, role, timeCounter);
    for (const person of assignedTeilnehmer) {
      this.schedule.addAssignment(createAssignment(person, meal, role));
      this.updateTracking(person, timeCounter);
    }
  }

  /**
   * Select the best people for a role based on fair rotation
   * Prioritizes:
   * 1. People with fewer assignments
   * 2. People assigned longer ago
   * 3. Alphabetically for determinism
   */
  private selectPeople(
    type: PersonType,
    count: number,
    meal: Meal,
    role: Role,
    timeCounter: number
  ): Person[] {
    // Filter people of the required type
    const availablePeople = this.people.filter(p => p.type === type);

    if (availablePeople.length === 0) {
      return [];
    }

    // Sort by fair rotation criteria
    const sorted = availablePeople.sort((a, b) => {
      const countA = this.assignmentCount.get(a) || 0;
      const countB = this.assignmentCount.get(b) || 0;

      // 1. Fewer assignments is better
      if (countA !== countB) {
        return countA - countB;
      }

      // 2. Longer time since last assignment is better (lower time = better)
      const timeA = this.lastAssignmentTime.get(a) || 0;
      const timeB = this.lastAssignmentTime.get(b) || 0;

      if (timeA !== timeB) {
        return timeA - timeB;
      }

      // 3. Alphabetical for determinism
      return a.name.localeCompare(b.name);
    });

    // Select top N people
    return sorted.slice(0, Math.min(count, sorted.length));
  }

  /**
   * Update tracking information for a person
   */
  private updateTracking(person: Person, timeCounter: number): void {
    const current = this.assignmentCount.get(person) || 0;
    this.assignmentCount.set(person, current + 1);
    this.lastAssignmentTime.set(person, timeCounter);
  }

  /**
   * Get assignment statistics (mainly for display purposes)
   */
  getAssignmentStats(): Map<Person, number> {
    return new Map(this.assignmentCount);
  }

  /**
   * Get schedule
   */
  getSchedule(): Schedule {
    return this.schedule;
  }
}
