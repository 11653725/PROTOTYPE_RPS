const insults = [
    "Je to tvůj nejlepší tah, chumpe?",
    "Viděl jsem gobliny bojovat lépe než ty!",
    "Jsi jen discount Batman.",
    "Dokonce i vaši otroci se smějí vašim dovednostem.",
    "Snaž se nezakopnout o svůj vlastní meč.",
    "Je 'loser' tvé pravé jméno?",
    "Tomu říkáš zbraň?",
    "Pojď more úder!",
    "Bojuješ jako rozmočená bageta.",
    "Tvůj vztek se projevuje, slabochu!",
    "Jsi mýtická bytost? Ne, jsi pokročilý tutoriál.",
    "Máš víc zpoždění než český vlak v zimě.",
    "Tvoje démonická aura smrdí jako neoptimalizovaný JavaScript.",
    "Víš proč hrajeme kámen, nůžky, papír? Protože je mi tě líto…",
    "Tvé 'pradávné síly', jsou jenom převlečené RNG.",
    "Každý tvůj tah je jako volba prezidenta, pokaždé špatně.",
    "Tvá hrozba je jako papír v dešti, rozpadne se při prvním tlaku.",
    "Přijímám tvou výzvu… a tvůj komplex méněcennosti.",
    "Viděl jsem zkažené jogurty s víc autoritou než ty.",
    "Jsi noční můra? Maximálně noční vtip.",
    "Tvoje aura ničí realitu? Ne, tvoje přítomnost ničí atmosféru.",
    "Smrdíš.",
    "Ani peklo už ti nezvedá telefony.",
    "Snažíš se být nonchalant, ale působíš jak edgelord na třídním srazu.",
    "Ty jsi pradávná hrozba? Ne, jsi bug z betaverze existence."
];

// The rules: who beats what
const beats = {
    rock:     ["scissors", "fire", "lightning", "sponge", "human"],
    paper:    ["rock", "water", "lightning", "gun", "tree"],
    scissors: ["paper", "sponge", "tree", "air", "human"],
    fire:     ["scissors", "paper", "tree", "sponge", "lightning"],
    air:      ["fire", "gun", "paper", "rock", "tree"],
    water:    ["fire", "rock", "gun", "air", "lightning"],
    sponge:   ["water", "scissors", "air", "tree", "human"],
    tree:     ["rock", "water", "air", "lightning", "human"],
    lightning:["scissors", "fire", "gun", "sponge", "paper"],
    gun:      ["rock", "fire", "scissors", "water", "human"],
    human:    ["paper", "sponge", "water", "gun", "air"],
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
