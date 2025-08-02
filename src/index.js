import "./styles.css";
import { Game } from "./game";
import { createGameUI, createShipPlacementUI, removeContent } from "./game-ui";

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

const ships = [
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
    ]

const shipPlacementContainer = createShipPlacementUI(ships); 

removeContent()
// content.appendChild(gameContainer);
content.appendChild(shipPlacementContainer);


