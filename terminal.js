const world = new PlanetWorld();
const input = document.getElementById('commandInput');
const output = document.getElementById('output');

let history = [];
let historyIndex = -1;

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
            history.push(val);
            historyIndex = -1;
            const [cmd, ...args] = val.toLowerCase().split(' ');
            printToTerminal(`> ${val}`, 'user-line');

            if (cmd === 'cls' || cmd === 'clear') {
                output.innerHTML = '';
            } else {
                const res = world.execute(cmd, args);
                if (res) {
                    const type = res.includes("VYHRÁL") ? "win-line" : "";
                    printToTerminal(res, type);
                } else {
                    printToTerminal("Neznámý příkaz. Zadej 'help'.", "system");
                }
            }
        }
        input.value = '';
        output.scrollTop = output.scrollHeight;
    } 
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
            if (historyIndex === -1) historyIndex = history.length - 1;
            else if (historyIndex > 0) historyIndex--;
            input.value = history[historyIndex];
        }
    } 
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        }
    }
});

function printToTerminal(text, cls = '') {
    const d = document.createElement('div');
    d.className = 'line ' + cls;
    d.innerText = text;
    output.appendChild(d);
}

// Běžící svět: Každých 10 sekund přiletí nová planetka
setInterval(() => {
    if (!world.gameOver) {
        const id = Math.floor(Math.random() * 100);
        world.asteroids.push({ id: id, name: "Aster-" + id, mass: Math.floor(Math.random() * 30) + 20 });
        printToTerminal(`[INFO] Zachycen nový objekt (ID: ${id})`, "system");
    }
}, 10000);
