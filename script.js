const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const highscoreBody = document.querySelector("#highscore-body");
const wpmDisplay = document.querySelector(".wpm");
const mistakeDisplay = document.querySelector(".mistakes");
let previousText = "";

const otherText = [
    "Do you like my sword sword, sword my diamond sword sword.",
    "Once I was a little girl.",
    "=^_^=",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "What the sigma is going on here?"
];

let mistakes = 0;
let timerStart = false;
let interval;
let highscores = JSON.parse(localStorage.getItem("highscores"));

// Match the text entered with the provided text on the page:

function spellCheck(interval) {
    let textEntered = testArea.value.trim()
    let originTextMatch = document.querySelector("#origin-text p").innerHTML.trim()

    let [minutes, seconds, hundredths] = theTimer.innerHTML.split(":").map(Number);
    let wordsPerMin = (textEntered.length / 5) / (seconds / 60);
    wpmDisplay.textContent = `WPM: ${Math.round(wordsPerMin)}`;
    if (textEntered === originTextMatch) {
        testWrapper.style.borderColor = "green";
        if(timerStart === false) return;
        //Stop Timer
        clearInterval(interval);
        testArea.disabled = true;
        updateHighscores();
    } 

    else if(textEntered.split("").length !== originTextMatch.split("").length && originTextMatch.startsWith(textEntered)) {
        testWrapper.style.borderColor = "blue";
    }

    else if(textEntered.split("").length !== originTextMatch.split("").length && !textEntered.startsWith(originTextMatch)) {
        testWrapper.style.borderColor = "#c7511a";
        mistakeCounter(textEntered, originTextMatch);
    } 

    else {
        testWrapper.style.borderColor = "red";
        mistakeCounter(textEntered, originTextMatch);
    }
}

// Start the timer:
function startTimer() {
    if(timerStart === true) return;

    timerStart = true;
    let [minutes, seconds, hundredths] = [0, 0, 0];

    // Run a standard minute/second/hundredths timer:
    interval = setInterval(() => {
        hundredths++;
        if (hundredths === 100) {
            hundredths = 0;
            seconds++;
        }
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        // Add leading zero to numbers 9 or below (purely for aesthetics):
        // If number is less than 10, add a "0" in front of it. Otherwise, just use original number. 
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;
        let h = hundredths < 10 ? "0" + hundredths : hundredths;

        theTimer.innerHTML = `${m}:${s}:${h}`;
    }, 10); // 10 milliseconds = 1/100th of a second

}

// Reset everything:
function resetTest(interval) {
    clearInterval(interval);
    timerStart = false;
    testArea.disabled = false;
    theTimer.innerHTML = "00:00:00";
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
    mistakes = 0;
    mistakeDisplay.textContent = `Mistakes: ${mistakes}`;
    wpmDisplay.textContent = `WPM: 0`;
    loadRandomText();
    previousText = "";
}

// Keep track of top 3 highscores and display them in the highscore table:
function updateHighscores() {
    let score = theTimer.innerHTML;
    
    if (highscores === null) {
        highscores = [score];
    } else {
        highscores.push(score);
        highscores.sort();
        if (highscores.length > 3) {
            highscores.pop();
        }
    }

    localStorage.setItem("highscores", JSON.stringify(highscores));
    displayHighscores();
}

function displayHighscores() {
    highscoreBody.innerHTML = "";
    if (highscores !== null) {
        highscores.forEach((score, index) => {
            let row = document.createElement("tr");
            let rank = document.createElement("td");
            let time = document.createElement("td");

            rank.textContent = index + 1;
            time.textContent = score;

            row.appendChild(rank);
            row.appendChild(time);
            highscoreBody.appendChild(row);
        });
    }
}

function loadRandomText() {
    const randomIndex = Math.floor(Math.random() * otherText.length);
    document.querySelector("#origin-text p").innerHTML = otherText[randomIndex];
}

function mistakeCounter(textEntered, originTextMatch) {
    if(event.key === "Backspace") return;
    if (textEntered.length > previousText.length && !originTextMatch.startsWith(textEntered)) {
        mistakes++;
        mistakeDisplay.textContent = `Mistakes: ${mistakes}`;
    }

    previousText = textEntered;
}

// Event listeners for keyboard input and the reset button:
addEventListener("keypress", startTimer);
addEventListener("keyup", () => spellCheck(interval));
resetButton.addEventListener("click", () => resetTest(interval));
window.addEventListener("DOMContentLoaded", displayHighscores);