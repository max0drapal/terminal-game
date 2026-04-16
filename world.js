class CyberWorld {
    constructor() {
        this.nodes = {
            '192.168.1.1': { name: 'Brána', status: 'secured' },
            '10.0.0.5': { name: 'Databáze', status: 'encrypted' }
        };
        this.connectedNode = null;
    }

    // Univerzální metoda pro zpracování příkazů ze vstupu
    execute(cmd, args) {
        switch (cmd) {
            case 'help':
                return "Dostupné příkazy: help, scan, connect [ip], status, cls";
            case 'scan':
                return "Nalezené uzly: " + Object.keys(this.nodes).join(', ');
            case 'status':
                return this.connectedNode 
                    ? `Připojeno k: ${this.nodes[this.connectedNode].name} (IP: ${this.connectedNode})`
                    : "Stav: Offline. Připojte se k uzlu pomocí 'connect'.";
            case 'connect':
                if (this.nodes[args[0]]) {
                    this.connectedNode = args[0];
                    return `Navazování spojení s ${args[0]}... Úspěch.`;
                }
                return "Chyba: Uzel nenalezen.";
            default:
                return null; // Pokud příkaz nepatří světu
        }
    }
}