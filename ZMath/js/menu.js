/** * ELEMENTOS DO DOM 
 */
const ui = {
    btnStart: document.getElementById("btnStart"),
    btnOptions: document.getElementById("btnOptions"),
    optionsModal: document.getElementById("optionsModal"),
    closeOptions: document.getElementById("closeOptions"),
    
    // Sliders e Labels
    slider: document.getElementById("difficultySlider"),
    diffLabel: document.getElementById("difficultyLabel"),
    diffExample: document.getElementById("difficultyExample"),
    
    // Mix Modals
    checkMix: document.getElementById("checkMix"),
    btnCustomize: document.getElementById("btnCustomizeMix"),
    customizeModal: document.getElementById("customizeModal"),
    closeCustomize: document.getElementById("closeCustomize"),

    // Operações (Arrays e Objetos)
    mainOps: [
        document.getElementById("checkMulti"),
        document.getElementById("checkDiv"),
        document.getElementById("checkPot"),
        document.getElementById("checkRad"),
    ],
    mixOps: {
        multi: document.getElementById("mixMulti"),
        div: document.getElementById("mixDiv"),
        pot: document.getElementById("mixPot"),
        rad: document.getElementById("mixRad"),
    }
};

/** * CONFIGURAÇÕES E DADOS 
 */
const difficultyLevels = ["Muito Fácil", "Fácil", "Normal", "Difícil"];

const examplesTable = {
    soma:  ["3 + 4", "14 + 2", "23 + 17", "43 + 23 + 34"],
    multi: ["2 × 5", "12 × 3", "25 × 4", "15 × 12"],
    div:   ["10 / 2", "20 / 4", "100 / 5", "144 / 12"],
    pot:   ["2²", "5²", "12²", "15²"],
    rad:   ["√4", "√16", "√81", "√144"],
    mix: {
        multiPot: ["2 + 2²", "5² + 10", "10² × 2 + 5", "(5² + 5) × 2"],
        multi:    ["2 + 3", "10 + 5 × 2", "25 × 2 + 50", "(15 + 5) × 10"],
        default:  ["1 + 1 + 1", "10 + 20 + 5", "45 + 55 - 10", "(100 + 50) - 25"]
    }
};

/** * LÓGICA PRINCIPAL 
 */
function updateExample() {
    const diffIdx = parseInt(ui.slider.value);
    let text = "";

    // Atualiza o Label da dificuldade
    ui.diffLabel.innerText = difficultyLevels[diffIdx];

    if (ui.checkMix.checked) {
        // Lógica de Mistura Personalizada
        if (ui.mixOps.multi.checked && ui.mixOps.pot.checked) {
            text = examplesTable.mix.multiPot[diffIdx];
        } else if (ui.mixOps.multi.checked) {
            text = examplesTable.mix.multi[diffIdx];
        } else {
            text = examplesTable.mix.default[diffIdx];
        }
    } else {
        // Lógica de Operações Individuais (Ordem de prioridade)
        if (ui.mainOps[3]?.checked) text = examplesTable.rad[diffIdx];      // Radiciação
        else if (ui.mainOps[2]?.checked) text = examplesTable.pot[diffIdx]; // Potenciação
        else if (ui.mainOps[1]?.checked) text = examplesTable.div[diffIdx]; // Divisão
        else if (ui.mainOps[0]?.checked) text = examplesTable.multi[diffIdx]; // Multiplicação
        else text = examplesTable.soma[diffIdx];
    }

    // Aplica o texto e o efeito visual
    ui.diffExample.innerText = `${text} = ?`;
    applyFeedbackEffect(ui.diffExample);
}

function applyFeedbackEffect(element) {
    element.style.transform = "scale(1.1)";
    element.style.color = "#22d3ee";
    setTimeout(() => {
        element.style.transform = "scale(1)";
        element.style.color = "white";
    }, 100);
}

/** * EVENTOS 
 */

// Navegação e Modais
ui.btnStart.addEventListener("click", () => window.location.href = "game.html");

ui.btnOptions.addEventListener("click", () => ui.optionsModal.classList.remove("hidden"));
ui.closeOptions.addEventListener("click", () => ui.optionsModal.classList.add("hidden"));

ui.btnCustomize.addEventListener("click", () => ui.customizeModal.classList.remove("hidden"));
ui.closeCustomize.addEventListener("click", () => {
    ui.customizeModal.classList.add("hidden");
    updateExample();
});

// Lógica de Bloqueio do Mix
ui.checkMix.addEventListener("change", () => {
    const active = ui.checkMix.checked;
    
    ui.mainOps.forEach((op) => {
        if (op) {
            op.disabled = active;
            op.checked = false; 
            op.parentElement.style.opacity = active ? "0.3" : "1";
        }
    });
    updateExample();
});

// Updates de Interface
ui.slider.addEventListener("input", updateExample);

ui.mainOps.forEach(box => {
    box?.addEventListener("change", updateExample);
});

// Garante que o exemplo esteja correto ao carregar
updateExample();