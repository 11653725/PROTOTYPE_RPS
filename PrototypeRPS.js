const insults = [
    "Is that your best move, shadow chump?",
    "I've seen goblins fight better than you!",
    "You're just a discount Batman.",
    "Even your minions laugh at your skills.",
    "Try not to trip over your own sword.",
    "Is 'loser' your real name?",
    "You call that a weapon?",
    "Come on, swing at me!",
    "You fight like a soggy breadstick.",
    "Your rage is showing, weakling!"
];

// The rules: who beats what
const beats = {
    rock:     ["scissors", "fire", "sponge", "tree", "gun"],
    paper:    ["rock", "water", "sponge", "tree", "lightning"],
    scissors: ["paper", "sponge", "tree", "wind", "water"],
    fire:     ["paper", "tree", "sponge", "wind", "gun"],
    wind:     ["water", "fire", "gun", "lightning", "rock"],
    water:    ["fire", "rock", "gun", "scissors", "tree"],
    sponge:   ["water", "paper", "wind", "gun", "lightning"],
    tree:     ["water", "gun", "lightning", "rock", "scissors"],
    lightning:["water", "fire", "scissors", "rock", "sponge"],
    gun:      ["paper", "scissors", "fire", "wind", "lightning"],
};

const allSigns = Object.keys(beats);

let rage = 0;
let round = 1;
const maxRounds = 10;
let gameEnded = false;
let disabledBtn = null;    // Track the currently disabled sign
let tauntDisabled = false; // Track if taunt is disabled

function randomSign() {
    return allSigns[Math.floor(Math.random() * allSigns.length)];
}

function updateRoundInfo() {
    document.getElementById('round-info').textContent = "Round: " + round;
}

function getWinner(player, boss) {
    if (player === boss) return "draw";
    if (beats[player].includes(boss)) return "player";
    if (beats[boss].includes(player)) return "boss";
    return "draw";
}

function showResult(result, playerSign, bossSign) {
    let resultText = "";
    if (result === "player") {
        resultText = `You win! (${playerSign} beats ${bossSign})`;
    } else if (result === "boss") {
        resultText = `Boss wins! (${bossSign} beats ${playerSign})`;
    } else {
        resultText = `Draw! (${playerSign} vs ${bossSign})`;
    }
    document.getElementById('round-result').textContent = resultText;
}

function endGame() {
    gameEnded = true;
    document.querySelectorAll('.sign-btn').forEach(btn => btn.disabled = true);
    document.getElementById('taunt-btn').disabled = true;
    document.getElementById('round-info').textContent = "Game Over!";
    document.getElementById('boss-action').textContent = "";
}

function bossMagic() {
    let what = Math.random() < 0.5 ? "sign" : "taunt";
    if (what === "sign") {
        const btns = Array.from(document.querySelectorAll('.sign-btn')).filter(btn => !btn.disabled);
        if (btns.length === 0) return;
        const randBtn = btns[Math.floor(Math.random() * btns.length)];
        randBtn.disabled = true;
        disabledBtn = randBtn;
        document.getElementById('boss-action').textContent = `Boss magic! ${randBtn.textContent} disabled!`;
    } else {
        document.getElementById('taunt-btn').disabled = true;
        tauntDisabled = true;
        document.getElementById('boss-action').textContent = "Boss magic! Taunting disabled!";
    }
}

// Taunt button logic
document.getElementById('taunt-btn').onclick = function() {
    if (gameEnded || tauntDisabled) return;
    const insult = insults[Math.floor(Math.random() * insults.length)];
    document.getElementById('insult-text').textContent = insult;
    // Random rage 1-15
    const rageAdd = Math.floor(Math.random() * 15) + 1;
    rage = Math.min(rage + rageAdd, 50);
    document.getElementById('rage-value').textContent = rage;
};

document.querySelectorAll('.sign-btn').forEach(btn => {
    btn.onclick = () => {
        if (gameEnded || btn.disabled) return;

        // If a sign or taunt was disabled by magic, re-enable them now
        if (disabledBtn) {
            disabledBtn.disabled = false;
            disabledBtn = null;
        }
        if (tauntDisabled) {
            document.getElementById('taunt-btn').disabled = false;
            tauntDisabled = false;
        }
        document.getElementById('boss-action').textContent = "";

        const playerSign = btn.dataset.sign;
        const bossSign = randomSign();
        let result = getWinner(playerSign, bossSign);

        // If boss is furious, he cheats
        if (rage >= 50) {
            document.getElementById('boss-action').textContent = "Boss is furious and cheats!";
            document.getElementById('round-result').textContent = "Boss wins by cheating!";
            result = "boss";
        } else {
            showResult(result, playerSign, bossSign);
        }

        round++;
        updateRoundInfo();

        // Every 3rd, 5th, and 8th round, boss uses magic
        if ([3, 5, 8].includes(round)) bossMagic();

        // End game at round 11 (after 10 rounds)
        if (round > maxRounds) {
            endGame();
        }
    };
});

// Initial UI setup
updateRoundInfo();
document.getElementById('rage-value').textContent = rage;
