import { wait } from "./misc";
import { Game } from "./game";

let currentGame;
let statusIndicator;
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

function createStatusIndicator() {
    const statusIndicator = document.createElement("H1");
    statusIndicator.id = "game-status";

    return statusIndicator;
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
        statusIndicator.textContent = "Your turn!";
    }
    else {
        enemyBoardUI.classList.add("half-opacity", "disable");
        playerBoardUI.classList.remove("half-opacity");
        statusIndicator.textContent = "Enemy's turn!";
    }   
}

function showWinnerVisualUI() {
    const winner = currentGame.winner;
    statusIndicator.textContent = `Winner is ${winner.name}!`;
}

// Needs to be called first before any other functions
function createGameUI(game) {
    // set current game
    currentGame = game;

    const uiContainer = document.createElement("div");

    statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Your turn!";
    
    playerBoardUI = createPlayBoard(game.player1.gameboard);
    enemyBoardUI = createPlayBoard(game.player2.gameboard, false);

    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("flex-wrapper", "game-wrapper");

    // Group a name header with the Player's board
    const playerBoardWrapper = document.createElement("div");
    const playerNameHeader = document.createElement("h2");
    playerNameHeader.classList.add("name-heading");
    playerNameHeader.textContent = game.player1.name;

    playerBoardWrapper.appendChild(playerNameHeader);
    playerBoardWrapper.appendChild(playerBoardUI);

    // Group a name header with the enemy's board
    const enemyBoardWrapper = document.createElement("div");
    const enemyNameHeader = document.createElement("h2");
    enemyNameHeader.classList.add("name-heading");
    enemyNameHeader.textContent = game.player2.name;

    enemyBoardWrapper.appendChild(enemyNameHeader);
    enemyBoardWrapper.appendChild(enemyBoardUI);

    // Put their gameboards side by side
    gameWrapper.appendChild(playerBoardWrapper);
    gameWrapper.appendChild(enemyBoardWrapper);

    uiContainer.appendChild(statusIndicator);
    uiContainer.appendChild(gameWrapper);

    return uiContainer;
}

function createStartUI() {

}

function createShowBoard() {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");

    for(let row = 0; row < 10; row++) {
        for(let col = 0; col < 10; col++) {
            const cell = document.createElement("div");
            boardDiv.appendChild(cell);
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.classList.add("cell");
        }
    }

    boardDiv.addEventListener("mouseover", (e) => {
        if (e.target === boardDiv)
            return;

        const selectedShipBtn = document.querySelector(".ship-btn.selected");
        const selectedOrientationBtn = document.querySelector(".orientation-btn.selected");

        if (!selectedShipBtn)
            return;

        const length = Number(selectedShipBtn.dataset.length);
        const orient = selectedOrientationBtn.dataset.orientation;
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);
        
        // if length exceeds board size
        if ((orient === "h" && col + length - 1 > 9) ||
            (orient === "v" && row + length - 1 > 9)) {
            boardDiv.classList.add("disable-cursor");
            return;
        }
        
        const selectedCells = [];
        for (let i = 0; i < length; i++) {
            let nextRow;
            let nextCol;

            if (orient === "h") {
                nextRow = row;
                nextCol = col + i;
            }
            else {
                nextRow = row + i;
                nextCol = col;
            }

            const cell = boardDiv.querySelector(`.cell[data-row="${nextRow}"][data-col="${nextCol}"]`);
            selectedCells.push(cell);

            // if length of ship is overlapping already occupied cells
            if (cell.classList.contains("cell-selected")) {
                boardDiv.classList.add("disable-cursor");
                return;
            }
        }

        boardDiv.classList.remove("disable-cursor");

        selectedCells.forEach((cell) => {
            cell.classList.add("cell-highlight");
        })
    });

    boardDiv.addEventListener("mouseout", (e) => {
        if (e.target === boardDiv)
            return;

        const highlightedCells = [...boardDiv.querySelectorAll(".cell.cell-highlight")];
        highlightedCells.forEach((cell) => {
            cell.classList.remove("cell-highlight");
        });
    });

    boardDiv.addEventListener("click", (e) => {
        if (e.target === boardDiv)
            return;

        if (boardDiv.classList.contains("disable-cursor"))
            return;

        const selectedShipBtn = document.querySelector(".ship-btn.selected");
        const selectedOrientationBtn = document.querySelector(".orientation-btn.selected");

        if (!selectedShipBtn)
            return;

        const length = Number(selectedShipBtn.dataset.length);
        const orient = selectedOrientationBtn.dataset.orientation;
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);

        for (let i = 0; i < length; i++) {
            let nextRow;
            let nextCol;

            if (orient === "h") {
                nextRow = row;
                nextCol = col + i;
            }
            else {
                nextRow = row + i;
                nextCol = col;
            }

            const cell = boardDiv.querySelector(`.cell[data-row="${nextRow}"][data-col="${nextCol}"]`);
            cell.classList.add("cell-selected");
        }

        // remove highlight
        const highlightedCells = [...boardDiv.querySelectorAll(".cell.cell-highlight")];
        highlightedCells.forEach((cell) => {
            cell.classList.remove("cell-highlight");
        });
    });

    return boardDiv
}

