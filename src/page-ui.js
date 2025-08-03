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

}

function createShipPlacementPage() {
    const uiContainer = document.createElement("div");

    const statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Place your ships!";

    const showBoard = createPlacementBoard();
    
    // btns to select ships for placement
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

    // btns for selecting orientation
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

    startBattleBtn.addEventListener("click", startBattleHandler);

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

function startBattleHandler() {
    const content = document.querySelector(".content");
    const placementBoard = document.querySelector(".placement-board");
    const placedShipCells = [...document.querySelectorAll(`.cell-selected[data-section="${0}"]`)];

    if (placedShipCells.length !== shipList.length) {
        alert("Place all your ships first before starting the game!");
        return;
    }

    // placedShipCells.forEach((cell) => {
    //     cell.style.backgroundColor = "blue";
    // })
    
    // player's info
    const playerName = "You";
    const playerShipDetails = [
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

    removeContent()
    
    let game = new Game(playerName, enemyName, playerShipDetails, enemyShipDetails);
    const gameContainer = createGamePage(game);

    content.appendChild(gameContainer);
}

function createGamePage(game) {
    // set current game
    setCurrentGame(game);

    const uiContainer = document.createElement("div");

    const statusIndicator = createStatusIndicator();
    statusIndicator.textContent = "Your turn!";
    
    const playerBoardDiv = createPlayBoard(game.player1.gameboard);
    playerBoardDiv.classList.add("player-board");
    const enemyBoardDiv = createPlayBoard(game.player2.gameboard, false);
    enemyBoardDiv.classList.add("enemy-board")

    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("flex-wrapper", "game-wrapper");

    // Group a name header with the Player's board
    const playerBoardWrapper = document.createElement("div");
    const playerNameHeader = document.createElement("h2");
    playerNameHeader.classList.add("name-heading");
    playerNameHeader.textContent = game.player1.name;

    playerBoardWrapper.appendChild(playerNameHeader);
    playerBoardWrapper.appendChild(playerBoardDiv);

    // Group a name header with the enemy's board
    const enemyBoardWrapper = document.createElement("div");
    const enemyNameHeader = document.createElement("h2");
    enemyNameHeader.classList.add("name-heading");
    enemyNameHeader.textContent = game.player2.name;

    enemyBoardWrapper.appendChild(enemyNameHeader);
    enemyBoardWrapper.appendChild(enemyBoardDiv);

    // Put their gameboards side by side
    gameWrapper.appendChild(playerBoardWrapper);
    gameWrapper.appendChild(enemyBoardWrapper);

    uiContainer.appendChild(statusIndicator);
    uiContainer.appendChild(gameWrapper);

    return uiContainer;
}

export { createGamePage, createStartPage, createShipPlacementPage }