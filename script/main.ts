let currentInput: string = "";
let operator: string | null = null;
let previousInput: string = "";

const screenElement: HTMLElement | null = document.getElementById("screen");

const MAX_DIGITS = 9; // Limite à 9 chiffres

function appendNumber(number: string): void {
    // Vérifie si la longueur de currentInput est inférieure à 9 avant d'ajouter un nouveau chiffre
    if (currentInput.length < MAX_DIGITS) {
        // Empêche d'ajouter "00" en vérifiant si le dernier chiffre est déjà un "0"
        if (!(currentInput === "0" && number === "0")) {
            currentInput += number;
            updateScreen();
        }
    }
}

function setOperator(op: string): void {
    if (currentInput === "") return;

    if (operator !== null) {
        // Calculer immédiatement si un opérateur est déjà défini
        calculate(); 
    }

    operator = op;
    previousInput = currentInput;
    currentInput = "";
}

function calculate(): void {
    let computation: string | number;
    // Remplacer la virgule par un point pour les calculs
    const prev: number = parseFloat(previousInput.replace(",", "."));
    const current: number = parseFloat(currentInput.replace(",", "."));

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case "+":
            computation = prev + current;
            break;
        case "-":
            computation = prev - current;
            break;
        case "*":
            computation = prev * current;
            break;
        case "/":
            if (current === 0) {
                computation = "Math Error";  
            } else {
                computation = prev / current;
            }
            break;
        default:
            return;
    }

    currentInput = computation.toString();
    operator = null;  
    previousInput = "";  
    updateScreen();
}

function updateScreen(): void {
    if (screenElement) {
        screenElement.textContent = currentInput || "0";
    }
}

// Fonction pour gérer l'ajout de la virgule (séparateur décimal)
function appendComma(): void {
    // Ajoute une virgule seulement si il n'y en a pas déjà
    if (!currentInput.includes(",") && currentInput !== "") {
        currentInput += ",";
        updateScreen();
    }
}

// Fonction pour supprimer un seul caractère de currentInput
function backspace(): void {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1); // Supprime le dernier caractère
    } else {
        currentInput = "0"; // Si l'entrée est vide ou un seul caractère, réinitialiser à "0"
    }
    updateScreen();
}

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        const value = (button as HTMLButtonElement).textContent;

        if (!isNaN(Number(value))) {
            appendNumber(value!);
        } else if (value === "C") {
            currentInput = "";
            previousInput = "";
            operator = null;
            updateScreen();
        } else if (value === "=") {
            calculate();
        } else if (value === ",") { // Vérifie si la virgule est appuyée
            appendComma();
        } else if (value === "←") { // Vérifie si le bouton Backspace est appuyé
            backspace();
        } else {
            setOperator(value!);
        }
    });
});
