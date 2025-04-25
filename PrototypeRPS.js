const insults = [
    { text: "Je to tvůj nejlepší tah, chumpe?", rage: 3, response: "Povolám si na tebe Honzu Stříbrnouruku z Nočního Města, ty corpo." },
    { text: "Viděl jsem gobliny bojovat lépe než ty!", rage: 1, response: "Tak to počkej, zajíci..." },
    { text: "Jsi jen discount Batman.", rage: 5, response: "A ty budeš můj Robin, vole." },
    { text: "Dokonce i vaši otroci se smějí vašim dovednostem.", rage: 5, response: "lil vro žije v 1800s" },
    { text: "Snaž se nezakopnout o svůj vlastní meč.", rage: 3, response: "Já vím, že je velký, ale až tak jo." },
    { text: "Je 'loser' tvé pravé jméno?", rage: 1, response: "S lepší úrážkou by přišla i moje 100 let stará babička." },
    { text: "Tomu říkáš zbraň?", rage: 1, response: "To si ještě nic neviděl." },
    { text: "Pojď more úder!", rage: 5, response: "ok bro..." },
    { text: "Bojuješ jako rozmočená bageta.", rage: 3, response: "Tak teď už jsi jenom otravný." },
    { text: "Tvůj vztek se projevuje, slabochu!", rage: 5, response: "Už jenom, že to slyším od tebe tak mě to naštvává... ČÍM DÁL VÍC!" },
    { text: "Jsi mýtická bytost? Ne, jsi pokročilý tutoriál.", rage: 5, response: "..." },
    { text: "Máš víc zpoždění než český vlak v zimě.", rage: 5, response: "Tak tohle si beru osobně..." },
    { text: "Tvoje démonická aura smrdí jako neoptimalizovaný JavaScript.", rage: 1, response: "JavaScript? To je úroveň pekla ne??" },
    { text: "Víš proč hrajeme kámen, nůžky, papír? Protože je mi tě líto…", rage: 5, response: "TAK A DOST!" },
    { text: "Tvé 'pradávné síly', jsou jenom převlečené RNG.", rage: 5, response: "HEJ, MOJI DEVELOPEŘI SI NA MĚ DÁVALI ZÁLEŽET!" },
    { text: "Každý tvůj tah je jako volba prezidenta, pokaždé špatně.", rage: 3, response: "To spíš vypovídá o vaší společnosti..." },
    { text: "Tvá hrozba je jako papír v dešti, rozpadne se při prvním tlaku.", rage: 1, response: "U mě se na hustotu ptát nemusíš." },
    { text: "Přijímám tvou výzvu… a tvůj komplex méněcennosti.", rage: 5, response: "Nikdy jsem neměl velké ego, ale TEĎ SI MI ZKAZIL I TEN ZBYTEK CO JSEM MĚL!" },
    { text: "Viděl jsem zkažené jogurty s víc autoritou než ty.", rage: 3, response: "Hej, víš že mě máš porazit, né mi dělat špatně od žaludku." },
    { text: "Jsi noční můra? Maximálně noční vtip.", rage: 1, response: "Wow..." },
    { text: "Tvoje aura ničí realitu? Ne, tvoje přítomnost ničí atmosféru.", rage: 3, response: "Hej, lidi mi říkají, že jsem společenský!" },
    { text: "Smrdíš.", rage: 10, response: "nemám slov..." },
    { text: "Ani peklo už ti nezvedá telefony.", rage: 1, response: "Nepotřebuju... já to tam dole vedu." },
    { text: "Snažíš se být nonchalant, ale působíš jak edgelord na třídním srazu.", rage: 3, response: "Z tvého slangu mě bolí hlava." },
    { text: "Ty jsi pradávná hrozba? Ne, jsi bug z betaverze existence.", rage: 1, response: "Já jsem nad existencí!" }
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
let lastInsultIndex = -1;
let round = 1;
const maxRounds = 10;
let gameEnded = false;
let disabledBtn = null;

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

// Taunt button logic
document.getElementById('taunt-btn').onclick = function() {
    if (gameEnded) return;
        let newIndex;
    do {
        newIndex = Math.floor(Math.random() * insults.length);
    } while (newIndex === lastInsultIndex && insults.length > 1);

    lastInsultIndex = newIndex;
    const selected = insults[newIndex];

    document.getElementById('insult-text').textContent = selected.text;
    document.getElementById('boss-response').textContent = selected.response;
    rage = Math.min(rage + selected.rage, 50);
    document.getElementById('rage-value').textContent = rage;
    document.getElementById('boss-action').textContent = `Boss rage +${selected.rage}!`;
};

document.querySelectorAll('.sign-btn').forEach(btn => {
    btn.onclick = () => {
        if (gameEnded || btn.disabled) return;

        // If a sign or taunt was disabled by magic, re-enable them now
        if (disabledBtn) {
            disabledBtn.disabled = false;
            disabledBtn = null;
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
