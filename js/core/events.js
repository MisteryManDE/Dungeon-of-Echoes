/**
 * Event-System für Dungeon of Echoes
 * Ermöglicht die Kommunikation zwischen verschiedenen Modulen
 * Version: 2.0.2
 */

const EventSystem = {
    // Speichert alle registrierten Event-Listener
    listeners: {},
    
    /**
     * Registriert einen Event-Listener
     * @param {string} eventName - Name des Events
     * @param {Function} callback - Callback-Funktion, die aufgerufen wird
     * @param {Object} context - Kontext, in dem die Callback-Funktion ausgeführt wird
     * @returns {Object} Ein Objekt mit einer remove-Methode zum Entfernen des Listeners
     */
    on: function(eventName, callback, context = null) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        
        const listener = { callback, context };
        this.listeners[eventName].push(listener);
        
        // Rückgabe eines Objekts mit einer remove-Methode
        return {
            remove: () => {
                this.off(eventName, callback, context);
            }
        };
    },
    
    /**
     * Entfernt einen Event-Listener
     * @param {string} eventName - Name des Events
     * @param {Function} callback - Die zu entfernende Callback-Funktion
     * @param {Object} context - Der Kontext der Callback-Funktion
     */
    off: function(eventName, callback, context = null) {
        if (!this.listeners[eventName]) return;
        
        this.listeners[eventName] = this.listeners[eventName].filter(listener => {
            return listener.callback !== callback || listener.context !== context;
        });
        
        // Entferne den Event-Namen, wenn keine Listener mehr vorhanden sind
        if (this.listeners[eventName].length === 0) {
            delete this.listeners[eventName];
        }
    },
    
    /**
     * Löst ein Event aus und ruft alle registrierten Listener auf
     * @param {string} eventName - Name des Events
     * @param {...any} args - Argumente, die an die Callback-Funktionen übergeben werden
     */
    emit: function(eventName, ...args) {
        if (!this.listeners[eventName]) return;
        
        // Kopiere die Listener-Liste, um Probleme zu vermeiden, wenn während des Aufrufs Listener entfernt werden
        const listeners = [...this.listeners[eventName]];
        
        for (const listener of listeners) {
            try {
                listener.callback.apply(listener.context, args);
            } catch (error) {
                console.error(`Fehler beim Auslösen des Events '${eventName}':`, error);
            }
        }
    },
    
    /**
     * Entfernt alle Event-Listener
     */
    removeAllListeners: function() {
        this.listeners = {};
    },
    
    /**
     * Entfernt alle Event-Listener für ein bestimmtes Event
     * @param {string} eventName - Name des Events
     */
    removeAllListenersForEvent: function(eventName) {
        if (this.listeners[eventName]) {
            delete this.listeners[eventName];
        }
    },
    
    /**
     * Gibt die Anzahl der Listener für ein bestimmtes Event zurück
     * @param {string} eventName - Name des Events
     * @returns {number} Anzahl der Listener
     */
    listenerCount: function(eventName) {
        return this.listeners[eventName] ? this.listeners[eventName].length : 0;
    },
    
    /**
     * Gibt alle registrierten Event-Namen zurück
     * @returns {Array} Array mit allen Event-Namen
     */
    eventNames: function() {
        return Object.keys(this.listeners);
    }
};
