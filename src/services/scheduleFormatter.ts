/**
 * Schedule Formatter Service
 * Formats schedule for display and export in various formats
 */

import {
  Meal,
  Schedule,
  Role,
  PersonType,
  getRoleEmoji,
  getRoleDisplay,
  getPersonTypeDisplay,
  mealIdentifier,
  getDayOfWeekOrdinal,
  getMealTimeOrdinal,
} from '../models/index';

export class ScheduleFormatter {
  /**
   * Format schedule as plain text (for display and text export)
   */
  formatAsPlainText(schedule: Schedule, meals: Meal[], warnings: string[]): string {
    const lines: string[] = [];

    // Sort meals by day and time
    const sortedMeals = this.sortMeals(meals);

    // Title
    lines.push('═'.repeat(61));
    lines.push('                    KÜCHENEINTEILUNG');
    lines.push('═'.repeat(61));
    lines.push('');

    // Format each meal
    for (const meal of sortedMeals) {
      lines.push(`${mealIdentifier(meal)}:`);

      // Cooking assignments
      const cookingAssignments = schedule.getAssignmentsByMealAndRole(meal, Role.COOKING);
      if (cookingAssignments.length > 0) {
        lines.push(`  ${getRoleEmoji(Role.COOKING)} ${getRoleDisplay(Role.COOKING)}: ${this.formatPersonList(cookingAssignments)}`);
      } else {
        lines.push(`  ${getRoleEmoji(Role.COOKING)} ${getRoleDisplay(Role.COOKING)}: (keine Zuweisungen)`);
      }

      // Cleaning assignments
      const cleaningAssignments = schedule.getAssignmentsByMealAndRole(meal, Role.CLEANING);
      if (cleaningAssignments.length > 0) {
        lines.push(`  ${getRoleEmoji(Role.CLEANING)} ${getRoleDisplay(Role.CLEANING)}: ${this.formatPersonList(cleaningAssignments)}`);
      } else {
        lines.push(`  ${getRoleEmoji(Role.CLEANING)} ${getRoleDisplay(Role.CLEANING)}: (keine Zuweisungen)`);
      }

      lines.push('');
    }

    // Add warnings if any
    if (warnings.length > 0) {
      lines.push('═'.repeat(61));
      lines.push('                      WARNUNGEN');
      lines.push('═'.repeat(61));
      warnings.forEach(warning => {
        lines.push(warning);
      });
    }

    return lines.join('\n');
  }

