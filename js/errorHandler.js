/**
 * Error-Handler-Modul für Dungeon of Echoes
 * Verwaltet die Fehlerbehandlung im Spiel
 * Version: 2.0.2
 */

const ErrorHandler = {
    /**
     * Initialisiert den Error-Handler
     */
    init: function() {
        // Globalen Error-Handler hinzufügen
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleError(error || new Error(message), source, lineno);
            return true; // Verhindert die Standard-Fehlerbehandlung des Browsers
        };
        
        // Unhandled Promise Rejection Handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Promise Rejection', 0);
        });
        
        console.log('Error-Handler initialisiert.');
    },
    
    /**
     * Behandelt einen Fehler
     * @param {Error} error - Der aufgetretene Fehler
     * @param {string} source - Die Quelle des Fehlers
     * @param {number} line - Die Zeilennummer
     */
    handleError: function(error, source, line) {
        // Fehler in der Konsole protokollieren
        console.error('Fehler aufgetreten:', error, 'in', source, 'Zeile', line);
        
        // Fehler im Spiel anzeigen, wenn möglich
        try {
            if (GameUI && typeof GameUI.addMessage === 'function') {
                GameUI.addMessage('Ein Fehler ist aufgetreten. Bitte lade die Seite neu.', 'danger');
            }
        } catch (e) {
            // Fallback, wenn GameUI nicht verfügbar ist
            this.showErrorMessage(error);
        }
        
        // Fehler an den Server senden (falls implementiert)
        this.logErrorToServer(error, source, line);
    },
    
    /**
     * Zeigt eine Fehlermeldung an, wenn GameUI nicht verfügbar ist
     * @param {Error} error - Der aufgetretene Fehler
     */
    showErrorMessage: function(error) {
        // Prüfen, ob bereits eine Fehlermeldung angezeigt wird
        if (document.getElementById('error-message-container')) return;
        
        // Container für die Fehlermeldung erstellen
        const container = document.createElement('div');
        container.id = 'error-message-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.backgroundColor = '#f44336';
        container.style.color = 'white';
        container.style.padding = '15px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        container.style.zIndex = '9999';
        container.style.maxWidth = '80%';
        
        // Fehlermeldung hinzufügen
        container.innerHTML = `
            <h3 style="margin-top: 0;">Fehler aufgetreten</h3>
            <p>${error.message || 'Unbekannter Fehler'}</p>
            <button onclick="location.reload()" style="background: white; color: #f44336; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Seite neu laden</button>
        `;
        
        // Container zum Body hinzufügen
        document.body.appendChild(container);
    },
    
    /**
     * Sendet einen Fehler an den Server (Dummy-Implementierung)
     * @param {Error} error - Der aufgetretene Fehler
     * @param {string} source - Die Quelle des Fehlers
     * @param {number} line - Die Zeilennummer
     */
    logErrorToServer: function(error, source, line) {
        // In einer realen Implementierung würde hier ein AJAX-Request an den Server gesendet werden
        console.log('Fehler würde an den Server gesendet werden:', {
            message: error.message,
            stack: error.stack,
            source: source,
            line: line,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    },
    
    /**
     * Prüft, ob eine Funktion existiert und führt sie aus, oder verwendet einen Fallback
     * @param {Object} obj - Das Objekt, das die Funktion enthält
     * @param {string} functionName - Der Name der Funktion
     * @param {Array} args - Die Argumente für die Funktion
     * @param {Function} fallback - Die Fallback-Funktion
     * @returns {*} Das Ergebnis der Funktion oder des Fallbacks
     */
    tryExecute: function(obj, functionName, args = [], fallback = null) {
        try {
            if (obj && typeof obj[functionName] === 'function') {
                return obj[functionName](...args);
            }
        } catch (error) {
            console.error(`Fehler beim Ausführen von ${functionName}:`, error);
            this.handleError(error, `tryExecute(${functionName})`, 0);
        }
        
        // Fallback ausführen, wenn vorhanden
        if (typeof fallback === 'function') {
            try {
                return fallback(...args);
            } catch (fallbackError) {
                console.error('Fehler im Fallback:', fallbackError);
            }
        }
        
        return null;
    }
};
