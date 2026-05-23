/**
 * Assignment Engine Service
 * Implements fair rotation algorithm for assigning people to meals
 *
 * Fair rotation prioritizes:
 * 1. Fewer assignments (more fair distribution)
 * 2. Longer time since last assignment
 * 3. Alphabetically (for determinism)
 *
 * Flexible allocation strategy (Approach A):
 * - Leiter can fill Teilnehmer slots when Teilnehmer are insufficient
 * - This ensures balanced workload across both types
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
  private usedInRound: Set<Person> = new Set();

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
      this.usedInRound.clear();

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
   * Uses flexible allocation: Leiter can fill Teilnehmer slots if needed
   */
  private assignRole(meal: Meal, role: Role, timeCounter: number): void {
    const requirement = role === Role.COOKING
      ? meal.cookingRequirement
      : meal.cleaningRequirement;

    // Step 1: Assign required Leiter (primary)
    const assignedLeiter = this.selectPeopleFromType(
      PersonType.LEITER,
      requirement.leiter,
      timeCounter
    );

    // Step 2: Assign required Teilnehmer (primary)
    const assignedTeilnehmer = this.selectPeopleFromType(
      PersonType.TEILNEHMER,
      requirement.kinder,
      timeCounter
    );

    // Step 3: If Teilnehmer are insufficient, try to fill with unused Leiter
    const teilnehmerShortfall = requirement.kinder - assignedTeilnehmer.length;
    if (teilnehmerShortfall > 0) {
      const availableLeiter = this.people.filter(
        p => p.type === PersonType.LEITER && !this.usedInRound.has(p)
      );

      const leiterToFillTeilnehmerSlots = this.selectFromCandidates(
        availableLeiter,
        teilnehmerShortfall,
        timeCounter
      );

      assignedTeilnehmer.push(...leiterToFillTeilnehmerSlots);
    }

    // Add all assignments to schedule
    for (const person of assignedLeiter) {
      this.schedule.addAssignment(createAssignment(person, meal, role));
      this.updateTracking(person, timeCounter);
      this.usedInRound.add(person);
    }

    for (const person of assignedTeilnehmer) {
      this.schedule.addAssignment(createAssignment(person, meal, role));
      this.updateTracking(person, timeCounter);
      this.usedInRound.add(person);
    }
  }

  /**
   * Select people of a specific type based on fair rotation criteria
   */
  private selectPeopleFromType(
    type: PersonType,
    count: number,
    timeCounter: number
  ): Person[] {
    const availablePeople = this.people.filter(
      p => p.type === type && !this.usedInRound.has(p)
    );

    return this.selectFromCandidates(availablePeople, count, timeCounter);
  }

  /**
   * Select the best people from a candidate list based on fair rotation
   * Prioritizes:
   * 1. People with fewer total assignments
   * 2. People assigned longer ago
   * 3. Alphabetically for determinism
   */
  private selectFromCandidates(
    candidates: Person[],
    count: number,
    timeCounter: number
  ): Person[] {
    if (candidates.length === 0) {
      return [];
    }

    // Sort by fair rotation criteria
    const sorted = candidates.sort((a, b) => {
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
