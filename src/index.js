import "./styles.css";
import { Game } from "./game";
import { createGameUI } from "./game-ui";

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
let gameContainer = createGameUI(game);
content.appendChild(gameContainer);


