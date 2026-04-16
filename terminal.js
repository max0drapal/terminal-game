const world = new CyberWorld();
const input = document.getElementById('commandInput');
const output = document.getElementById('output');

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCommand = input.value.trim();
        const [cmd, ...args] = fullCommand.toLowerCase().split(' ');
        
        // Vytisknout příkaz do konzole
        printToTerminal(`> ${fullCommand}`, 'user-cmd');

        // Zpracování příkazu
        if (cmd === 'cls') {
            output.innerHTML = '';
        } else {
            const response = world.execute(cmd, args);
            if (response) {
                printToTerminal(response);
            } else if (cmd !== '') {
                printToTerminal(`Příkaz '${cmd}' nebyl rozpoznán.`, 'error');
            }
        }

        input.value = '';
        output.scrollTop = output.scrollHeight;
    }
});

function printToTerminal(text, type = '') {
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.textContent = text;
    output.appendChild(line);
}