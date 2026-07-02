const ROWS = 6;
const COLS = 5;

let board = [];
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

let secretWord = "";

const boardElement = document.getElementById("board");
const message = document.getElementById("message");
const newGameBtn = document.getElementById("newGame");

// -------------------------
// Sound Effects
// -------------------------
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function playWin() {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
}

// -------------------------
// Initialize
// -------------------------
createBoard();
startGame();

// -------------------------
// Create Board
// -------------------------
function createBoard() {

    boardElement.innerHTML = "";
    board = [];

    for (let r = 0; r < ROWS; r++) {

        let row = [];

        for (let c = 0; c < COLS; c++) {

            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.row = r;
            tile.dataset.col = c;

            boardElement.appendChild(tile);
            row.push(tile);
        }

        board.push(row);
    }
}

// -------------------------
// Start Game
// -------------------------
function startGame() {

    currentRow = 0;
    currentCol = 0;
    gameOver = false;

    clearBoard();

    secretWord =
        WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();

    message.textContent = "";

    resetKeyboard();

    console.log(secretWord);
}

// -------------------------
// Clear Board
// -------------------------
function clearBoard() {

    board.flat().forEach(tile => {

        tile.textContent = "";
        tile.className = "tile";

    });
}

// -------------------------
// Virtual Keyboard
// -------------------------
document.querySelectorAll(".key").forEach(key => {

    key.addEventListener("click", () => {

        handleKey(key.textContent);

    });

});

// -------------------------
// Physical Keyboard
// -------------------------
document.addEventListener("keydown", e => {

    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (key === "BACKSPACE") {

        handleKey("⌫");

    } else if (key === "ENTER") {

        handleKey("ENTER");

    } else if (/^[A-Z]$/.test(key)) {

        handleKey(key);

    }

});

// -------------------------
// Handle Key
// -------------------------
function handleKey(key) {

    if (gameOver) return;

    // Play click sound
    playClick();

    if (key === "⌫") {

        removeLetter();
        return;

    }

    if (key === "ENTER") {

        submitGuess();
        return;

    }

    addLetter(key);

}

// -------------------------
// Add Letter
// -------------------------
function addLetter(letter) {

    if (currentCol >= COLS) return;

    const tile = board[currentRow][currentCol];

    tile.textContent = letter;
    tile.classList.add("pop");

    currentCol++;

}

// -------------------------
// Remove Letter
// -------------------------
function removeLetter() {

    if (currentCol === 0) return;

    currentCol--;

    board[currentRow][currentCol].textContent = "";

}

// -------------------------
// Submit Guess
// -------------------------
function submitGuess() {

    if (currentCol < COLS) {

        message.textContent = "Not enough letters!";
        shakeRow();
        return;

    }

    let guess = "";

    for (let i = 0; i < COLS; i++) {

        guess += board[currentRow][i].textContent;

    }

    if (!WORDS.includes(guess.toLowerCase())) {

        message.textContent = "Word not found!";
        shakeRow();
        return;

    }

    revealGuess(guess);

}

// -------------------------
// Reveal Guess
// -------------------------
function revealGuess(guess) {

    for (let i = 0; i < COLS; i++) {

        const tile = board[currentRow][i];

        tile.classList.add("flip");

        const letter = guess[i];

        if (letter === secretWord[i]) {

            tile.classList.add("correct");
            colorKey(letter, "correct");

        }

        else if (secretWord.includes(letter)) {

            tile.classList.add("present");
            colorKey(letter, "present");

        }

        else {

            tile.classList.add("absent");
            colorKey(letter, "absent");

        }

    }

    // Win
    if (guess === secretWord) {

        playWin();

        message.textContent = "🎉 You Win!";
        gameOver = true;
        return;

    }

    currentRow++;
    currentCol = 0;

    if (currentRow === ROWS) {

        message.textContent = "Game Over! Word was: " + secretWord;
        gameOver = true;

    }

}

// -------------------------
// Color Keyboard
// -------------------------
function colorKey(letter, color) {

    document.querySelectorAll(".key").forEach(key => {

        if (key.textContent === letter) {

            // Don't downgrade colors
            if (key.classList.contains("correct")) return;

            if (
                key.classList.contains("present") &&
                color === "absent"
            ) return;

            key.classList.remove("correct", "present", "absent");
            key.classList.add(color);

        }

    });

}

// -------------------------
// Reset Keyboard
// -------------------------
function resetKeyboard() {

    document.querySelectorAll(".key").forEach(key => {

        key.classList.remove("correct", "present", "absent");

    });

}

// -------------------------
// Shake Animation
// -------------------------
function shakeRow() {

    for (let i = 0; i < COLS; i++) {

        board[currentRow][i].classList.add("shake");

        setTimeout(() => {

            board[currentRow][i].classList.remove("shake");

        }, 400);

    }

}

// -------------------------
// New Game
// -------------------------
newGameBtn.addEventListener("click", startGame);
