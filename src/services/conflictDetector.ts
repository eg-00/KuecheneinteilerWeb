/**
 * Conflict Detector Service
 * Detects and reports conflicts when staffing requirements are not met
 */

import {
  Meal,
  Schedule,
  Role,
  PersonType,
  getRoleDisplay,
  getPersonTypeName,
  mealIdentifier,
} from '../models/index';

export class ConflictDetector {
  /**
   * Detect conflicts between assignments and requirements
   * Returns array of warning messages in German
   */
  detectConflicts(schedule: Schedule, meals: Meal[]): string[] {
    const warnings: string[] = [];

    for (const meal of meals) {
      // Check cooking requirements
      this.checkRole(schedule, meal, Role.COOKING, warnings);

      // Check cleaning requirements
      this.checkRole(schedule, meal, Role.CLEANING, warnings);
    }

    return warnings;
  }

  /**
   * Check if requirements are met for a specific role
   */
  private checkRole(
    schedule: Schedule,
    meal: Meal,
    role: Role,
    warnings: string[]
  ): void {
    const requirement = role === Role.COOKING
      ? meal.cookingRequirement
      : meal.cleaningRequirement;

    const assignments = schedule.getAssignmentsByMealAndRole(meal, role);

    // Count leaders and participants
    const leiterAssignments = assignments.filter(a => a.person.type === PersonType.LEITER);
    const teilnehmerAssignments = assignments.filter(a => a.person.type === PersonType.TEILNEHMER);

    const leiterCount = leiterAssignments.length;
    const teilnehmerCount = teilnehmerAssignments.length;

    // Check for understaffing
    const roleDisplay = getRoleDisplay(role);

    if (leiterCount < requirement.leiter) {
      warnings.push(
        `⚠️ ${mealIdentifier(meal)} - ${roleDisplay}: Nur ${leiterCount} Leiter zugewiesen (benötigt ${requirement.leiter})`
      );
    }

    if (teilnehmerCount < requirement.kinder) {
      warnings.push(
        `⚠️ ${mealIdentifier(meal)} - ${roleDisplay}: Nur ${teilnehmerCount} Teilnehmer zugewiesen (benötigt ${requirement.kinder})`
      );
    }
  }
}
