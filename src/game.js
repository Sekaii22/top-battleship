import { Ship, Gameboard, Player } from "./battleship";

class Game {
    player1;
    player2;
    turn = 0;
    gameOver = false;

    constructor(p1Name, p2Name, p1ShipDetails=[], p2ShipDetails=[]) {
        this.player1 = new Player(p1Name);
        this.player2 = new Player(p2Name);

        for (let detail of p1ShipDetails) {
            this.player1.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
        }

        for (let detail of p2ShipDetails) {
            this.player2.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
        }
    }

    takeTurn(coor) {
        if (this.gameOver)
            return false;

        let result;
        if (this.turn % 2 === 0) {
            // player1's turn to attack
            result = this.player2.gameboard.receiveAttack(coor);
        } 
        else {
            // player2's turn to attack
            result = this.player1.gameboard.receiveAttack(coor);
        }
        
        // invalid attack
        if (result === null) {
            return false;
        }

        this.checkGameOver();
        this.turn += 1;

        return true;
    }

    checkGameOver() {
        if (this.player1.gameboard.allShipsDestroyed) {
            console.log("Winner is " + this.player2.name);
            this.gameOver = true;
        }

        else if (this.player2.gameboard.allShipsDestroyed) {
            console.log("Winner is " + this.player1.name);
            this.gameOver = true;
        }

        return this.gameOver;
    }
}

export { Game };