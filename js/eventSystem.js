/**
 * EventSystem für Dungeon of Echoes
 * Verwaltet Events und Callbacks
 * Version: 2.0.2
 */

const EventSystem = {
    // Event-Listener
    listeners: {},
    
    /**
     * Registriert einen Event-Listener
     * @param {string} event - Name des Events
     * @param {Function} callback - Callback-Funktion
     */
    on: function(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        
        this.listeners[event].push(callback);
    },
    
    /**
     * Entfernt einen Event-Listener
     * @param {string} event - Name des Events
     * @param {Function} callback - Callback-Funktion
     */
    off: function(event, callback) {
        if (!this.listeners[event]) return;
        
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    },
    
    /**
     * Löst ein Event aus
     * @param {string} event - Name des Events
     * @param {*} data - Daten, die an die Callback-Funktionen übergeben werden
     */
    emit: function(event, data) {
        if (!this.listeners[event]) return;
        
        for (const callback of this.listeners[event]) {
            try {
                callback(data);
            } catch (error) {
                console.error(`Fehler beim Ausführen des Event-Listeners für "${event}":`, error);
            }
        }
    },
    
    /**
     * Entfernt alle Event-Listener
     */
    clear: function() {
        this.listeners = {};
    },
    
    /**
     * Entfernt alle Event-Listener für ein bestimmtes Event
     * @param {string} event - Name des Events
     */
    clearEvent: function(event) {
        if (this.listeners[event]) {
            this.listeners[event] = [];
        }
    }
};
