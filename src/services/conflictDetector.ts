/**
 * Conflict Detector Service
 * Detects and reports conflicts when staffing requirements are not met
 *
 * With flexible allocation (Approach A):
 * - Leiter can fill Teilnehmer slots when Teilnehmer are insufficient
 * - Still warns if requirements cannot be met even with flexible allocation
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
   *
   * With flexible allocation:
   * - If Leiter < required: WARN (Leiter can't fill Leiter slots with Teilnehmer)
   * - If (Teilnehmer + Leiter-filling-Teilnehmer-slots) < required: WARN
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
   * Accounts for Leiter filling Teilnehmer slots
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

    // Count by type
    const leiterAssignments = assignments.filter(a => a.person.type === PersonType.LEITER);
    const teilnehmerAssignments = assignments.filter(a => a.person.type === PersonType.TEILNEHMER);

    const leiterCount = leiterAssignments.length;
    const teilnehmerCount = teilnehmerAssignments.length;

    // With flexible allocation, we need to determine how many Leiter are filling Teilnehmer slots
    // Strategy: Count "excess" Leiter as those filling Teilnehmer slots
    const leiterFillingTeilnehmerSlots = Math.max(0, leiterCount - requirement.leiter);
    const leiterInLeitersSlots = leiterCount - leiterFillingTeilnehmerSlots;
    const effectiveTeilnehmerCount = teilnehmerCount + leiterFillingTeilnehmerSlots;

    const roleDisplay = getRoleDisplay(role);

    // Check 1: Warn if Leiter requirement not met
    // (Leiter can't substitute for Leiter slots)
    if (leiterInLeitersSlots < requirement.leiter) {
      const deficit = requirement.leiter - leiterInLeitersSlots;
      warnings.push(
        `⚠️ ${mealIdentifier(meal)} - ${roleDisplay}: ${deficit} Leiter fehlen (benötigt ${requirement.leiter})`
      );
    }

    // Check 2: Warn if Teilnehmer requirement not met
    // (even counting Leiter filling Teilnehmer slots)
    if (effectiveTeilnehmerCount < requirement.kinder) {
      const deficit = requirement.kinder - effectiveTeilnehmerCount;
      warnings.push(
        `⚠️ ${mealIdentifier(meal)} - ${roleDisplay}: ${deficit} Teilnehmer fehlen (benötigt ${requirement.kinder})`
      );
    }
  }
}