  /**
   * Format schedule as HTML (for printable version)
   */
  formatAsHTML(schedule: Schedule, meals: Meal[], warnings: string[]): string {
    const sortedMeals = this.sortMeals(meals);
    let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kücheneinteilung</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            color: #333;
        }
        h1 {
            text-align: center;
            border-top: 3px solid #333;
            border-bottom: 3px solid #333;
            padding: 20px 0;
            margin-bottom: 30px;
        }
        .meal-day {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .meal-day h2 {
            font-size: 1.3em;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 2px solid #ccc;
        }
        .meal-time {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .meal-time h3 {
            font-size: 1.1em;
            margin: 10px 0 5px 0;
            color: #555;
        }
        .role {
            margin-left: 20px;
            margin-bottom: 8px;
            font-size: 0.95em;
        }
        .role-label {
            font-weight: bold;
            margin-right: 5px;
        }
        .person {
            display: inline-block;
            margin-right: 3px;
        }
        .warnings {
            margin-top: 40px;
            padding: 20px;
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
        }
        .warnings h2 {
            margin-top: 0;
            color: #856404;
        }
        .warning-item {
            margin: 10px 0;
            color: #856404;
        }
        @media print {
            body {
                margin: 10px;
            }
            .meal-day {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <h1>KÜCHENEINTEILUNG</h1>
`;

    // Group meals by day
    const mealsByDay = new Map<string, any[]>();
    for (const meal of sortedMeals) {
      if (!mealsByDay.has(meal.day)) {
        mealsByDay.set(meal.day, []);
      }
      mealsByDay.get(meal.day)!.push(meal);
    }

    // Format each day
    for (const [day, dayMeals] of mealsByDay) {
      html += `<div class="meal-day">\n<h2>${day}</h2>\n`;

      for (const meal of dayMeals) {
        html += `<div class="meal-time">\n<h3>${meal.time}</h3>\n`;

        // Cooking
        const cookingAssignments = schedule.getAssignmentsByMealAndRole(meal, Role.COOKING);
        html += `<div class="role">
            <span class="role-label">${getRoleEmoji(Role.COOKING)} ${getRoleDisplay(Role.COOKING)}:</span>
            <span>${this.formatPersonListHTML(cookingAssignments)}</span>
        </div>\n`;

        // Cleaning
        const cleaningAssignments = schedule.getAssignmentsByMealAndRole(meal, Role.CLEANING);
        html += `<div class="role">
            <span class="role-label">${getRoleEmoji(Role.CLEANING)} ${getRoleDisplay(Role.CLEANING)}:</span>
            <span>${this.formatPersonListHTML(cleaningAssignments)}</span>
        </div>\n`;

        html += `</div>\n`;
      }

      html += `</div>\n`;
    }

    // Add warnings
    if (warnings.length > 0) {
      html += `<div class="warnings">
        <h2>⚠️ WARNUNGEN</h2>
`;
      warnings.forEach(warning => {
        html += `<div class="warning-item">${this.escapeHtml(warning)}</div>\n`;
      });
      html += `</div>\n`;
    }

    html += `</body>
</html>`;

    return html;
  }

  /**
   * Format schedule as CSV
   * Format: Person, Tag, Tageszeit, Rolle
   */
  formatAsCSV(schedule: Schedule): string {
    const lines: string[] = [];

    // Header
    lines.push('Person,Tag,Tageszeit,Rolle');

    // Data rows
    const assignments = schedule.getAllAssignments();
    for (const assignment of assignments) {
      const person = `"${assignment.person.name} (${getPersonTypeDisplay(assignment.person.type)})"`;
      const day = assignment.meal.day;
      const time = assignment.meal.time;
      const role = getRoleDisplay(assignment.role);

      lines.push(`${person},${day},${time},${role}`);
    }

    return lines.join('\n');
  }

  /**
   * Format schedule as JSON
   */
  formatAsJSON(schedule: Schedule, meals: Meal[], warnings: string[]): object {
    const sortedMeals = this.sortMeals(meals);

    const scheduleData = sortedMeals.map(meal => ({
      tag: meal.day,
      tageszeit: meal.time,
      kochen: schedule.getAssignmentsByMealAndRole(meal, Role.COOKING).map(a => ({
        name: a.person.name,
        typ: a.person.type,
      })),
      spuelen: schedule.getAssignmentsByMealAndRole(meal, Role.CLEANING).map(a => ({
        name: a.person.name,
        typ: a.person.type,
      })),
    }));

    return {
      kuecheneinteilung: scheduleData,
      warnungen: warnings,
      erstellt: new Date().toISOString(),
    };
  }

  /**
   * Sort meals by day and time
   */
  private sortMeals(meals: Meal[]): Meal[] {
    return [...meals].sort((m1, m2) => {
      const dayCompare = getDayOfWeekOrdinal(m1.day) - getDayOfWeekOrdinal(m2.day);
      if (dayCompare !== 0) {
        return dayCompare;
      }
      return getMealTimeOrdinal(m1.time) - getMealTimeOrdinal(m2.time);
    });
  }

  /**
   * Format a list of assignments as comma-separated string
   */
  private formatPersonList(assignments: any[]): string {
    return assignments
      .map(a => `${a.person.name} (${getPersonTypeDisplay(a.person.type)})`)
      .join(', ');
  }

  /**
   * Format a list of assignments as HTML
   */
  private formatPersonListHTML(assignments: any[]): string {
    if (assignments.length === 0) {
      return '<em>(keine Zuweisungen)</em>';
    }
    return assignments
      .map(a => `<span class="person">${a.person.name} (${getPersonTypeDisplay(a.person.type)})</span>`)
      .join(', ');
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}
