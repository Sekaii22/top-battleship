import "./styles.css";
import { createGamePage, createShipPlacementPage } from "./page-ui";
import { removeContent } from "./game-ui";
import { Game } from "./game";

const content = document.querySelector(".content");

const shipPlacementContainer = createShipPlacementPage(); 

// player's info
// const playerName = "You";
// const playerShipDetails = [
//     {
//         length: 2,
//         coor: [0, 0],
//     },
//     {
//         length: 2,
//         coor: [5, 0],
//     }
// ]


// // computer's info

// const enemyName = "Computer";
// let enemyShipDetails = [
//     {
//         length: 2,
//         coor: [0, 0],
//         orientation: "v",
//     },
//     {
//         length: 2,
//         coor: [5, 0],
//         orientation: "v",
//     }
// ]

// let game = new Game(playerName, enemyName, playerShipDetails, enemyShipDetails);
// const gameContainer = createGamePage(game);

// removeContent()
// content.appendChild(gameContainer);

removeContent()
content.appendChild(shipPlacementContainer);


