import { wait } from "./misc";

let currentGame;
let turnIndicator;
let playerBoardUI;
let enemyBoardUI;

function createPlayBoard(board, isPlayer=true) {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    if (isPlayer) {
        boardDiv.classList.add("half-opacity", "disable");
    }

    for(let row = 0; row < 10; row++) {
        for(let col = 0; col < 10; col++) {
            const cell = document.createElement("div");
            boardDiv.appendChild(cell);
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.classList.add("cell");

            // if (isPlayer && board.board[String([row, col])]) {
            //     cell.classList.add("cell-occupied");
            // }
            if (board.board[String([row, col])]) {
                cell.classList.add("cell-occupied");
            }

            cell.addEventListener("click", takeTurn);
        }
    }

    return boardDiv
}

function createTurnIndicator() {
    const turnIndicator = document.createElement("H1");
    turnIndicator.id = "turn-indicator";
    turnIndicator.textContent = "Your turn!";

    return turnIndicator;
}

function takeTurn(e) {
    const cell = e.currentTarget;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    
    const turnResult = currentGame.takeTurn([row, col]);
    
    if (turnResult === 1 || turnResult === 2)
        cell.classList.add("cell-hit", "disable");
    else if (turnResult === 0) 
        cell.classList.add("cell-missed", "disable");
    else
        return;

    if (!currentGame.gameOver)
        //change turn
        changeTurn();
    else
        showWinnerVisualUI();

    // remove this event handler from the cell?
}

async function changeTurn() {
    const whichPlayer = currentGame.whoseTurnIsIt();
    
    toggleBoardTurnVisualUI(whichPlayer);

    if (whichPlayer === 2) {
        // wait 2 seconds before letting computer move to simulate "thinking"
        await wait(2000);

        // Choose a random cell > dispatch click event on cell > trigger takeTurn()
        const [row, col] = currentGame.player2.generateNextMove();
        const cell = playerBoardUI.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.dispatchEvent(new MouseEvent("click"));
    }
}

function toggleBoardTurnVisualUI(whichPlayer) {
    if (whichPlayer === 1) {
        playerBoardUI.classList.add("half-opacity");
        enemyBoardUI.classList.remove("half-opacity", "disable");
        turnIndicator.textContent = "Your turn!";
    }
    else {
        enemyBoardUI.classList.add("half-opacity", "disable");
        playerBoardUI.classList.remove("half-opacity");
        turnIndicator.textContent = "Enemy's turn!";
    }   
}

function showWinnerVisualUI() {
    const winner = currentGame.winner;
    turnIndicator.textContent = `Winner is ${winner.name}!`;
}

// Needs to be called first before any other functions
function createGameUI(game) {
    // set current game
    currentGame = game;

    const uiContainer = document.createElement("div");

    turnIndicator = createTurnIndicator();
    playerBoardUI = createPlayBoard(game.player1.gameboard);
    enemyBoardUI = createPlayBoard(game.player2.gameboard, false);

    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("game-wrapper");

    // Group a name header with the Player's board
    const playerBoardWrapper = document.createElement("div");
    playerBoardWrapper.classList.add("board-wrapper");
    const playerNameHeader = document.createElement("h2");
    playerNameHeader.classList.add("name-heading");
    playerNameHeader.textContent = game.player1.name;

    playerBoardWrapper.appendChild(playerNameHeader);
    playerBoardWrapper.appendChild(playerBoardUI);

    // Group a name header with the enemy's board
    const enemyBoardWrapper = document.createElement("div");
    enemyBoardWrapper.classList.add("board-wrapper");
    const enemyNameHeader = document.createElement("h2");
    enemyNameHeader.classList.add("name-heading");
    enemyNameHeader.textContent = game.player2.name;

    enemyBoardWrapper.appendChild(enemyNameHeader);
    enemyBoardWrapper.appendChild(enemyBoardUI);

    // Put their gameboards side by side
    gameWrapper.appendChild(playerBoardWrapper);
    gameWrapper.appendChild(enemyBoardWrapper);

    uiContainer.appendChild(turnIndicator);
    uiContainer.appendChild(gameWrapper);

    return uiContainer;
}

export { createGameUI };