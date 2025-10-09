/**
 * Hauptinitialisierungsdatei für Dungeon of Echoes
 * Version: 2.0.2
 */

// Warten, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dungeon of Echoes wird initialisiert...');

    // Error-Handler initialisieren
    ErrorHandler.init();

    try {
        // Spiel initialisieren
        GameEngine.init();

        // Startmenü anzeigen
        GameEngine.showStartMenu();

        console.log('Dungeon of Echoes wurde erfolgreich initialisiert!');
    } catch (error) {
        console.error('Fehler bei der Initialisierung des Spiels:', error);
        ErrorHandler.handleError(error, 'main.js', 0);
    }
});
