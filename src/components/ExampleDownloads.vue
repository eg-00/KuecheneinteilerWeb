<template>
  <div class="card card-padding">
    <h3 style="color: #1e3c72; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
      📥 Beispieldateien herunterladen
    </h3>
    
    <p style="color: #64748b; margin-bottom: 24px; line-height: 1.6;">
      Laden Sie die folgenden CSV-Dateien herunter, um die richtige Formatierung zu verstehen.
      Bearbeiten Sie die Dateien dann mit Excel, Calc oder einem Texteditor.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <!-- People CSV Download -->
      <a href="/people_example.csv" download class="btn-primary" style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: auto; padding: 20px; text-decoration: none; justify-content: center;">
        <span style="font-size: 2rem;">👥</span>
        <span>people.csv</span>
        <span style="font-size: 0.85rem; opacity: 0.8;">Personen-Vorlage</span>
      </a>

      <!-- Meals CSV Download -->
      <a href="/meals_example.csv" download class="btn-success" style="display: flex; flex-direction: column; align-items: center; gap: 8px; height: auto; padding: 20px; text-decoration: none; justify-content: center;">
        <span style="font-size: 2rem;">🍳</span>
        <span>meals.csv</span>
        <span style="font-size: 0.85rem; opacity: 0.8;">Mahlzeiten-Vorlage</span>
      </a>
    </div>

    <!-- Preview Section -->
    <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
      <h4 style="color: #1e3c72; margin-bottom: 16px; font-weight: 600;">📋 Formatierungsrichtlinien:</h4>
      
      <div style="display: space-y-4;">
        <!-- People Format -->
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 16px;">
          <p style="color: #1e3c72; font-weight: 600; margin-bottom: 8px;">👥 people.csv:</p>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">
            <strong>Spalten:</strong> Name, Typ
          </p>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">
            <strong>Typ-Werte:</strong> LEITER oder TEILNEHMER
          </p>
          <p style="color: #64748b; font-size: 0.85rem;">
            <strong>Beispiel:</strong><br>
            John Doe,LEITER<br>
            Jane Smith,TEILNEHMER<br>
            Bob Johnson,TEILNEHMER
          </p>
        </div>

        <!-- Meals Format -->
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 16px;">
          <p style="color: #1e3c72; font-weight: 600; margin-bottom: 8px;">🍳 meals.csv:</p>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">
            <strong>Spalten:</strong> Tag, Tageszeit, KöcheLeiter, KöcheTeilnehmer, SpülerLeiter, SpülerTeilnehmer
          </p>
          <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">
            <strong>Tag-Werte:</strong> Montag, Dienstag, Mittwoch, Donnerstag, Freitag<br>
            <strong>Tageszeit-Werte:</strong> Frühstück, Mittag, Abend
          </p>
          <p style="color: #64748b; font-size: 0.85rem;">
            <strong>Beispiel:</strong><br>
            Montag,Frühstück,1,1,1,1<br>
            Montag,Mittag,2,2,1,1<br>
            Dienstag,Abend,1,2,2,1
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed - using direct download links from public folder
</script>
