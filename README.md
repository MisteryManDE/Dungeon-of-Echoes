		Dungeon of Echoes - Update-Hinweise v2.1.4
============================================

Hallo Abenteurer,

dieses Update konzentriert sich auf die Behebung von Fehlern, die Vervollständigung unfertiger Spielinhalte und eine umfassende Code-Bereinigung, um die Stabilität und zukünftige Erweiterbarkeit des Spiels zu verbessern.

**Fehlerbehebungen (Bug Fixes):**
-------------------------------
*   **Tavernenspiel:** Ein kritischer Fehler wurde behoben, bei dem die Pfeiltasten im Trinkspiel nicht korrekt angezeigt wurden. Das Minispiel ist nun vollständig spielbar.
*   **Kampflogik:** Berechnungen für kritische Treffer und Ausweichen wurden korrigiert, um passive Boni aus dem Talentsystem nun korrekt zu berücksichtigen.

**Neue Inhalte & Features:**
---------------------------
*   **Talentbäume vervollständigt:** Die Platzhalter für die Schurken- und Magier-Talentbäume wurden durch einzigartige, voll funktionsfähige Talente ersetzt, die neue passive Boni und Fähigkeiten freischalten.
*   **Handwerkssystem erweitert:** Dem Handwerkssystem wurden zahlreiche neue Rezepte für Waffen, Rüstungen und Tränke hinzugefügt, um es nützlicher und interessanter zu machen.

**Verbesserungen & Code-Qualität:**
-----------------------------------
*   **Code-Struktur verbessert:** Redundante und ungenutzte Skript-Dateien (im ehemaligen Ordner 'js/core/') wurden entfernt und ihre Funktionalität in die Haupt-Skripte integriert. Dies reduziert Fehlerquellen und verbessert die Wartbarkeit.
*   **Konfiguration vereinheitlicht:** Alle Spielkonfigurationen wurden in einer einzigen Datei (`js/config.js`) zusammengefasst, um Inkonsistenzen zu beseitigen. Die maximale Stufe wurde in diesem Zuge auf 30 angehoben.
*   **Event-System verbessert:** Das System zur Event-Verwaltung wurde auf eine robustere Version aktualisiert.

Viel Spaß bei euren Abenteuern in den Dungeons!







# Dungeon of Echoes

Ein textbasiertes RPG-Browserspiel mit Dungeon-Erkundung, Kampfsystem und Minispielen.

## Version
1.1.2

## Beschreibung

Dungeon of Echoes ist ein textbasiertes RPG, das vollständig im Browser läuft. Das Spiel bietet:

- Drei spielbare Klassen: Krieger, Schurke und Magier
- Dungeons mit zufälligen Begegnungen und Ereignissen
- Umfangreiches Kampfsystem mit Fähigkeiten und Statuseffekten
- Inventarsystem mit verschiedenen Gegenstandstypen
- Quest-System mit Haupt- und Nebenquests
- Tavernen-Minispiel (Rhythmus-basiertes Trinkspiel)
- Talentbaum für Charakterentwicklung
- Speichern und Laden von Spielständen

## Spielstart

1. Öffne die `index.html` in einem modernen Webbrowser
2. Wähle "Neues Spiel" und erstelle deinen Charakter
3. Folge der Einführung und beginne dein Abenteuer

## Steuerung

- Klicke auf die Aktionsschaltflächen, um Aktionen auszuführen
- Klicke auf Gegenstände im Inventar, um sie zu verwenden oder auszurüsten
- Im Tavernenspiel:
  - Drücke die angezeigten Pfeiltasten (↑ ↓ ← →), um zu trinken
  - Drücke die Leertaste für "Prost!" (verlangsamt den Zwerg)

## Spielmechaniken

### Klassen

- **Krieger**: Hohe Stärke und Verteidigung, spezialisiert auf Nahkampf
- **Schurke**: Hohe Geschwindigkeit, spezialisiert auf kritische Treffer und Ausweichen
- **Magier**: Hohe magische Kraft, spezialisiert auf Zauber und Statuseffekte

### Kampfsystem

- Rundenbasierte Kämpfe gegen verschiedene Gegner
- Verwende Angriffe, Fähigkeiten und Gegenstände
- Statuseffekte wie Gift, Feuer, Eis und Betäubung
- Möglichkeit zur Flucht aus Kämpfen

### Gegenstände

- Verschiedene Gegenstandstypen: Waffen, Rüstungen, Tränke, etc.
- Stapelbare Verbrauchsgegenstände
- Verschiedene Seltenheitsstufen mit unterschiedlichen Attributen

### Dungeons

- Verschiedene Dungeons mit unterschiedlichen Schwierigkeitsgraden
- Zufällige Begegnungen: Kämpfe, Schätze, Fallen und spezielle Ereignisse
- Bosskämpfe am Ende jedes Dungeons

### Tavernenspiel

- Rhythmus-basiertes Minispiel gegen Zwerge
- Drei Schwierigkeitsstufen mit unterschiedlichen Gegnern
- Belohnungen für Siege und Konsequenzen bei Niederlagen

### Talentbaum

- Klassenspezifische Talente zur Charakteranpassung
- Freischaltbare Fähigkeiten und passive Boni
- Talentpunkte durch Levelaufstiege

## Dateien und Module

- `index.html`: Hauptdatei des Spiels
- `css/style.css`: Stylesheet für das Spiel
- `js/`: JavaScript-Dateien
  - `config.js`: Konfigurationseinstellungen
  - `utils.js`: Hilfsfunktionen
  - `eventSystem.js`: Event-System
  - `gameEngine.js`: Hauptspiellogik
  - `entities/`: Entitäten (Spieler, Gegner, Gegenstände)
  - `data/`: Spieldaten (Gegenstände, Gegner, Dungeons, etc.)
  - `ui/`: Benutzeroberfläche
  - `systems/`: Spielsysteme (Kampf, Inventar, Quests, etc.)
  - `minigames/`: Minispiele (Tavernenspiel)

## Roadmap

### Implementierte Features
- Grundlegendes Kampfsystem
- Inventar- und Ausrüstungssystem
- Dungeon-Erkundung
- Tavernen-Minispiel
- Speichern und Laden
- Talentbaum

### Geplante Features
- Weitere Klassen und Fähigkeiten
- Crafting-System
- Mehr Dungeons und Bosse
- Begleiter-System
- Weitere Minispiele
- Achievements
- Multiplayer-Funktionen

## Autor
Dungeon of Echoes Team

## Lizenz
Alle Rechte vorbehalten



