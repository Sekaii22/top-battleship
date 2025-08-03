import { setCurrentGame, createPlayBoard, createPlacementBoard, createStatusIndicator, removeContent } from "./game-ui";
import { Game } from "./game";

const shipList = [
    {
        name: "Carrier",
        length: 5,
    },
    {
        name: "Battleship",
        length: 4,
    },
    {
        name: "Destroyer",
        length: 3,
    },
    {
        name: "Submarine",
        length: 3,
    },
    {
        name: "Patrol Boat",
        length: 2,
    },
];

function createStartPage() {
    const page = document.createElement("div");
    
    const startForm = document.createElement("form");
    startForm.classList.add("start-form");

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Player Name:";
    nameLabel.setAttribute("for", "player-name");

    const nameInput = document.createElement("input");
    nameInput.id = "player-name";
    nameInput.type = "text";
    nameInput.placeholder = "Name";
    nameInput.required = true;

    const startBtn = document.createElement("button");
    startBtn.id = "start-btn";
    startBtn.classList.add("text-btn")
    startBtn.textContent = "Start Game";
    
    startBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!startForm.checkValidity())
            return;

        const name = nameInput.value;

        // remove start page
        removeContent();

        // switch to ship placement page
        const content = document.querySelector(".content");
        const shipPlacementPage = createShipPlacementPage(name);
        content.appendChild(shipPlacementPage);
    });

    startForm.appendChild(nameLabel);
    startForm.appendChild(nameInput);
    startForm.appendChild(startBtn);

    page.appendChild(startForm);
    return page
}

function createShipPlacementPage(playerName) {
    const page = document.createElement("div");

    const statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Place your ships!";

    const showBoard = createPlacementBoard();
    
    // create btns for selecting ship type
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    shipList.forEach((ship) => {
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

    // create btns for selecting orientation
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

    startBattleBtn.addEventListener("click", () => {
        startBattleHandler(playerName);
    });

    buttonGroup.appendChild(startBattleBtn);
    
    // put btn group and showboard side by side
    const placementWrapper = document.createElement("div");
    placementWrapper.classList.add("flex-wrapper", "placement-wrapper");
    placementWrapper.appendChild(showBoard);
    placementWrapper.appendChild(buttonGroup);

    page.appendChild(statusIndicator);
    page.appendChild(placementWrapper);

    return page;
}

function startBattleHandler(playerName) {
    const placedShipCells = [...document.querySelectorAll(`.cell-selected[data-section="${0}"]`)];
    
    if (placedShipCells.length !== shipList.length) {
        alert("Place all your ships first before starting the game!");
        return;
    }

    // get player's info
    const playerShipDetails = [];

    placedShipCells.forEach((cell) => {
        const name = cell.dataset.shipName;
        const length = Number(cell.dataset.length);
        const coor = [Number(cell.dataset.row), Number(cell.dataset.col)];
        const orientation = cell.dataset.orientation;

        playerShipDetails.push({
            name,
            length,
            coor,
            orientation
        });
    });
    
    // remove ship placement page
    removeContent()
    
    // start game
    const content = document.querySelector(".content");
    const game = new Game(playerName, "Computer", playerShipDetails);
    const gameContainer = createGamePage(game);
    content.appendChild(gameContainer);
}

function createGamePage(game) {
    // set current game info for game-ui.js
    setCurrentGame(game);

    const page = document.createElement("div");

    const statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Your turn!";
    
    const playerBoardDiv = createPlayBoard(game.player1.gameboard);
    playerBoardDiv.classList.add("player-board");
    const enemyBoardDiv = createPlayBoard(game.player2.gameboard, false);
    enemyBoardDiv.classList.add("enemy-board")

    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("flex-wrapper", "game-wrapper");

    // Group player name header with the Player's board
    const playerBoardWrapper = document.createElement("div");
    const playerNameHeader = document.createElement("h2");
    playerNameHeader.classList.add("name-heading");
    playerNameHeader.textContent = game.player1.name;

    playerBoardWrapper.appendChild(playerNameHeader);
    playerBoardWrapper.appendChild(playerBoardDiv);

    // Group enemy name header with the enemy's board
    const enemyBoardWrapper = document.createElement("div");
    const enemyNameHeader = document.createElement("h2");
    enemyNameHeader.classList.add("name-heading");
    enemyNameHeader.textContent = game.player2.name;

    enemyBoardWrapper.appendChild(enemyNameHeader);
    enemyBoardWrapper.appendChild(enemyBoardDiv);

    // Put their gameboards side by side
    gameWrapper.appendChild(playerBoardWrapper);
    gameWrapper.appendChild(enemyBoardWrapper);

    page.appendChild(statusIndicator);
    page.appendChild(gameWrapper);

    return page;
}

export { createStartPage }