// ships = [{name, length}, ...]
function createShipPlacementUI(ships) {
    const uiContainer = document.createElement("div");

    statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Place your ships!";

    const showBoard = createShowBoard();
    
    // btns to select ships for placement
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    ships.forEach((ship) => {
        const btn = document.createElement("button");
        
        btn.dataset.length = ship.length;
        btn.dataset.name = ship.name;
        btn.textContent = ship.name;
        btn.classList.add("block", "ship-btn");

        btn.addEventListener("click", () => {
            const btns = [...buttonGroup.querySelectorAll(".ship-btn")];
            btns.forEach((b) => {
                b.classList.remove("disable", "half-opacity", "selected");
            })

            btn.classList.add("disable", "half-opacity", "selected");
        })

        buttonGroup.appendChild(btn);
    })

    // btns for selecting ship placement orientation
    const orientationBtnGroup = document.createElement("div");
    orientationBtnGroup.classList.add("flex-wrapper", "orientation-btn-group");

    const horizontalPlacementBtn = document.createElement("button");
    const verticalPlacementBtn = document.createElement("button");

    horizontalPlacementBtn.classList.add("orientation-btn");
    horizontalPlacementBtn.textContent = "Horizontal";
    horizontalPlacementBtn.dataset.orientation = "h";
    horizontalPlacementBtn.classList.add("disable", "half-opacity", "selected");

    verticalPlacementBtn.classList.add("orientation-btn");
    verticalPlacementBtn.textContent = "Vertical";
    verticalPlacementBtn.dataset.orientation = "v";

    [horizontalPlacementBtn, verticalPlacementBtn].forEach((btn) => {
        btn.addEventListener("click", () => {
            const btns = [...buttonGroup.querySelectorAll(".orientation-btn")];

            btns.forEach((b) => {
                b.classList.remove("disable", "half-opacity", "selected");
            })

            btn.classList.add("disable", "half-opacity", "selected");
        })
    })

    orientationBtnGroup.appendChild(horizontalPlacementBtn);
    orientationBtnGroup.appendChild(verticalPlacementBtn);
    buttonGroup.appendChild(orientationBtnGroup);

    // game start btn
    const startBattleBtn = document.createElement("button")
    
    startBattleBtn.classList.add("start-battle-btn");
    startBattleBtn.textContent = "Start Battle";

    startBattleBtn.addEventListener("click", startBattle);

    buttonGroup.appendChild(startBattleBtn);
    
    // Put btn group and showboard side by side
    const placementWrapper = document.createElement("div");
    placementWrapper.classList.add("flex-wrapper", "placement-wrapper");
    placementWrapper.appendChild(showBoard);
    placementWrapper.appendChild(buttonGroup);

    uiContainer.appendChild(statusIndicator);
    uiContainer.appendChild(placementWrapper);

    return uiContainer;
}

function startBattle() {
    const content = document.querySelector(".content");
    
    // player's info
    const playerName = "You";
    let playerShipDetails = [
        {
            length: 2,
            coor: [0, 0],
        },
        {
            length: 2,
            coor: [5, 0],
        }
    ]

    // computer's info
    const enemyName = "Computer";
    let enemyShipDetails = [
        {
            length: 2,
            coor: [0, 0],
            orientation: "v",
        },
        {
            length: 2,
            coor: [5, 0],
            orientation: "v",
        }
    ]

    let game = new Game(playerName, enemyName, playerShipDetails, enemyShipDetails);
    const gameContainer = createGameUI(game);

    removeContent()
    content.appendChild(gameContainer);
}

function removeContent() {
    const content = document.querySelector(".content");

    if (!content)
        return;

    const child = content.firstElementChild;

    if (!child)
        return

    content.removeChild(child);

    currentGame = null;
    statusIndicator = null;
    playerBoardUI = null;
    enemyBoardUI = null;
}

export { createGameUI, createShipPlacementUI, removeContent };