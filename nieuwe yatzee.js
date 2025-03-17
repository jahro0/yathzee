// Yahtzee spelcode

// HTML-elementen ophalen
const rollButton = document.getElementById("roll"); // Knop om te rollen
const diceElements = document.querySelectorAll(".dice"); // Dobbelstenen op het scherm
const holdButtons = document.querySelectorAll(".hold"); // Knoppen om dobbelstenen vast te houden
const scoreElement = document.getElementById("score"); // Score weergeven
const finalizeButton = document.getElementById("finalize"); // Knop om score vast te leggen

let dice = [0, 0, 0, 0, 0]; // Opslag voor de vijf dobbelstenen
let hold = [false, false, false, false, false]; // Houdt bij welke dobbelstenen vastgehouden worden
let rollsLeft = 3; // Aantal keer rollen per beurt

// Functie om dobbelstenen te rollen
function rollDice() {
    if (rollsLeft > 0) {
        for (let i = 0; i < dice.length; i++) {
            if (!hold[i]) { // Alleen rollen als de dobbelsteen niet is vastgehouden
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
            diceElements[i].textContent = dice[i]; // Toon de waarde op het scherm
        }
        rollsLeft--; // Verminder het aantal rollen dat over is
        updateScoreboard();
    }
}

// Functie om een dobbelsteen vast te houden
function toggleHold(index) {
    hold[index] = !hold[index]; // Zet vast of ontgrendel een dobbelsteen
    holdButtons[index].classList.toggle("held"); // Visuele indicatie op de knop
    holdButtons[index].style.backgroundColor = hold[index] ? "red" : ""; // Maak knop rood als deze is vastgezet
}

// Functie om de score te berekenen en weer te geven
function updateScoreboard() {
    let counts = Array(6).fill(0); // Array om te tellen hoe vaak elk getal voorkomt
    dice.forEach(value => counts[value - 1]++);

    let maxCount = Math.max(...counts);
    let totalScore = dice.reduce((sum, val) => sum + val, 0);
    let scoreText = `Score: ${totalScore}`;

    if (maxCount === 5) {
        scoreText = "🎉 Yahtzee! 50 punten";
    } else if (maxCount === 4) {
        scoreText = "🔥 Vier dezelfde: " + totalScore + " punten";
    } else if (counts.includes(3) && counts.includes(2)) {
        scoreText = "🏠 Full House: 25 punten";
    } else if (isSmallStraight(counts)) {
        scoreText = "➡️ Kleine straat: 30 punten";
    } else if (isLargeStraight(counts)) {
        scoreText = "⏩ Grote straat: 40 punten";
    } else if (counts.includes(3)) {
        scoreText = "🎲 Drie dezelfde: " + totalScore + " punten";
    } else if (counts.includes(2) && counts.filter(x => x === 2).length === 2) {
        scoreText = "🎭 Twee paar: " + totalScore + " punten";
    } else if (counts.includes(2)) {
        scoreText = "🃏 Één paar: " + totalScore + " punten";
    }

    scoreElement.textContent = scoreText;
}

// Functie om een kleine straat te controleren (vier opeenvolgende cijfers)
function isSmallStraight(counts) {
    return (counts.slice(0, 4).every(val => val > 0) ||
            counts.slice(1, 5).every(val => val > 0) ||
            counts.slice(2, 6).every(val => val > 0));
}

// Functie om een grote straat te controleren (vijf opeenvolgende cijfers)
function isLargeStraight(counts) {
    return (counts.slice(0, 5).every(val => val > 0) ||
            counts.slice(1, 6).every(val => val > 0));
}

// Functie om het spel te resetten na een scorebeurt
function resetGame() {
    rollsLeft = 3;
    hold.fill(false);
    holdButtons.forEach(btn => {
        btn.classList.remove("held");
        btn.style.backgroundColor = "";
    });
    dice.fill(0);
    diceElements.forEach(d => d.textContent = "-");
    scoreElement.textContent = "Score: 0";
}

// Eventlisteners voor de knoppen
rollButton.addEventListener("click", rollDice);
holdButtons.forEach((button, index) => {
    button.addEventListener("click", () => toggleHold(index));
});
finalizeButton.addEventListener("click", updateScoreboard);