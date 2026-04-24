class PlanetWorld {
    constructor() {
        this.score = 0;
        this.gameOver = false;
        this.buildings = { 'dum': 0, 'tovarna': 0, 'skola': 0, 'obchod': 0 };
        
        // Nastavení cen a limitů pro vítězství
        this.prices = { 'dum': 20, 'tovarna': 50, 'skola': 40, 'obchod': 30 };
        this.limits = { 'dum': 10, 'tovarna': 4, 'skola': 2, 'obchod': 3 };

        this.asteroids = [
            { id: 1, name: "Aster-Alpha", mass: 40 },
            { id: 2, name: "Aster-Beta", mass: 30 }
        ];
    }

    execute(command, args) {
        if (this.gameOver && command !== 'cls') {
            return "SYSTÉM UZAMČEN: Mise úspěšně dokončena. Civilizace vzkvétá.";
        }

        switch (command) {
            case 'help':
                return `--- NÁPOVĚDA ---\n` +
                       `- scan: Najde planetky.\n` +
                       `- pull [id]: Přitáhne planetku pro zisk energie.\n` +
                       `- build [typ]: Postaví budovu (dum, tovarna, skola, obchod).\n` +
                       `- status: Zobrazí stav energie a limity.\n` +
                       `- cls: Vyčistí konzoli.`;

            case 'status':
                return `ENERGIE: ${this.score}\n` +
                       `BUDOVY: Domy ${this.buildings.dum}/10, Továrny ${this.buildings.tovarna}/4, Školy ${this.buildings.skola}/2, Obchody ${this.buildings.obchod}/3`;

            case 'scan':
                if (this.asteroids.length === 0) return "Žádné objekty v dosahu.";
                return "Detekováno:\n" + this.asteroids.map(a => `ID ${a.id}: ${a.name} (${a.mass} energie)`).join("\n");

            case 'pull':
                const id = parseInt(args[0]);
                const idx = this.asteroids.findIndex(a => a.id === id);
                if (idx !== -1) {
                    const energy = this.asteroids[idx].mass;
                    this.score += energy;
                    this.asteroids.splice(idx, 1);
                    this.updateUI();
                    return `ÚSPĚCH: Planetka pohlcena. Získáno ${energy} energie.`;
                }
                return "CHYBA: Neplatné ID planetky.";

            case 'build':
                const type = args[0];
                if (this.prices[type]) {
                    if (this.buildings[type] >= this.limits[type]) {
                        return `STOP: Limit pro '${type}' byl dosažen (${this.limits[type]}).`;
                    }
                    if (this.score >= this.prices[type]) {
                        this.score -= this.prices[type];
                        this.buildings[type]++;
                        this.updateUI();
                        
                        if (this.checkWinCondition()) {
                            this.gameOver = true;
                            return `VŠECHNY BUDOVY POSTAVENY!\n\n************************\n    VYHRÁL JSI!\n************************`;
                        }
                        return `STAVBA: ${type} dokončen (${this.buildings[type]}/${this.limits[type]}).`;
                    }
                    return `CHYBA: Málo energie! Potřebuješ ${this.prices[type]}.`;
                }
                return "CHYBA: Neznámý typ budovy.";

            default: return null;
        }
    }

    checkWinCondition() {
        return this.buildings.dum === this.limits.dum && 
               this.buildings.tovarna === this.limits.tovarna && 
               this.buildings.skola === this.limits.skola && 
               this.buildings.obchod === this.limits.obchod;
    }

    updateUI() {
        document.getElementById('ui-energy').innerText = this.score;
        const total = Object.values(this.buildings).reduce((a, b) => a + b, 0);
        document.getElementById('ui-buildings').innerText = total;
        
        const cityDiv = document.getElementById('city-layout');
        let icons = "";
        const iconMap = { 'dum': '🏠', 'tovarna': '🏭', 'skola': '🏫', 'obchod': '🛒' };
        for (let type in this.buildings) {
            icons += iconMap[type].repeat(this.buildings[type]);
        }
        cityDiv.innerHTML = icons;
    }
}
