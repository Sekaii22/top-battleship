import { wait } from "./misc";

let currentGame;

function setCurrentGame(game) {
    currentGame = game;
    console.log("game-ui")
    console.log(currentGame)
}

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

            cell.addEventListener("click", takeTurnHandler);
        }
    }

    return boardDiv
}

function createStatusIndicator() {
    const statusIndicator = document.createElement("H1");
    statusIndicator.id = "game-status";

    return statusIndicator;
}

function takeTurnHandler(e) {
    const cell = e.currentTarget;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    
    console.log(currentGame);
    const turnResult = currentGame.takeTurn([row, col]);
    
    if (turnResult === 1 || turnResult === 2)
        cell.classList.add("cell-hit", "disable");
    else if (turnResult === 0) 
        cell.classList.add("cell-missed", "disable");
    else
        return;

    if (!currentGame.gameOver)
        changeTurn();
    else
        showWinnerVisualUI();

    // remove this event handler from the cell?
}

async function changeTurn() {
    const whichPlayer = currentGame.whoseTurnIsIt();
    
    toggleBoardTurnVisualUI(whichPlayer);

    if (whichPlayer === 2) {
        // wait 1 seconds before letting computer move to simulate "thinking"
        await wait(1000);

        // Get computer's next move > dispatch click event that board cell > triggers takeTurn()
        const [row, col] = currentGame.player2.generateNextMove();
        const playerBoardDiv = document.querySelector(".player-board");
        const cell = playerBoardDiv.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.dispatchEvent(new MouseEvent("click"));
    }
}

function toggleBoardTurnVisualUI(whichPlayer) {
    const statusIndicator = document.querySelector("#game-status");
    const playerBoardDiv = document.querySelector(".player-board");
    const enemyBoardDiv = document.querySelector(".enemy-board");

    if (whichPlayer === 1) {
        playerBoardDiv.classList.add("half-opacity");
        enemyBoardDiv.classList.remove("half-opacity", "disable");
        statusIndicator.textContent = "Your turn!";
    }
    else {
        enemyBoardDiv.classList.add("half-opacity", "disable");
        playerBoardDiv.classList.remove("half-opacity");
        statusIndicator.textContent = "Enemy's turn!";
    }   
}

function showWinnerVisualUI() {
    const statusIndicator = document.querySelector("#game-status");

    const winner = currentGame.winner;
    statusIndicator.textContent = `Winner is ${winner.name}!`;
}

function createPlacementBoard() {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board", "placement-board");

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

        const name = selectedShipBtn.textContent;
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
            cell.dataset.shipName = name;
            cell.dataset.section = i;
            cell.dataset.orientation = orient;
        }

        // remove highlight
        const highlightedCells = [...boardDiv.querySelectorAll(".cell.cell-highlight")];
        highlightedCells.forEach((cell) => {
            cell.classList.remove("cell-highlight");
        });
    });

    return boardDiv
}

function removeContent() {
    const content = document.querySelector(".content");

    if (!content)
        return;

    const child = content.firstElementChild;

    if (!child)
        return

    content.removeChild(child);
}

export { setCurrentGame, createPlayBoard, createPlacementBoard, createStatusIndicator, removeContent };