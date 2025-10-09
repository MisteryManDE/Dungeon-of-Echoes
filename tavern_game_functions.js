// Füge diese Funktionen nach der startTavernGame-Funktion in index2.php ein:

static continueTavernGame() {
    const state = this.tavernGameState;
    
    GameUI.clearActions();
    GameUI.addMessage(`=== RUNDE ${state.round} ===`, 'info');
    GameUI.addMessage(`Du hast ${state.playerDrinks}/${state.playerTolerance} Krüge getrunken.`, 'info');
    GameUI.addMessage(`Der Zwerg hat ${state.dwarfDrinks}/${state.dwarfTolerance} Krüge getrunken.`, 'info');
    
    GameUI.addAction('Starkes Bier trinken', () => this.drinkBeer(3));
    GameUI.addAction('Normales Bier trinken', () => this.drinkBeer(2));
    GameUI.addAction('Leichtes Bier trinken', () => this.drinkBeer(1));
    GameUI.addAction('Aufgeben', () => {
        GameUI.addMessage("Du gibst auf. Der Zwerg lacht dich aus!", 'danger');
        GameUI.addMessage("'Haha! Typisch für einen Menschen! Kein Durchhaltevermögen!'", 'npc');
        
        // Zurück zum Cheat-Menü
        GameUI.addAction('Zurück', () => this.showCheats(), 'secondary');
    }, 'danger');
}

static drinkBeer(strength) {
    const state = this.tavernGameState;
    
    // Spieler trinkt
    state.playerDrinks += strength;
    GameUI.addMessage(`Du trinkst ${strength === 3 ? 'starkes' : strength === 2 ? 'normales' : 'leichtes'} Bier.`, 'info');
    
    // Zwerg trinkt
    const dwarfStrength = Math.floor(Math.random() * 3) + 1;
    state.dwarfDrinks += dwarfStrength;
    GameUI.addMessage(`Der Zwerg trinkt ${dwarfStrength === 3 ? 'starkes' : dwarfStrength === 2 ? 'normales' : 'leichtes'} Bier.`, 'npc');
    
    // Runde erhöhen
    state.round++;
    
    // Prüfen, ob jemand seine Toleranz überschritten hat
    if (state.playerDrinks >= state.playerTolerance) {
        if (state.dwarfDrinks >= state.dwarfTolerance) {
            // Unentschieden
            GameUI.addMessage("Ihr beide fallt gleichzeitig unter den Tisch! Unentschieden!", 'info');
            this.endTavernGame("tie");
        } else {
            // Spieler verliert
            GameUI.addMessage("Du kannst nicht mehr und fällst unter den Tisch!", 'danger');
            GameUI.addMessage("'Haha! Niemand kann gegen einen Zwerg im Trinkduell gewinnen!'", 'npc');
            this.endTavernGame("lose");
        }
    } else if (state.dwarfDrinks >= state.dwarfTolerance) {
        // Spieler gewinnt
        GameUI.addMessage("Der Zwerg kann nicht mehr und fällt unter den Tisch!", 'success');
        GameUI.addMessage("'Unmöglich... *hicks*... wie konnte ein Mensch... *hicks*...'", 'npc');
        this.endTavernGame("win");
    } else {
        // Weitermachen
        this.continueTavernGame();
    }
}

static endTavernGame(result) {
    // Belohnungen basierend auf Ergebnis
    if (result === "win") {
        const goldReward = 50 + (this.player.level * 5);
        this.player.gold += goldReward;
        GameUI.addMessage(`Die anderen Zwerge sind beeindruckt und geben dir ${goldReward} Gold!`, 'loot');
        
        // Achievement freischalten
        this.unlockAchievement("Zechpreller", "Gewinne ein Trinkduell gegen einen Zwerg");
        
        // Versteckte Lore
        GameUI.addMessage("Ein alter Zwerg flüstert dir zu: 'In den Tiefen der Kristallhöhle liegt ein verborgener Schatz...'", 'quest');
    } else if (result === "tie") {
        const goldReward = 20;
        this.player.gold += goldReward;
        GameUI.addMessage(`Die Zwerge respektieren deinen Einsatz und geben dir ${goldReward} Gold.`, 'loot');
    } else {
        // Verloren - kleine Strafe
        this.player.hp = Math.max(1, this.player.hp - 10);
        GameUI.addMessage("Du wachst mit Kopfschmerzen auf und hast 10 HP verloren.", 'danger');
    }
    
    GameUI.updateStats();
    
    // Zurück zum Cheat-Menü
    GameUI.addAction('Zurück', () => this.showCheats(), 'secondary');
}
